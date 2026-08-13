import { IStudyRepository, StudyCompletionResult, SrsRating } from '../../domain/repositories/IStudyRepository';
import { WordEntity } from '../../domain/entities/Word';
import { supabase } from './client';
import { OfflineSyncManager, getLocalDateString } from '../offline/offlineSyncManager';
import { shuffle } from '../../shared/utils/arrayUtils';
import { saveStudiedWordToLocal, getStudiedWordsFromLocal } from '../../shared/utils/studiedWordStorage';

let isStudiedTableAvailable: boolean = true;
let isFavoriteTableAvailable: boolean = true;
let isVocabTableAvailable: boolean = true;
let isAiGenerationAvailable: boolean = false;

const FALLBACK_NAMESPACE = '00000000-0000-4000-a000-000000000000';

function deterministicUUID(shortId: string): string {
  let hash = 0;
  for (let i = 0; i < shortId.length; i++) {
    const ch = shortId.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
  }
  const h = Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
  return `${h}-0000-4000-a000-000000000000`;
}

const FALLBACK_WORD_UUIDS: Record<string, string> = {
  'tr_1': deterministicUUID('tr_1'), 'tr_2': deterministicUUID('tr_2'), 'tr_3': deterministicUUID('tr_3'),
  'tr_4': deterministicUUID('tr_4'), 'tr_5': deterministicUUID('tr_5'),
  'fd_1': deterministicUUID('fd_1'), 'fd_2': deterministicUUID('fd_2'), 'fd_3': deterministicUUID('fd_3'), 'fd_4': deterministicUUID('fd_4'),
  'em_1': deterministicUUID('em_1'), 'em_2': deterministicUUID('em_2'), 'em_3': deterministicUUID('em_3'), 'em_4': deterministicUUID('em_4'),
  'sl_1': deterministicUUID('sl_1'), 'sl_2': deterministicUUID('sl_2'), 'sl_3': deterministicUUID('sl_3'),
  'dl_1': deterministicUUID('dl_1'), 'dl_2': deterministicUUID('dl_2'), 'dl_3': deterministicUUID('dl_3'), 'dl_4': deterministicUUID('dl_4'), 'dl_5': deterministicUUID('dl_5'),
};

const FALLBACK_UUID_TO_SHORT_ID: Record<string, string> = {};
for (const [shortId, uuid] of Object.entries(FALLBACK_WORD_UUIDS)) {
  FALLBACK_UUID_TO_SHORT_ID[uuid] = shortId;
}

function isValidUuid(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

async function fetchVocabulariesByIdsOrConcepts(rawIds: string[], categoryFilter?: string): Promise<any[]> {
  const cleanIds = rawIds.filter(Boolean);
  if (cleanIds.length === 0) return [];

  const uuidList = cleanIds.filter(isValidUuid);
  const codeList = cleanIds.filter((id) => !isValidUuid(id));

  const results: any[] = [];
  const seenIds = new Set<string>();

  let q = supabase.from('study_vocabularies').select('*');
  if (uuidList.length > 0 && codeList.length > 0) {
    q = q.or(`id.in.(${uuidList.join(',')}),concept_code.in.(${codeList.join(',')})`);
  } else if (uuidList.length > 0) {
    q = q.in('id', uuidList);
  } else if (codeList.length > 0) {
    q = q.in('concept_code', codeList);
  }

  if (categoryFilter && categoryFilter !== 'all') {
    const catNorm = categoryFilter.toLowerCase();
    if (catNorm === 'food') q = q.in('category', ['food', 'restaurant', 'shopping']);
    else if (catNorm === 'travel') q = q.in('category', ['travel', 'hospital']);
    else q = q.eq('category', catNorm);
  }

  const { data, error } = await q;
  if (!error && data) {
    data.forEach((item: any) => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        results.push(item);
      }
    });
  }

  return results;
}

async function attachImageWords(localWords: WordEntity[]): Promise<WordEntity[]> {
  const ids = localWords.filter((word) => isValidUuid(word.id)).map((word) => word.id);
  console.log('[StudyRepository IMAGE DEBUG] local image lookup ids:', ids);
  if (ids.length === 0) return localWords;

  try {
    const { data, error } = await supabase
      .from('study_vocabularies')
      .select('id, lesson_id, word_en, concept_code')
      .in('id', ids);
    console.log('[StudyRepository IMAGE DEBUG] vocabulary image rows:', { data, error });
    if (!data) return localWords;

    const imageWords = new Map(data.map((row: any) => [row.id, row.word_en || row.concept_code]));
    const lessonIds = new Map(data.map((row: any) => [row.id, row.lesson_id]));
    return localWords.map((word) => ({
      ...word,
      imageWord: word.imageWord || imageWords.get(word.id) || null,
      lessonId: word.lessonId || lessonIds.get(word.id) || null,
    }));
  } catch {
    return localWords;
  }
}

// Helper: Map language names/codes to standard 2-letter ISO codes (ko, en only)
const getStandardLangCode = (lang: string): string => {
  const norm = (lang || '').toLowerCase().trim();
  if (norm.startsWith('tl') || norm.includes('tagalog') || norm.includes('filipino')) return 'tl';
  if (norm.startsWith('ko') || norm.includes('korean')) return 'ko';
  if (norm.startsWith('en') || norm.includes('english')) return 'en';
  return 'en';
};

function getIsKoreanTarget(targetLang: string): boolean {
  const norm = (targetLang || '').toLowerCase().trim();
  return norm === 'ko' || norm === 'korean';
}

function getIsTagalogTarget(targetLang: string): boolean {
  const norm = (targetLang || '').toLowerCase().trim();
  return norm === 'tl' || norm === 'tagalog' || norm === 'filipino';
}

