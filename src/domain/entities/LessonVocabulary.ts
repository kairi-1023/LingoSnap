export interface LessonVocabulary {
  id: string;
  word: string;
  meaning: string;
  image_url: string;
  example_sentence: string;
  example_native?: string;
  phonetic?: string;
  tts_audio_url?: string;
}
