const SUPABASE_STORAGE_BASE_URL = 'https://ghdoqflateritxmnlnwa.supabase.co/storage/v1/object/public/vocabulary-images';

// Map of available WebP image names uploaded to Supabase Storage
const AVAILABLE_WEBP_IMAGES: Record<string, string> = {
  baby: `${SUPABASE_STORAGE_BASE_URL}/baby.webp`,
  brother: `${SUPABASE_STORAGE_BASE_URL}/brother.webp`,
  bye: `${SUPABASE_STORAGE_BASE_URL}/bye.webp`,
  goodbye: `${SUPABASE_STORAGE_BASE_URL}/bye.webp`,
  daughter: `${SUPABASE_STORAGE_BASE_URL}/daughter.webp`,
  door: `${SUPABASE_STORAGE_BASE_URL}/door.webp`,
  eat: `${SUPABASE_STORAGE_BASE_URL}/eat.webp`,
  family: `${SUPABASE_STORAGE_BASE_URL}/family.webp`,
  father: `${SUPABASE_STORAGE_BASE_URL}/father.webp`,
  dad: `${SUPABASE_STORAGE_BASE_URL}/father.webp`,
  friend: `${SUPABASE_STORAGE_BASE_URL}/friend.webp`,
  grandma: `${SUPABASE_STORAGE_BASE_URL}/grandma.webp`,
  grandmother: `${SUPABASE_STORAGE_BASE_URL}/grandma.webp`,
  grandpa: `${SUPABASE_STORAGE_BASE_URL}/grandpa.webp`,
  grandfather: `${SUPABASE_STORAGE_BASE_URL}/grandpa.webp`,
  happy: `${SUPABASE_STORAGE_BASE_URL}/happy.webp`,
  hello: `${SUPABASE_STORAGE_BASE_URL}/hello.webp`,
  hi: `${SUPABASE_STORAGE_BASE_URL}/hello.webp`,
  house: `${SUPABASE_STORAGE_BASE_URL}/house.webp`,
  home: `${SUPABASE_STORAGE_BASE_URL}/house.webp`,
  i: `${SUPABASE_STORAGE_BASE_URL}/i.webp`,
  me: `${SUPABASE_STORAGE_BASE_URL}/i.webp`,
  like: `${SUPABASE_STORAGE_BASE_URL}/like.webp`,
  love: `${SUPABASE_STORAGE_BASE_URL}/love.webp`,
  mother: `${SUPABASE_STORAGE_BASE_URL}/mother.webp`,
  mom: `${SUPABASE_STORAGE_BASE_URL}/mother.webp`,
  name: `${SUPABASE_STORAGE_BASE_URL}/name.webp`,
  room: `${SUPABASE_STORAGE_BASE_URL}/room.webp`,
  sister: `${SUPABASE_STORAGE_BASE_URL}/sister.webp`,
  smile: `${SUPABASE_STORAGE_BASE_URL}/smile.webp`,
  son: `${SUPABASE_STORAGE_BASE_URL}/son.webp`,
  window: `${SUPABASE_STORAGE_BASE_URL}/windows.webp`,
  windows: `${SUPABASE_STORAGE_BASE_URL}/windows.webp`,
  you: `${SUPABASE_STORAGE_BASE_URL}/you.webp`,
};

/**
 * Resolves the matching Supabase WebP image URL for a given word or concept code.
 * Falls back to family.webp or Unsplash default if no specific image exists.
 */
export function getVocabularyImageUrl(wordOrConcept: string | undefined | null, defaultFallback?: string): string {
  const fallbackUrl = defaultFallback || `${SUPABASE_STORAGE_BASE_URL}/family.webp`;
  if (!wordOrConcept) return fallbackUrl;

  const normalized = String(wordOrConcept).toLowerCase().trim();

  // 1. Direct match in dictionary
  if (AVAILABLE_WEBP_IMAGES[normalized]) {
    return AVAILABLE_WEBP_IMAGES[normalized];
  }

  // 2. Partial match in word string or concept code (e.g., "tr_window" -> "window")
  for (const [key, url] of Object.entries(AVAILABLE_WEBP_IMAGES)) {
    if (normalized.includes(key)) {
      return url;
    }
  }

  return fallbackUrl;
}
