export const SUPABASE_STORAGE_BASE_URL = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images';

const WORD_NORMALIZE_MAP: Record<string, string> = {
  bye: 'bye',
  goodbye: 'bye',
  brother: 'brother',
  daughter: 'daughter',
  door: 'door',
  eat: 'eat',
  family: 'family',
  father: 'father',
  dad: 'father',
  friend: 'friend',
  grandma: 'grandma',
  grandmother: 'grandma',
  grandpa: 'grandpa',
  grandfather: 'grandpa',
  happy: 'happy',
  hello: 'hello',
  hi: 'hello',
  house: 'house',
  home: 'house',
  i: 'i',
  me: 'i',
  like: 'like',
  love: 'love',
  mother: 'mother',
  mom: 'mother',
  name: 'name',
  room: 'room',
  sister: 'sister',
  smile: 'smile',
  son: 'son',
  window: 'windows',
  windows: 'windows',
  you: 'you',
  baby: 'baby',
};

function normalizeWord(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (WORD_NORMALIZE_MAP[lower]) return WORD_NORMALIZE_MAP[lower];

  const tokens = lower.split(/[^a-z0-9]+/).filter(Boolean);
  for (const [key, canonical] of Object.entries(WORD_NORMALIZE_MAP).sort(
    ([left], [right]) => right.length - left.length
  )) {
    // Only aliases longer than one character may match a concept token.
    // This prevents the standalone pronoun "i" from matching "drink".
    if (key.length > 1 && tokens.includes(key)) return canonical;
  }

  return lower;
}

export function getVocabularyImageUrl(wordOrConcept: string | undefined | null): string | null {
  if (!wordOrConcept) return null;

  const normalized = normalizeWord(String(wordOrConcept));
  return `${SUPABASE_STORAGE_BASE_URL}/${normalized}.webp`;
}