function buildFallbackWord(shortId: string, targetLang: string, nativeLang: string, now: string): WordEntity | null {
  const isKoreanTarget = getIsKoreanTarget(targetLang);
  const uuid = FALLBACK_WORD_UUIDS[shortId];
  if (!uuid) return null;

  const base = (wordTarget: string, wordNative: string, phonetic: string, exTarget: string, exNative: string, category: string): WordEntity => ({
    id: uuid, wordTarget, wordNative, phonetic,
    exampleSentence: exTarget, exampleTarget: exTarget, exampleNative: exNative,
    category, createdAt: now, nativeLang, targetLang,
  });

  switch (shortId) {
    case 'tr_1': return base(
      isKoreanTarget ? '여권' : 'Passport',
      isKoreanTarget ? 'Passport' : '여권',
      isKoreanTarget ? 'Yeogwon' : 'Passport',
      isKoreanTarget ? '여권을 보여주시겠어요?' : 'May I see your passport?',
      isKoreanTarget ? 'May I see your passport?' : '여권을 보여주시겠어요?',
      'travel');
    case 'tr_2': return base(
      isKoreanTarget ? '호텔' : 'Hotel',
      isKoreanTarget ? 'Hotel' : '호텔',
      isKoreanTarget ? 'Hotel' : 'Hotel',
      isKoreanTarget ? '호텔 위치가 어디인가요?' : 'Where is the hotel located?',
      isKoreanTarget ? 'Where is the hotel located?' : '호텔 위치가 어디인가요?',
      'travel');
    case 'tr_3': return base(
      isKoreanTarget ? '지하철역' : 'Subway station',
      isKoreanTarget ? 'Subway station' : '지하철역',
      isKoreanTarget ? 'Jihacheol-yeok' : 'Subway station',
      isKoreanTarget ? '가까운 지하철역이 어디인가요?' : 'Where is the nearest subway station?',
      isKoreanTarget ? 'Where is the nearest subway station?' : '가까운 지하철역이 어디예요?',
      'travel');
    case 'tr_4': return base(
      isKoreanTarget ? '표 / 티켓' : 'Ticket',
      isKoreanTarget ? 'Ticket' : '표 / 티켓',
      isKoreanTarget ? 'Pyo' : 'Ticket',
      isKoreanTarget ? '왕복 티켓 한 장 주세요.' : 'One round-trip ticket, please.',
      isKoreanTarget ? 'One round-trip ticket, please.' : '왕복 티켓 한 장 주세요.',
      'travel');
    case 'tr_5': return base(
      isKoreanTarget ? '여기 어디예요?' : 'Where is this place?',
      isKoreanTarget ? 'Where is this place?' : '여기 어디예요?',
      isKoreanTarget ? 'Yeogi eodi-yeyo?' : 'Where is this place?',
      isKoreanTarget ? '실례지만 여기 어디예요?' : 'Excuse me, where is this place?',
      isKoreanTarget ? 'Excuse me, where is this place?' : '실례지만 여기 어디예요?',
      'travel');
    case 'fd_1': return base(
      isKoreanTarget ? '메뉴판' : 'Menu',
      isKoreanTarget ? 'Menu' : '메뉴판',
      isKoreanTarget ? 'Menyupan' : 'Menu',
      isKoreanTarget ? '메뉴판 좀 보여주시겠어요?' : 'Could you show me the menu please?',
      isKoreanTarget ? 'Could you show me the menu please?' : '메뉴판 좀 보여주시겠어요?',
      'food');
    case 'fd_2': return base(
      isKoreanTarget ? '물 / 음료' : 'Water',
      isKoreanTarget ? 'Water' : '물 / 음료',
      isKoreanTarget ? 'Mul' : 'Water',
      isKoreanTarget ? '시원한 물 한 잔만 주세요.' : 'Please give me a glass of cold water.',
      isKoreanTarget ? 'Please give me a glass of cold water.' : '시원한 물 한 잔만 주세요.',
      'food');
    case 'fd_3': return base(
      isKoreanTarget ? '계산서' : 'Bill',
      isKoreanTarget ? 'Bill / Check' : '계산서',
      isKoreanTarget ? 'Gyesanseo' : 'Bill',
      isKoreanTarget ? '여기 계산서 좀 부탁드려요.' : 'Check please.',
      isKoreanTarget ? 'Check please.' : '여기 계산서 좀 부탁드려요.',
      'food');
    case 'fd_4': return base(
      isKoreanTarget ? '이거 정말 맛있네요!' : 'This is so delicious!',
      isKoreanTarget ? 'This is delicious!' : '이거 정말 맛있네요!',
      isKoreanTarget ? 'Igeot jeongmal mas-itneyo!' : 'This is so delicious!',
      isKoreanTarget ? '음식이 입에 아주 잘 맞고 맛있어요.' : 'The food suits my taste perfectly.',
      isKoreanTarget ? 'The food suits my taste perfectly.' : '음식이 정말 입에 잘 맞고 맛있어요.',
      'food');
    case 'em_1': return base(
      isKoreanTarget ? '보고 싶어' : 'I miss you',
      isKoreanTarget ? 'I miss you' : '보고 싶어',
      isKoreanTarget ? 'Bogo sipeo' : 'I miss you',
      isKoreanTarget ? '오늘따라 네가 너무 보고 싶어.' : 'I miss you so much today.',
      isKoreanTarget ? 'I miss you so much today.' : '오늘따라 네가 정말 보고 싶어.',
      'emotions');
    case 'em_2': return base(
      isKoreanTarget ? '고마워요' : 'Thank you',
      isKoreanTarget ? 'Thank you' : '고마워요',
      isKoreanTarget ? 'Gomawoyo' : 'Thank you',
      isKoreanTarget ? '항상 내 곁에 있어줘서 고마워.' : 'Thank you for always being by my side.',
      isKoreanTarget ? 'Thank you for always being by my side.' : '언제나 내 옆에 있어줘서 고마워.',
      'emotions');
    case 'em_3': return base(
      isKoreanTarget ? '푹 쉬어요' : 'Rest well',
      isKoreanTarget ? 'Take care / Rest well' : '푹 쉬어요',
      isKoreanTarget ? 'Puk swieoyo' : 'Rest well',
      isKoreanTarget ? '오늘 고생 많았어, 푹 쉬어!' : 'You worked hard today, rest well!',
      isKoreanTarget ? 'You worked hard today, rest well!' : '오늘 하루 수고했어, 푹 쉬어!',
      'emotions');
    case 'em_4': return base(
      isKoreanTarget ? '힘내요!' : 'Cheer up!',
      isKoreanTarget ? 'Cheer up!' : '힘내요!',
      isKoreanTarget ? 'Himnaeyo!' : 'Cheer up!',
      isKoreanTarget ? '언제나 응원할게, 힘내!' : 'I am always rooting for you, cheer up!',
      isKoreanTarget ? 'I am always rooting for you, cheer up!' : '항상 널 응원하고 있어, 힘내!',
      'emotions');
    case 'sl_1': return base(
      isKoreanTarget ? '대박' : 'Awesome',
      isKoreanTarget ? 'Awesome / Flex' : '대박',
      isKoreanTarget ? 'Daebak' : 'Awesome',
      isKoreanTarget ? '와, 이거 진짜 대박이다!' : 'Wow, this is really awesome!',
      isKoreanTarget ? 'Wow, this is truly awesome!' : '와, 이번 거 진짜 대박이다!',
      'social');
    case 'sl_2': return base(
      isKoreanTarget ? '헐' : 'OMG',
      isKoreanTarget ? 'No way / Really?' : '헐',
      isKoreanTarget ? 'Heol' : 'OMG',
      isKoreanTarget ? '헐, 진짜 그게 사실이야?' : 'OMG, is that really true?',
      isKoreanTarget ? 'OMG, is that for real?' : '헐, 진짜로 그게 맞다고?',
      'social');
    case 'sl_3': return base(
      isKoreanTarget ? '베프' : 'Bestie',
      isKoreanTarget ? 'Best friend / Bestie' : '베프',
      isKoreanTarget ? 'Bepeu' : 'Bestie',
      isKoreanTarget ? '우리는 세상에서 제일 친한 베프야.' : 'We are best friends forever.',
      isKoreanTarget ? 'We are the best of friends.' : '우리 둘은 세상 최고의 베프야.',
      'social');
    case 'dl_1': return base(
      isKoreanTarget ? '물' : 'Water',
      isKoreanTarget ? 'Water' : '물',
      isKoreanTarget ? 'Mul' : 'Water',
      isKoreanTarget ? '시원한 물 한 잔 주세요.' : 'Please give me a glass of cold water.',
      isKoreanTarget ? 'Please give me a glass of cold water.' : '시원한 물 한 잔만 주세요.',
      'daily');
    case 'dl_2': return base(
      isKoreanTarget ? '맛있다' : 'Delicious',
      isKoreanTarget ? 'Delicious' : '맛있다',
      isKoreanTarget ? 'Mas-itda' : 'Delicious',
      isKoreanTarget ? '오늘 점심 정말 맛있었어요!' : "Today's lunch was really delicious!",
      isKoreanTarget ? "Lunch was so delicious today!" : '오늘 점심 진짜 맛있었어요!',
      'daily');
    case 'dl_3': return base(
      isKoreanTarget ? '친구' : 'Friend',
      isKoreanTarget ? 'Friend' : '친구',
      isKoreanTarget ? 'Chingu' : 'Friend',
      isKoreanTarget ? '주말에 친구를 만나러 가요.' : 'I am going to meet my friend this weekend.',
      isKoreanTarget ? "I'm meeting my friend this weekend." : '이번 주말에 친구 만나러 가요.',
      'daily');
    case 'dl_4': return base(
      isKoreanTarget ? '좋은 아침' : 'Good morning',
      isKoreanTarget ? 'Good Morning' : '좋은 아침',
      isKoreanTarget ? 'Jo-eun achim' : 'Good morning',
      isKoreanTarget ? '좋은 아침이에요! 오늘도 행복한 하루 보내세요.' : 'Good morning! Have a wonderful day.',
      isKoreanTarget ? 'Good morning! Hope you have a happy day.' : '좋은 아침! 오늘 하루도 화이팅해요.',
      'daily');
    case 'dl_5': return base(
      isKoreanTarget ? '오늘 하루 어땠어?' : 'How was your day?',
      isKoreanTarget ? 'How was your day?' : '오늘 하루 어땠어?',
      isKoreanTarget ? 'Oneul haru eottaesseo?' : 'How was your day?',
      isKoreanTarget ? '오늘 하루 어땠어? 이야기해 줘.' : 'How was your day? Tell me all about it.',
      isKoreanTarget ? 'How was your day? Tell me all about it.' : '오늘 하루는 어땠어? 이야기해 줘.',
      'daily');
    default: return null;
  }
}

