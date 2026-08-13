export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  shortCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', shortCode: 'KO' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', shortCode: 'EN' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', shortCode: 'TL' },
];

/**
 * Get language info by code or name
 */
export const getLanguageInfo = (langInput?: string): LanguageInfo => {
  if (!langInput) return SUPPORTED_LANGUAGES[0]; // Default: Korean

  const lower = langInput.toLowerCase().trim();

  // Match code or shortCode or name
  const matched = SUPPORTED_LANGUAGES.find(
    (l) =>
      l.code === lower ||
      l.shortCode.toLowerCase() === lower ||
      l.name.toLowerCase() === lower ||
      l.nativeName.toLowerCase() === lower
  );

  if (matched) return matched;

  // Fallback mappings
  if (lower.includes('korea')) return SUPPORTED_LANGUAGES[0];
  if (lower.includes('eng')) return SUPPORTED_LANGUAGES[1];
  if (lower.includes('taga') || lower.includes('fili') || lower.includes('phili'))
    return SUPPORTED_LANGUAGES[2];

  return {
    code: lower.substring(0, 2),
    name: langInput,
    nativeName: langInput,
    flag: '🌐',
    shortCode: lower.substring(0, 2).toUpperCase(),
  };
};

/**
 * Formats pair string with national flags (e.g. "🇰🇷 KO ➔ 🇵🇭 TL")
 */
export const formatLanguagePairWithFlags = (
  nativeLang?: string,
  targetLang?: string,
  compact = true
): { native: LanguageInfo; target: LanguageInfo; formatted: string } => {
  const native = getLanguageInfo(nativeLang || 'ko');
  const target = getLanguageInfo(targetLang || 'en');

  if (compact) {
    return {
      native,
      target,
      formatted: `${native.flag} ${native.shortCode} ➔ ${target.flag} ${target.shortCode}`,
    };
  }

  return {
    native,
    target,
    formatted: `${native.flag} ${native.name} ➔ ${target.flag} ${target.name}`,
  };
};

/**
 * Safely extracts localized string field dynamically by prefix and language code
 */
export function getLangField<T extends Record<string, any>>(obj: T, prefix: string, langCode: string): string {
  if (!obj) return '';
  const cap = langCode.charAt(0).toUpperCase() + langCode.slice(1).toLowerCase();
  const camelKey = `${prefix}${cap}`;
  const snakeKey = `${prefix}_${langCode.toLowerCase()}`;

  if (camelKey in obj && obj[camelKey]) return String(obj[camelKey]);
  if (snakeKey in obj && obj[snakeKey]) return String(obj[snakeKey]);

  const fallbackCamel = `${prefix}En`;
  const fallbackSnake = `${prefix}_en`;
  if (fallbackCamel in obj && obj[fallbackCamel]) return String(obj[fallbackCamel]);
  if (fallbackSnake in obj && obj[fallbackSnake]) return String(obj[fallbackSnake]);

  return '';
}

/**
 * Standardize and normalize language codes (e.g., 'en-US' -> 'en', 'Tagalog' -> 'tl')
 */
export function normalizeLanguageCode(lang?: string | null): string {
  const norm = (lang || '').toLowerCase().trim();
  if (!norm) return 'en';
  if (norm.startsWith('tl') || norm.includes('tagalog') || norm.includes('fil') || norm.includes('ph')) return 'tl';
  if (norm.startsWith('ko') || norm.includes('korean') || norm.includes('kr')) return 'ko';
  if (norm.startsWith('en') || norm.includes('english') || norm.includes('us')) return 'en';
  return norm.split(/[-_]/)[0];
}

