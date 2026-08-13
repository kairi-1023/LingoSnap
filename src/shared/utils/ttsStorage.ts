import { normalizeLanguageCode } from './languageUtils';
export { normalizeLanguageCode };

const STORAGE_BASE = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/tts-audio';

export function buildTtsAudioUrlJson(conceptCode?: string | null, category?: string | null, difficulty?: string | null): string {
  if (!conceptCode) return '';
  const concept = conceptCode.toLowerCase().trim();
  const cat = (category || 'general').toLowerCase().trim();
  const diff = (difficulty || 'beginner').toLowerCase().trim();

  const langs = ['en', 'ko', 'tl'];
  const suffixes = ['word', 'example', 'word_slow', 'example_slow'];
  const map: Record<string, Record<string, string>> = {};

  langs.forEach((lang) => {
    const langMap: Record<string, string> = {};
    suffixes.forEach((suffix) => {
      langMap[suffix] = `${STORAGE_BASE}/${cat}/${diff}/${concept}_${lang}_${suffix}.mp3`;
    });
    map[lang] = langMap;
  });

  return JSON.stringify(map);
}


export function parseTtsAudioUrl(
  ttsAudioUrl: string | null | undefined,
  language: string,
  type: 'word' | 'example' | 'word_slow' | 'example_slow' = 'word',
  conceptCode?: string | null,
  category?: string | null,
  difficulty?: string | null,
): string | null {
  const stdLang = normalizeLanguageCode(language);

  // Helper to build fallback storage URL
  const buildFallback = (): string | null => {
    if (!conceptCode) return null;
    const concept = conceptCode.toLowerCase().trim();
    const cat = (category || 'greetings').toLowerCase().trim();
    const diff = (difficulty || 'beginner').toLowerCase().trim();
    return `${STORAGE_BASE}/${cat}/${diff}/${concept}_${stdLang}_${type}.mp3`;
  };

  if (!ttsAudioUrl || typeof ttsAudioUrl !== 'string') {
    return buildFallback();
  }

  let trimmed = ttsAudioUrl.trim();
  if (!trimmed) return buildFallback();

  // 1. Use a direct URL only when its filename matches the requested type.
  if ((trimmed.startsWith('http://') || trimmed.startsWith('https://')) && trimmed.endsWith('.mp3')) {
    return trimmed.endsWith(`_${type}.mp3`) ? trimmed : buildFallback();
  }

  // 2. Parse JSON (Support double-stringified JSON)
  let map: any = null;
  try {
    map = JSON.parse(trimmed);
    if (typeof map === 'string') {
      map = JSON.parse(map);
    }
  } catch {
    map = null;
  }

  if (!map || typeof map !== 'object') return buildFallback();

  const rawLang = (language || '').toLowerCase().trim();
  const primaryLang = rawLang.split(/[-_]/)[0];

  // Candidate language keys to search in JSON object
  const langKeys: string[] = [rawLang, primaryLang, stdLang];
  if (stdLang === 'tl' || primaryLang === 'tl' || primaryLang === 'fil' || rawLang.includes('tagalog')) {
    langKeys.push('tl', 'fil', 'tagalog', 'fil-ph', 'tl-ph', 'ph');
  } else if (stdLang === 'ko' || primaryLang === 'ko') {
    langKeys.push('ko', 'korean', 'ko-kr', 'kr');
  } else if (stdLang === 'en' || primaryLang === 'en') {
    langKeys.push('en', 'english', 'en-us', 'us');
  }

  // Deduplicate keys while maintaining priority order
  const uniqueKeys = Array.from(new Set(langKeys));

  let entry: any = null;
  for (const k of uniqueKeys) {
    if (map[k]) {
      entry = map[k];
      break;
    }
    // Case-insensitive key check
    const matchedKey = Object.keys(map).find((mapK) => mapK.toLowerCase() === k.toLowerCase());
    if (matchedKey && map[matchedKey]) {
      entry = map[matchedKey];
      break;
    }
  }

  // Use a language fallback only for the language entry, never for the audio type.
  if (!entry) {
    entry = map['en'] || map['ko'] || map['tl'] || Object.values(map)[0];
  }

  if (!entry) return buildFallback();

  if (typeof entry === 'string') {
    return entry.endsWith(`_${type}.mp3`) ? entry : buildFallback();
  }

  const url = entry[type];
  return typeof url === 'string' && url.endsWith(`_${type}.mp3`) ? url : buildFallback();
}