export class SupabaseStudyRepository implements IStudyRepository {
  async getTodayWords(
    nativeLang: string = 'en',
    targetLang: string = 'ko',
    category: string = 'all',
    userId?: string
  ): Promise<WordEntity[]> {
    // 0th: Fetch SRS Review words (max 2) + studied IDs for deduplication
    let reviewWords: WordEntity[] = [];
    let reviewConceptIds: string[] = [];
    let studiedIds: string[] = [];

    const nativeCode = getStandardLangCode(nativeLang);
    const targetCode = getStandardLangCode(targetLang);

    if (userId && userId !== 'guest_user' && isStudiedTableAvailable) {
      try {
        const nowIso = new Date().toISOString();
        const [srsResult, studiedResult] = await Promise.all([
          supabase
            .from('user_studied_words')
            .select('concept_id, srs_stage')
            .eq('user_id', userId)
            .lte('next_review_at', nowIso)
            .order('next_review_at', { ascending: true })
            .limit(2),
          supabase
            .from('user_studied_words')
            .select('concept_id')
            .eq('user_id', userId)
        ]);

        const srsData = srsResult.data;
        if (srsData && srsData.length > 0) {
          reviewConceptIds = srsData.map((d: any) => d.concept_id).filter(Boolean);
          const srsStageMap: Record<string, number> = {};
          srsData.forEach((d: any) => {
            if (d.concept_id) srsStageMap[d.concept_id] = d.srs_stage || 0;
          });

          const revVocab = await fetchVocabulariesByIdsOrConcepts(reviewConceptIds, category);

          if (revVocab && revVocab.length > 0) {
            reviewWords = revVocab.map((row: any) => {
              const wNative = row[`word_${nativeCode}`] || row.word_ko || row.word_en;
              const wTarget = row[`word_${targetCode}`] || row.word_en || row.word_ko;
              const exNative = row[`example_${nativeCode}`] || row.example_ko || row.example_en;
              const exTarget = row[`example_${targetCode}`] || row.example_en || row.example_ko;
              const phonetic = row[`phonetic_${targetCode}`] || null;

              return {
                id: row.id,
                conceptId: row.id,
                wordNative: wNative,
                wordTarget: wTarget,
                phonetic,
                exampleSentence: exTarget,
                exampleNative: exNative,
                exampleTarget: exTarget,
                nativeLang,
                targetLang,
                category: row.category || 'daily',
                isReview: true,
                srsStage: srsStageMap[row.id] ?? 0,
                createdAt: row.created_at,
                ttsAudioUrl: row.tts_audio_url || null,
                ttsProvider: row.tts_provider || null,
                ttsVoiceName: row.tts_voice_name || null,
              };
            });
          }
        }

        const studiedData = studiedResult.data;
        const studiedErr = studiedResult.error;
        if (studiedErr) {
          isStudiedTableAvailable = false;
        } else if (studiedData && studiedData.length > 0) {
          studiedIds = studiedData.map((d: any) => d.concept_id).filter(Boolean);
        }
      } catch (e) {
        isStudiedTableAvailable = false;
      }
    }

    const neededNewCount = Math.max(5 - reviewWords.length, 3);

    // 1st: Query Unified Multilingual Table (study_vocabularies) for new words
    if (isVocabTableAvailable) {
      try {
        let uQuery = supabase.from('study_vocabularies').select('*');
        if (category && category !== 'all') {
          const catNorm = category.toLowerCase();
          if (catNorm === 'food') {
            uQuery = uQuery.in('category', ['food', 'restaurant', 'shopping']);
          } else if (catNorm === 'travel') {
            uQuery = uQuery.in('category', ['travel', 'hospital']);
          } else {
            uQuery = uQuery.eq('category', catNorm);
          }
        }
        if (reviewConceptIds.length > 0) {
          uQuery = uQuery.not('id', 'in', `(${reviewConceptIds.join(',')})`);
        }

        const { data: uData, error: uErr } = await uQuery.limit(20);

        if (uErr) {
          isVocabTableAvailable = false;
        } else if (uData && uData.length > 0) {
          const shuffledRows = shuffle(uData);
          const selectedRows = shuffledRows.slice(0, neededNewCount);

          const newWords: WordEntity[] = selectedRows.map((row: any) => {
            const wNative = row[`word_${nativeCode}`] || row.word_ko || row.word_en;
            const wTarget = row[`word_${targetCode}`] || row.word_en || row.word_ko;
            const exNative = row[`example_${nativeCode}`] || row.example_ko || row.example_en;
            const exTarget = row[`example_${targetCode}`] || row.example_en || row.example_ko;
            const phonetic = row[`phonetic_${targetCode}`] || null;

            return {
              id: row.id,
              conceptId: row.id,
              wordNative: wNative,
              wordTarget: wTarget,
              imageWord: row.word_en || row.concept_code,
              lessonId: row.lesson_id || null,
              phonetic: phonetic,
              exampleSentence: exTarget,
              exampleNative: exNative,
              exampleTarget: exTarget,
              nativeLang,
              targetLang,
              category: row.category || 'daily',
              difficultyLevel: row.difficulty_level || 'A1',
              isReview: false,
              srsStage: 0,
              createdAt: row.created_at,
              ttsAudioUrl: row.tts_audio_url || null,
              ttsProvider: row.tts_provider || null,
              ttsVoiceName: row.tts_voice_name || null,
            };
          });

          const combined = [...reviewWords, ...newWords].slice(0, 5);
          return combined;
        }
      } catch (err) {
        isVocabTableAvailable = false;
      }
    }

    // 2nd: Background Async AI Generation (Non-blocking: triggers AI in background to seed future words while serving DB/Fallback instantly)
    if (isAiGenerationAvailable) {
      supabase.functions.invoke('generate-study-words', {
        body: { nativeLang, targetLang, category: category === 'all' ? 'daily' : category },
      }).catch(() => {
        isAiGenerationAvailable = false;
      });
    }

    const now = new Date().toISOString();

    const normTarget = (targetLang || '').toLowerCase().trim();
    const isKoreanTarget = normTarget === 'ko' || normTarget === 'korean';

    // Travel & Directions Dataset
    const travelDataset: WordEntity[] = [
      {
        id: 'tr_1',
        wordNative: isKoreanTarget ? 'Passport' : '여권',
        wordTarget: isKoreanTarget ? '여권' : 'Passport',
        phonetic: isKoreanTarget ? 'Yeogwon' : 'Passport',
        exampleSentence: isKoreanTarget ? '여권을 보여주시겠어요?' : 'May I see your passport?',
        exampleTarget: isKoreanTarget ? '여권을 보여주시겠어요?' : 'May I see your passport?',
        exampleNative: isKoreanTarget ? 'May I see your passport?' : '여권을 보여주시겠어요?',
        category: 'travel',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'tr_2',
        wordNative: isKoreanTarget ? 'Hotel' : '호텔',
        wordTarget: isKoreanTarget ? '호텔' : 'Hotel',
        phonetic: isKoreanTarget ? 'Hotel' : 'Hotel',
        exampleSentence: isKoreanTarget ? '호텔 위치가 어디인가요?' : 'Where is the hotel located?',
        exampleTarget: isKoreanTarget ? '호텔 위치가 어디인가요?' : 'Where is the hotel located?',
        exampleNative: isKoreanTarget ? 'Where is the hotel located?' : '호텔 위치가 어디인가요?',
        category: 'travel',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'tr_3',
        wordNative: isKoreanTarget ? 'Subway station' : '지하철역',
        wordTarget: isKoreanTarget ? '지하철역' : 'Subway station',
        phonetic: isKoreanTarget ? 'Jihacheol-yeok' : 'Subway station',
        exampleSentence: isKoreanTarget ? '가까운 지하철역이 어디인가요?' : 'Where is the nearest subway station?',
        exampleTarget: isKoreanTarget ? '가까운 지하철역이 어디인가요?' : 'Where is the nearest subway station?',
        exampleNative: isKoreanTarget ? 'Where is the nearest subway station?' : '가까운 지하철역이 어디예요?',
        category: 'travel',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'tr_4',
        wordNative: isKoreanTarget ? 'Ticket' : '표 / 티켓',
        wordTarget: isKoreanTarget ? '표 / 티켓' : 'Ticket',
        phonetic: isKoreanTarget ? 'Pyo' : 'Ticket',
        exampleSentence: isKoreanTarget ? '왕복 티켓 한 장 주세요.' : 'One round-trip ticket, please.',
        exampleTarget: isKoreanTarget ? '왕복 티켓 한 장 주세요.' : 'One round-trip ticket, please.',
        exampleNative: isKoreanTarget ? 'One round-trip ticket, please.' : '왕복 티켓 한 장 주세요.',
        category: 'travel',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'tr_5',
        wordNative: isKoreanTarget ? 'Where is this place?' : '여기 어디예요?',
        wordTarget: isKoreanTarget ? '여기 어디예요?' : 'Where is this place?',
        phonetic: isKoreanTarget ? 'Yeogi eodi-yeyo?' : 'Where is this place?',
        exampleSentence: isKoreanTarget ? '실례지만 여기 어디예요?' : 'Excuse me, where is this place?',
        exampleTarget: isKoreanTarget ? '실례지만 여기 어디예요?' : 'Excuse me, where is this place?',
        exampleNative: isKoreanTarget ? 'Excuse me, where is this place?' : '실례지만 여기 어디예요?',
        category: 'travel',
        createdAt: now,
        nativeLang,
        targetLang,
      },
    ];

    // Food & Dining Dataset
    const foodDataset: WordEntity[] = [
      {
        id: 'fd_1',
        wordNative: isKoreanTarget ? 'Menu' : '메뉴판',
        wordTarget: isKoreanTarget ? '메뉴판' : 'Menu',
        phonetic: isKoreanTarget ? 'Menyupan' : 'Menu',
        exampleSentence: isKoreanTarget ? '메뉴판 좀 보여주시겠어요?' : 'Could you show me the menu please?',
        exampleTarget: isKoreanTarget ? '메뉴판 좀 보여주시겠어요?' : 'Could you show me the menu please?',
        exampleNative: isKoreanTarget ? 'Could you show me the menu please?' : '메뉴판 좀 보여주시겠어요?',
        category: 'food',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'fd_2',
        wordNative: isKoreanTarget ? 'Water' : '물 / 음료',
        wordTarget: isKoreanTarget ? '물 / 음료' : 'Water',
        phonetic: isKoreanTarget ? 'Mul' : 'Water',
        exampleSentence: isKoreanTarget ? '시원한 물 한 잔만 주세요.' : 'Please give me a glass of cold water.',
        exampleTarget: isKoreanTarget ? '시원한 물 한 잔만 주세요.' : 'Please give me a glass of cold water.',
        exampleNative: isKoreanTarget ? 'Please give me a glass of cold water.' : '시원한 물 한 잔만 주세요.',
        category: 'food',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'fd_3',
        wordNative: isKoreanTarget ? 'Bill / Check' : '계산서',
        wordTarget: isKoreanTarget ? '계산서' : 'Bill',
        phonetic: isKoreanTarget ? 'Gyesanseo' : 'Bill',
        exampleSentence: isKoreanTarget ? '여기 계산서 좀 부탁드려요.' : 'Check please.',
        exampleTarget: isKoreanTarget ? '여기 계산서 좀 부탁드려요.' : 'Check please.',
        exampleNative: isKoreanTarget ? 'Check please.' : '여기 계산서 좀 부탁드려요.',
        category: 'food',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'fd_4',
        wordNative: isKoreanTarget ? 'This is delicious!' : '이거 정말 맛있네요!',
        wordTarget: isKoreanTarget ? '이거 정말 맛있네요!' : 'This is so delicious!',
        phonetic: isKoreanTarget ? 'Igeot jeongmal mas-itneyo!' : 'This is so delicious!',
        exampleSentence: isKoreanTarget ? '음식이 입에 아주 잘 맞고 맛있어요.' : 'The food suits my taste perfectly.',
        exampleTarget: isKoreanTarget ? '음식이 입에 아주 잘 맞고 맛있어요.' : 'The food suits my taste perfectly.',
        exampleNative: isKoreanTarget ? 'The food suits my taste perfectly.' : '음식이 정말 입에 잘 맞고 맛있어요.',
        category: 'food',
        createdAt: now,
        nativeLang,
        targetLang,
      },
    ];

    // Emotions & Caring Dataset
    const emotionsDataset: WordEntity[] = [
      {
        id: 'em_1',
        wordNative: isKoreanTarget ? 'I miss you' : '보고 싶어',
        wordTarget: isKoreanTarget ? '보고 싶어' : 'I miss you',
        phonetic: isKoreanTarget ? 'Bogo sipeo' : 'I miss you',
        exampleSentence: isKoreanTarget ? '오늘따라 네가 너무 보고 싶어.' : 'I miss you so much today.',
        exampleTarget: isKoreanTarget ? '오늘따라 네가 너무 보고 싶어.' : 'I miss you so much today.',
        exampleNative: isKoreanTarget ? 'I miss you so much today.' : '오늘따라 네가 정말 보고 싶어.',
        category: 'emotions',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'em_2',
        wordNative: isKoreanTarget ? 'Thank you' : '고마워요',
        wordTarget: isKoreanTarget ? '고마워요' : 'Thank you',
        phonetic: isKoreanTarget ? 'Gomawoyo' : 'Thank you',
        exampleSentence: isKoreanTarget ? '항상 내 곁에 있어줘서 고마워.' : 'Thank you for always being by my side.',
        exampleTarget: isKoreanTarget ? '항상 내 곁에 있어줘서 고마워.' : 'Thank you for always being by my side.',
        exampleNative: isKoreanTarget ? 'Thank you for always being by my side.' : '언제나 내 옆에 있어줘서 고마워.',
        category: 'emotions',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'em_3',
        wordNative: isKoreanTarget ? 'Take care / Rest well' : '푹 쉬어요',
        wordTarget: isKoreanTarget ? '푹 쉬어요' : 'Rest well',
        phonetic: isKoreanTarget ? 'Puk swieoyo' : 'Rest well',
        exampleSentence: isKoreanTarget ? '오늘 고생 많았어, 푹 쉬어!' : 'You worked hard today, rest well!',
        exampleTarget: isKoreanTarget ? '오늘 고생 많았어, 푹 쉬어!' : 'You worked hard today, rest well!',
        exampleNative: isKoreanTarget ? 'You worked hard today, rest well!' : '오늘 하루 수고했어, 푹 쉬어!',
        category: 'emotions',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'em_4',
        wordNative: isKoreanTarget ? 'Cheer up!' : '힘내요!',
        wordTarget: isKoreanTarget ? '힘내요!' : 'Cheer up!',
        phonetic: isKoreanTarget ? 'Himnaeyo!' : 'Cheer up!',
        exampleSentence: isKoreanTarget ? '언제나 응원할게, 힘내!' : 'I am always rooting for you, cheer up!',
        exampleTarget: isKoreanTarget ? '언제나 응원할게, 힘내!' : 'I am always rooting for you, cheer up!',
        exampleNative: isKoreanTarget ? 'I am always rooting for you, cheer up!' : '항상 널 응원하고 있어, 힘내!',
        category: 'emotions',
        createdAt: now,
        nativeLang,
        targetLang,
      },
    ];

    // Social & Talk Dataset
    const socialDataset: WordEntity[] = [
      {
        id: 'sl_1',
        wordNative: isKoreanTarget ? 'Awesome / Flex' : '대박',
        wordTarget: isKoreanTarget ? '대박' : 'Awesome',
        phonetic: isKoreanTarget ? 'Daebak' : 'Awesome',
        exampleSentence: isKoreanTarget ? '와, 이거 진짜 대박이다!' : 'Wow, this is really awesome!',
        exampleTarget: isKoreanTarget ? '와, 이거 진짜 대박이다!' : 'Wow, this is really awesome!',
        exampleNative: isKoreanTarget ? 'Wow, this is truly awesome!' : '와, 이번 거 진짜 대박이다!',
        category: 'social',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'sl_2',
        wordNative: isKoreanTarget ? 'No way / Really?' : '헐',
        wordTarget: isKoreanTarget ? '헐' : 'OMG',
        phonetic: isKoreanTarget ? 'Heol' : 'OMG',
        exampleSentence: isKoreanTarget ? '헐, 진짜 그게 사실이야?' : 'OMG, is that really true?',
        exampleTarget: isKoreanTarget ? '헐, 진짜 그게 사실이야?' : 'OMG, is that really true?',
        exampleNative: isKoreanTarget ? 'OMG, is that for real?' : '헐, 진짜로 그게 맞다고?',
        category: 'social',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'sl_3',
        wordNative: isKoreanTarget ? 'Best friend / Bestie' : '베프',
        wordTarget: isKoreanTarget ? '베프' : 'Bestie',
        phonetic: isKoreanTarget ? 'Bepeu' : 'Bestie',
        exampleSentence: isKoreanTarget ? '우리는 세상에서 제일 친한 베프야.' : 'We are best friends forever.',
        exampleTarget: isKoreanTarget ? '우리는 세상에서 제일 친한 베프야.' : 'We are best friends forever.',
        exampleNative: isKoreanTarget ? 'We are the best of friends.' : '우리 둘은 세상 최고의 베프야.',
        category: 'social',
        createdAt: now,
        nativeLang,
        targetLang,
      },
    ];

    // Default Daily Life Dataset
    const dailyDataset: WordEntity[] = [
      {
        id: 'dl_1',
        wordNative: isKoreanTarget ? 'Water' : '물',
        wordTarget: isKoreanTarget ? '물' : 'Water',
        phonetic: isKoreanTarget ? 'Mul' : 'Water',
        exampleSentence: isKoreanTarget ? '시원한 물 한 잔 주세요.' : 'Please give me a glass of cold water.',
        exampleTarget: isKoreanTarget ? '시원한 물 한 잔 주세요.' : 'Please give me a glass of cold water.',
        exampleNative: isKoreanTarget ? 'Please give me a glass of cold water.' : '시원한 물 한 잔만 주세요.',
        category: 'daily',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'dl_2',
        wordNative: isKoreanTarget ? 'Delicious' : '맛있다',
        wordTarget: isKoreanTarget ? '맛있다' : 'Delicious',
        phonetic: isKoreanTarget ? 'Mas-itda' : 'Delicious',
        exampleSentence: isKoreanTarget ? '오늘 점심 정말 맛있었어요!' : "Today's lunch was really delicious!",
        exampleTarget: isKoreanTarget ? '오늘 점심 정말 맛있었어요!' : "Today's lunch was really delicious!",
        exampleNative: isKoreanTarget ? 'Lunch was so delicious today!' : '오늘 점심 진짜 맛있었어요!',
        category: 'daily',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'dl_3',
        wordNative: isKoreanTarget ? 'Friend' : '친구',
        wordTarget: isKoreanTarget ? '친구' : 'Friend',
        phonetic: isKoreanTarget ? 'Chingu' : 'Friend',
        exampleSentence: isKoreanTarget ? '주말에 친구를 만나러 가요.' : 'I am going to meet my friend this weekend.',
        exampleTarget: isKoreanTarget ? '주말에 친구를 만나러 가요.' : 'I am going to meet my friend this weekend.',
        exampleNative: isKoreanTarget ? "I'm meeting my friend this weekend." : '이번 주말에 친구 만나러 가요.',
        category: 'daily',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'dl_4',
        wordNative: isKoreanTarget ? 'Good Morning' : '좋은 아침',
        wordTarget: isKoreanTarget ? '좋은 아침' : 'Good morning',
        phonetic: isKoreanTarget ? 'Jo-eun achim' : 'Good morning',
        exampleSentence: isKoreanTarget ? '좋은 아침이에요! 오늘도 행복한 하루 보내세요.' : 'Good morning! Have a wonderful day.',
        exampleTarget: isKoreanTarget ? '좋은 아침이에요! 오늘도 행복한 하루 보내세요.' : 'Good morning! Have a wonderful day.',
        exampleNative: isKoreanTarget ? 'Good morning! Hope you have a happy day.' : '좋은 아침! 오늘 하루도 화이팅해요.',
        category: 'daily',
        createdAt: now,
        nativeLang,
        targetLang,
      },
      {
        id: 'dl_5',
        wordNative: isKoreanTarget ? 'How was your day?' : '오늘 하루 어땠어?',
        wordTarget: isKoreanTarget ? '오늘 하루 어땠어?' : 'How was your day?',
        phonetic: isKoreanTarget ? 'Oneul haru eottaesseo?' : 'How was your day?',
        exampleSentence: isKoreanTarget ? '오늘 하루 어땠어? 이야기해 줘.' : 'How was your day? Tell me all about it.',
        exampleTarget: isKoreanTarget ? '오늘 하루 어땠어? 이야기해 줘.' : 'How was your day? Tell me all about it.',
        exampleNative: isKoreanTarget ? 'How was your day? Tell me all about it.' : '오늘 하루는 어땠어? 이야기해 줘.',
        category: 'daily',
        createdAt: now,
        nativeLang,
        targetLang,
      },
    ];

    const allFallbackWords: WordEntity[] = [
      ...dailyDataset,
      ...foodDataset,
      ...emotionsDataset,
      ...travelDataset,
      ...socialDataset,
    ];

    const targetCategory = category ? category.toLowerCase() : 'all';

    // Map legacy category keys to modern 5 categories if needed
    const normalizedCategory = targetCategory === 'restaurant' || targetCategory === 'shopping'
      ? 'food'
      : targetCategory === 'hospital'
      ? 'travel'
      : targetCategory;

    const filteredFallback = normalizedCategory && normalizedCategory !== 'all'
      ? allFallbackWords.filter((w) => w.category === normalizedCategory)
      : allFallbackWords;

    const targetPool = filteredFallback.length >= 3 ? filteredFallback : allFallbackWords;
    const shuffledFallback = shuffle(targetPool).slice(0, 5);
    return shuffledFallback.map((w) => ({
      ...w,
      id: FALLBACK_WORD_UUIDS[w.id] || w.id,
    }));
  }

