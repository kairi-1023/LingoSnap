export const SUPPORTED_LANGUAGES = [
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭' },
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]['code'];

export const isSupportedLanguage = (code: string): code is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
};

export const getLanguageItem = (codeOrName?: string) => {
  if (!codeOrName) return SUPPORTED_LANGUAGES[1]; // Default English
  const norm = codeOrName.toLowerCase().trim();
  const list = SUPPORTED_LANGUAGES as readonly { code: string; name: string; nativeName: string; flag: string }[];
  const found = list.find(
    (l) =>
      l.code === norm ||
      l.name.toLowerCase() === norm ||
      l.nativeName.toLowerCase() === norm
  );
  return found || SUPPORTED_LANGUAGES[1];
};

export const getLanguageDisplay = (codeOrName?: string): string => {
  const item = getLanguageItem(codeOrName);
  return `${item.flag} ${item.nativeName || item.name}`;
};

export const getLanguageFlag = (codeOrName?: string): string => {
  const item = getLanguageItem(codeOrName);
  return item.flag;
};

export const getLanguageName = (codeOrName?: string): string => {
  const item = getLanguageItem(codeOrName);
  return item.nativeName || item.name;
};
