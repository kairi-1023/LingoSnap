import { CategoryId } from '../../shared/constants/categories';

export interface WordEntity {
  id: string;
  conceptId?: string;
  wordNative: string;
  wordTarget: string;
  phonetic?: string | null;
  exampleSentence?: string | null;
  exampleNative?: string | null;
  exampleTarget?: string | null;
  nativeLang?: string;
  targetLang?: string;
  category: CategoryId | string;
  difficultyLevel?: string;
  isReview?: boolean;
  srsStage?: number;
  createdAt: string;
  ttsAudioUrl?: string | null;
  ttsProvider?: string | null;
  ttsVoiceName?: string | null;
  ttsGeneratedAt?: string | null;
}