  async getDueReviewWords(userId: string, nativeLang: string = 'en', targetLang: string = 'ko'): Promise<WordEntity[]> {
    const localWords = await getStudiedWordsFromLocal(userId);

    if (!userId || userId === 'guest_user' || !isStudiedTableAvailable) {
      return localWords;
    }

    const nativeCode = getStandardLangCode(nativeLang);
    const targetCode = getStandardLangCode(targetLang);

    try {
      const nowIso = new Date().toISOString();
      const { data: srsData, error: srsErr } = await supabase
        .from('user_studied_words')
        .select('concept_id, srs_stage')
        .eq('user_id', userId)
        .lte('next_review_at', nowIso)
        .order('next_review_at', { ascending: true });

      if (srsErr) {
        isStudiedTableAvailable = false;
        return [];
      }

      // Include legacy AI review rows so existing quiz progress remains reviewable.
      const { data: aiReviewData } = await supabase
        .from('ai_review_items')
        .select('vocabulary_id, srs_stage')
        .eq('user_id', userId)
        .lte('next_review_at', nowIso)
        .order('next_review_at', { ascending: true });

      const reviewRecords = [
        ...(srsData || []).map((d: any) => ({ id: d.concept_id, stage: d.srs_stage })),
        ...(aiReviewData || []).map((d: any) => ({ id: d.vocabulary_id, stage: d.srs_stage })),
      ].filter((record) => record.id);

      if (reviewRecords.length > 0) {
        const conceptIds = Array.from(new Set(reviewRecords.map((record) => record.id)));
        const srsStageMap: Record<string, number> = {};
        reviewRecords.forEach((record) => {
          srsStageMap[record.id] = record.stage || 0;
        });

        const vocabData = await fetchVocabulariesByIdsOrConcepts(conceptIds);

        if (vocabData && vocabData.length > 0) {
          return vocabData.map((row: any) => {
            const wNative = row[`word_${nativeCode}`] || row.word_ko || row.word_en;
            const wTarget = row[`word_${targetCode}`] || row.word_en || row.word_ko;
            const exNative = row[`example_${nativeCode}`] || row.example_ko || row.example_en;
            const exTarget = row[`example_${targetCode}`] || row.example_en || row.example_ko;
            const phonetic = row[`phonetic_${targetCode}`] || null;

            return {
              id: row.id,
              conceptId: row.id,
              wordNative: wNative,
              wordTarget: wTarget,
              phonetic,
              exampleSentence: exTarget,
              exampleNative: exNative,
              exampleTarget: exTarget,
              nativeLang,
              targetLang,
              category: row.category || 'daily',
              isReview: true,
              srsStage: srsStageMap[row.id] ?? 0,
              createdAt: row.created_at,
              ttsAudioUrl: row.tts_audio_url || null,
              ttsProvider: row.tts_provider || null,
              ttsVoiceName: row.tts_voice_name || null,
            };
          });
        }
      }
    } catch (err) {
      isStudiedTableAvailable = false;
    }

    return [];
  }

