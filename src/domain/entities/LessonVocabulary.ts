export interface LessonVocabulary {
  id: string;
  vocabularyId?: string;
  conceptCode?: string;
  category?: string;
  difficultyLevel?: string;
  word: string;
  meaning: string;
  image_url: string | null;
  example_sentence: string;
  example_native?: string;
  phonetic?: string;
  tts_audio_url?: string;
}
