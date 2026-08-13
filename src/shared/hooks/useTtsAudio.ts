import { useState, useCallback, useRef, useEffect } from 'react';
import { parseTtsAudioUrl } from '../utils/ttsStorage';
import { ttsService } from '../services/ttsService';

export interface UseTtsAudioOptions {
  text?: string;
  language?: string;
  ttsAudioUrl?: string | null;
  conceptId?: string | null;
  category?: string | null;
  difficultyLevel?: string | null;
}

export function useTtsAudio(options?: UseTtsAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      ttsService.stop();
    };
  }, []);

  const play = useCallback(
    (overrideOptions?: UseTtsAudioOptions) => {
      const opts = { ...options, ...overrideOptions };
      const text = opts.text || '';
      const language = opts.language || 'en';
      if (!text) return;

      const audioUrl = parseTtsAudioUrl(
        opts.ttsAudioUrl,
        language,
        'word',
        opts.conceptId,
        opts.category,
        opts.difficultyLevel
      );

      if (isMountedRef.current) setIsPlaying(true);

      ttsService.speak({
        text,
        language,
        audioUrl,
        rate: 1.0,
        onEnd: () => {
          if (isMountedRef.current) setIsPlaying(false);
        },
        onError: () => {
          if (isMountedRef.current) setIsPlaying(false);
        },
      });
    },
    [options]
  );

  const stop = useCallback(() => {
    ttsService.stop();
    if (isMountedRef.current) setIsPlaying(false);
  }, []);

  return { isPlaying, play, stop };
}