  async getTodayStudiedWords(userId: string, nativeLang: string = 'en', targetLang: string = 'ko'): Promise<WordEntity[]> {
    if (!userId || userId === 'guest_user' || !isStudiedTableAvailable) return [];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const nativeCode = getStandardLangCode(nativeLang);
    const targetCode = getStandardLangCode(targetLang);

    try {
      const { data: studiedData, error: studiedErr } = await supabase
        .from('user_studied_words')
        .select('concept_id, srs_stage')
        .eq('user_id', userId)
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false });

      if (studiedErr) {
        isStudiedTableAvailable = false;
        return [];
      }

      if (!studiedData || studiedData.length === 0) return [];

      const conceptIds = studiedData.map((d: any) => d.concept_id).filter(Boolean);
      const srsStageMap: Record<string, number> = {};
      studiedData.forEach((d: any) => {
        if (d.concept_id) srsStageMap[d.concept_id] = d.srs_stage || 0;
      });

      const vocabData = await fetchVocabulariesByIdsOrConcepts(conceptIds);
      if (!vocabData || vocabData.length === 0) return [];

      return vocabData.map((row: any) => ({
        id: row.id,
        conceptId: row.id,
        wordNative: row[`word_${nativeCode}`] || row.word_ko || row.word_en || 'Word',
        wordTarget: row[`word_${targetCode}`] || row.word_en || row.word_ko || 'Word',
        imageWord: row.word_en || row.concept_code,
        lessonId: row.lesson_id || null,
        phonetic: row[`phonetic_${targetCode}`] || row[`phonetic_${nativeCode}`] || null,
        exampleSentence: row[`example_${targetCode}`] || row.example_en || row.example_ko || null,
        exampleNative: row[`example_${nativeCode}`] || row.example_ko || row.example_en || null,
        exampleTarget: row[`example_${targetCode}`] || row.example_en || row.example_ko || null,
        category: row.category || 'daily',
        isReview: true,
        srsStage: srsStageMap[row.id] ?? 0,
        createdAt: row.created_at || new Date().toISOString(),
        nativeLang,
        targetLang,
        ttsAudioUrl: row.tts_audio_url || null,
        ttsProvider: row.tts_provider || null,
        ttsVoiceName: row.tts_voice_name || null,
      }));
    } catch (err) {
      isStudiedTableAvailable = false;
      return [];
    }
  }

  async saveStudyCompletion(userId: string, xp: number, conceptIds: string[] = []): Promise<StudyCompletionResult> {
    if (!userId || userId.startsWith('guest_')) {
      return { xpGained: 100 };
    }

    const localDate = getLocalDateString();

    try {
      await supabase
        .from('study_logs')
        .insert([{
          user_id: userId,
          local_date: localDate,
          xp_gained: xp,
          concept_ids: conceptIds,
          completed_at: new Date().toISOString(),
        }]);
    } catch (netErr) {
      await OfflineSyncManager.enqueueSession({
        userId,
        localDate,
        conceptIds,
        xpGained: xp,
      });
    }

    return { xpGained: 100 };
  }

  async checkTodayStudyLog(userId: string): Promise<{ isCompleted: boolean; xpEarned: number }> {
    if (!userId || userId.startsWith('guest_')) {
      return { isCompleted: false, xpEarned: 0 };
    }
    const todayStr = getLocalDateString();
    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('xp_gained')
        .eq('user_id', userId)
        .eq('local_date', todayStr)
        .maybeSingle();

      if (error || !data) {
        return { isCompleted: false, xpEarned: 0 };
      }
      return { isCompleted: true, xpEarned: data.xp_gained || 20 };
    } catch (err) {
      return { isCompleted: false, xpEarned: 0 };
    }
  }

  async getFavoriteWords(userId: string, nativeLang: string = 'en', targetLang: string = 'ko'): Promise<WordEntity[]> {
    if (!userId || userId === 'guest_user') return [];
    try {
      const { data: favs, error: fErr } = await supabase
        .from('favorite_words')
        .select('word_id')
        .eq('user_id', userId);

      if (fErr || !favs || favs.length === 0) return [];

      const wordIds = favs.map((f: any) => f.word_id).filter(Boolean);
      if (wordIds.length === 0) return [];

      const nCode = getStandardLangCode(nativeLang);
      const tCode = getStandardLangCode(targetLang);

      // Query from study_vocabularies by id or concept_code
      const vocabData = await fetchVocabulariesByIdsOrConcepts(wordIds);

      const matchedIds = new Set<string>();
      const results: WordEntity[] = [];

      if (vocabData && vocabData.length > 0) {
        for (const v of vocabData) {
          matchedIds.add(v.id);
          results.push({
            id: v.id,
            wordNative: v[`word_${nCode}`] || v.word_en || v.word_ko || 'Word',
            wordTarget: v[`word_${tCode}`] || v.word_ko || v.word_en || 'Word',
            phonetic: v[`phonetic_${tCode}`] || v[`phonetic_${nCode}`] || null,
            exampleSentence: v[`example_${tCode}`] || v.example_en || v.example_ko || null,
            exampleNative: v[`example_${nCode}`] || v.example_ko || v.example_en || null,
            exampleTarget: v[`example_${tCode}`] || v.example_en || v.example_ko || null,
            category: v.category || 'daily',
            createdAt: v.created_at || new Date().toISOString(),
            nativeLang,
            targetLang,
            ttsAudioUrl: v.tts_audio_url || null,
          });
        }
      }

      // Resolve unmatched wordIds from fallback datasets
      const now = new Date().toISOString();
      for (const wid of wordIds) {
        if (matchedIds.has(wid)) continue;
        const shortId = FALLBACK_UUID_TO_SHORT_ID[wid];
        if (!shortId) continue;
        const fallbackWord = buildFallbackWord(shortId, targetLang, nativeLang, now);
        if (fallbackWord) {
          results.push(fallbackWord);
        }
      }

      return results;
    } catch (err) {
      return [];
    }
  }

  async getStudiedWords(userId: string, nativeLang: string = 'en', targetLang: string = 'ko', offset: number = 0, limit: number = 50): Promise<WordEntity[]> {
    const localWords = await getStudiedWordsFromLocal(userId);

    if (!userId || userId === 'guest_user' || !isStudiedTableAvailable) {
      if (localWords.length > 0) return attachImageWords(localWords);
      return [];
    }

    try {
      const { data: studiedData, error: studiedErr } = await supabase
        .from('user_studied_words')
        .select('concept_id, srs_stage, last_reviewed_at, created_at')
        .eq('user_id', userId)
        .order('last_reviewed_at', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1);

      if (studiedErr || !studiedData || studiedData.length === 0) {
        if (localWords.length > 0) return attachImageWords(localWords);
        return [];
      }

      const conceptIds = studiedData.map((d: any) => d.concept_id).filter(Boolean);
      const srsStageMap: Record<string, number> = {};
      studiedData.forEach((d: any) => {
        if (d.concept_id) srsStageMap[d.concept_id] = d.srs_stage || 0;
      });

      const nativeCode = getStandardLangCode(nativeLang);
      const targetCode = getStandardLangCode(targetLang);

      const vocabData = await fetchVocabulariesByIdsOrConcepts(conceptIds);

      if (!vocabData || vocabData.length === 0) {
        return [];
      }

      return vocabData.map((row: any) => ({
        id: row.id,
        conceptId: row.id,
        wordNative: row[`word_${nativeCode}`] || row.word_ko || row.word_en || 'Word',
        wordTarget: row[`word_${targetCode}`] || row.word_en || row.word_ko || 'Word',
        imageWord: row.word_en || row.concept_code,
        lessonId: row.lesson_id || null,
        phonetic: row[`phonetic_${targetCode}`] || row[`phonetic_${nativeCode}`] || null,
        exampleSentence: row[`example_${targetCode}`] || row.example_en || row.example_ko || null,
        exampleNative: row[`example_${nativeCode}`] || row.example_ko || row.example_en || null,
        exampleTarget: row[`example_${targetCode}`] || row.example_en || row.example_ko || null,
        category: row.category || 'daily',
        isReview: true,
        srsStage: srsStageMap[row.id] ?? 0,
        createdAt: row.created_at || new Date().toISOString(),
        nativeLang,
        targetLang,
        ttsAudioUrl: row.tts_audio_url || null,
        ttsProvider: row.tts_provider || null,
        ttsVoiceName: row.tts_voice_name || null,
      }));
    } catch (err) {
      if (localWords.length > 0) return attachImageWords(localWords);
      return [];
    }
  }


  async getStudiedWordsCount(userId: string): Promise<number> {
    const localWords = await getStudiedWordsFromLocal(userId);
    if (!userId || userId === 'guest_user' || !isStudiedTableAvailable) return localWords.length;

    try {
      const { count, error } = await supabase
        .from('user_studied_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error || count === null) return localWords.length;
      return count;
    } catch {
      return localWords.length;
    }
  }

  async getLessonProgressMap(userId: string, lessonIds: string[]): Promise<Record<string, number>> {
    const progressMap: Record<string, number> = {};
    if (!userId || userId === 'guest_user' || lessonIds.length === 0 || !isStudiedTableAvailable) return progressMap;

    try {
      const { data: vocabularyRows, error: vocabularyError } = await supabase
        .from('study_vocabularies')
        .select('id, lesson_id')
        .in('lesson_id', lessonIds);
      if (vocabularyError || !vocabularyRows) return progressMap;

      const vocabularyIds = vocabularyRows.map((row: any) => row.id).filter(Boolean);
      if (vocabularyIds.length === 0) return progressMap;

      const { data: studiedRows, error: studiedError } = await supabase
        .from('user_studied_words')
        .select('concept_id')
        .eq('user_id', userId)
        .in('concept_id', vocabularyIds);
      if (studiedError) return progressMap;

      const studiedIds = new Set((studiedRows || []).map((row: any) => row.concept_id));
      const totals: Record<string, number> = {};
      const completed: Record<string, number> = {};

      vocabularyRows.forEach((row: any) => {
        if (!row.lesson_id) return;
        totals[row.lesson_id] = (totals[row.lesson_id] || 0) + 1;
        if (studiedIds.has(row.id)) completed[row.lesson_id] = (completed[row.lesson_id] || 0) + 1;
      });

      Object.keys(totals).forEach((lessonId) => {
        progressMap[lessonId] = Math.round(((completed[lessonId] || 0) / totals[lessonId]) * 100);
      });
    } catch {
      return {};
    }

    return progressMap;
  }

  async getAllVocabulary(nativeLang: string = 'en', targetLang: string = 'ko', offset: number = 0, limit: number = 100): Promise<WordEntity[]> {
    const nativeCode = getStandardLangCode(nativeLang);
    const targetCode = getStandardLangCode(targetLang);

    try {
      const { data, error } = await supabase
        .from('study_vocabularies')
        .select('*')
        .range(offset, offset + limit - 1);

      if (error || !data || data.length === 0) {
        return this.getTodayWords(nativeLang, targetLang, 'all').then((words) => words.slice(0, limit));
      }

      return data.map((row: any) => {
        const wNative = row[`word_${nativeCode}`] || row.word_ko || row.word_en || 'Word';
        const wTarget = row[`word_${targetCode}`] || row.word_en || row.word_ko || 'Word';
        const exNative = row[`example_${nativeCode}`] || row.example_ko || row.example_en || null;
        const exTarget = row[`example_${targetCode}`] || row.example_en || row.example_ko || null;
        const phonetic = row[`phonetic_${targetCode}`] || row[`phonetic_${nativeCode}`] || null;

        return {
          id: row.id,
          conceptId: row.id,
          wordNative: wNative,
          wordTarget: wTarget,
          imageWord: row.word_en || row.concept_code,
          phonetic,
          exampleSentence: exTarget,
          exampleNative: exNative,
          exampleTarget: exTarget,
          nativeLang,
          targetLang,
          category: row.category || 'daily',
          difficultyLevel: row.difficulty_level || 'A1',
          isReview: false,
          srsStage: 0,
          createdAt: row.created_at || new Date().toISOString(),
          ttsAudioUrl: row.tts_audio_url || null,
          ttsProvider: row.tts_provider || null,
          ttsVoiceName: row.tts_voice_name || null,
        };
      });
    } catch (err) {
      return this.getTodayWords(nativeLang, targetLang, 'all').then((words) => words.slice(0, limit));
    }
  }

  async markWordsAsStudied(userId: string, conceptIds: string[]): Promise<void> {
    if (!userId || userId === 'guest_user' || !conceptIds || conceptIds.length === 0 || !isStudiedTableAvailable) return;
    try {
      const records = conceptIds.map((cid) => ({
        user_id: userId,
        concept_id: cid,
      }));
      const { error } = await supabase.from('user_studied_words').upsert(records, {
        onConflict: 'user_id,concept_id',
        ignoreDuplicates: true,
      });
      if (error) {
        isStudiedTableAvailable = false;
      }
    } catch (err) {
      isStudiedTableAvailable = false;
    }
  }

  async toggleFavoriteWord(userId: string, wordId: string): Promise<boolean> {
    if (!userId || userId === 'guest_user') return true;

    // Check if wordId is a valid UUID, otherwise map to deterministic UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wordId);
    const targetUuid = isUuid
      ? wordId
      : (FALLBACK_WORD_UUIDS[wordId] || deterministicUUID(wordId));

    try {
      const { data, error: selectErr } = await supabase
        .from('favorite_words')
        .select('word_id')
        .eq('user_id', userId)
        .eq('word_id', targetUuid)
        .maybeSingle();

      if (selectErr) {
        // Fallback or handle missing table if select fails
        return true;
      }

      if (data) {
        const { error: delErr } = await supabase
          .from('favorite_words')
          .delete()
          .eq('user_id', userId)
          .eq('word_id', targetUuid);
        if (delErr) console.warn('[studyRepository] Delete favorite error:', delErr);
        return false;
      } else {
        const { error: insErr } = await supabase
          .from('favorite_words')
          .insert([{ user_id: userId, word_id: targetUuid }]);
        if (insErr) console.warn('[studyRepository] Insert favorite error:', insErr);
        return true;
      }
    } catch (err) {
      console.warn('[studyRepository] toggleFavoriteWord exception:', err);
      return true;
    }
  }

  async updateWordSrs(userId: string, conceptId: string, rating: SrsRating): Promise<void> {
    if (!userId || userId === 'guest_user' || !conceptId || !isStudiedTableAvailable) return;

    try {
      const { data: existing, error: fetchErr } = await supabase
        .from('user_studied_words')
        .select('srs_stage, review_count, wrong_count')
        .eq('user_id', userId)
        .eq('concept_id', conceptId)
        .maybeSingle();

      if (fetchErr) {
        isStudiedTableAvailable = false;
        return;
      }

      const currentStage = existing?.srs_stage || 0;
      const currentReviewCount = existing?.review_count || 0;
      const currentWrongCount = existing?.wrong_count || 0;

      const computeInterval = (stage: number): number => {
        if (stage <= 0) return 1;
        if (stage === 1) return 3;
        if (stage === 2) return 7;
        return 30;
      };

      let newStage: number;
      let daysToAdd: number;

      if (rating === 'easy') {
        newStage = Math.min(currentStage + 1, 4);
        daysToAdd = computeInterval(newStage);
      } else if (rating === 'hard') {
        newStage = currentStage;
        daysToAdd = computeInterval(currentStage);
      } else {
        newStage = 0;
        daysToAdd = 1;
      }

      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const nextReviewDate = new Date(todayMidnight);
      nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

      const isCorrect = rating === 'easy';
      const payload = {
        user_id: userId,
        concept_id: conceptId,
        srs_stage: newStage,
        next_review_at: nextReviewDate.toISOString(),
        last_reviewed_at: new Date().toISOString(),
        review_count: currentReviewCount + 1,
        wrong_count: isCorrect ? currentWrongCount : currentWrongCount + 1,
      };

      const { error: upsertErr } = await supabase.from('user_studied_words').upsert(payload, { onConflict: 'user_id,concept_id' });
      if (upsertErr) {
        isStudiedTableAvailable = false;
      }
    } catch (err) {
      isStudiedTableAvailable = false;
    }
  }
}

export const studyRepository = new SupabaseStudyRepository();
