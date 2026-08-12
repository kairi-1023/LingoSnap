import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { createAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

const BCP47_LANG_MAP: Record<string, string> = {
  ko: 'ko-KR',
  korean: 'ko-KR',
  kr: 'ko-KR',
  'ko-kr': 'ko-KR',
  en: 'en-US',
  english: 'en-US',
  us: 'en-US',
  'en-us': 'en-US',
  'en-gb': 'en-GB',
  tl: 'fil-PH',
  fil: 'fil-PH',
  tagalog: 'fil-PH',
  filipino: 'fil-PH',
  ph: 'fil-PH',
  'fil-ph': 'fil-PH',
  'tl-ph': 'fil-PH',
  es: 'es-ES',
  spanish: 'es-ES',
  'es-es': 'es-ES',
  ja: 'ja-JP',
  japanese: 'ja-JP',
  jp: 'ja-JP',
  'ja-jp': 'ja-JP',
  zh: 'cmn-CN',
  chinese: 'cmn-CN',
  'zh-cn': 'cmn-CN',
  cn: 'cmn-CN',
  fr: 'fr-FR',
  french: 'fr-FR',
  'fr-fr': 'fr-FR',
  de: 'de-DE',
  german: 'de-DE',
  'de-de': 'de-DE',
  vi: 'vi-VN',
  vietnamese: 'vi-VN',
  vn: 'vi-VN',
  'vi-vn': 'vi-VN',
  th: 'th-TH',
  thai: 'th-TH',
  'th-th': 'th-TH',
};

export interface SpeakOptions {
  text: string;
  language?: string;
  audioUrl?: string | null;
  rate?: number;
  forceTts?: boolean;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export class TTSService {
  private currentPlayer: AudioPlayer | null = null;
  private loadTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private statusListener: { remove: () => void } | null = null;
  private currentRequestId = 0;

  private normalizeLanguage(langCode?: string | null): string {
    if (!langCode) return 'en-US';
    const clean = langCode.toLowerCase().trim().replace('_', '-');
    if (BCP47_LANG_MAP[clean]) {
      return BCP47_LANG_MAP[clean];
    }
    const primarySubtag = clean.split('-')[0];
    if (BCP47_LANG_MAP[primarySubtag]) {
      return BCP47_LANG_MAP[primarySubtag];
    }
    if (/^[a-z]{2,3}-[a-z]{2,4}$/i.test(clean)) {
      const parts = clean.split('-');
      return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
    }
    return 'en-US';
  }

  speak(text: string, langCode?: string, onEnd?: () => void, onError?: () => void): void;
  speak(options: SpeakOptions): void;
  speak(textOrOptions: string | SpeakOptions, langCode?: string, onEnd?: () => void, onError?: () => void): void {
    let options: SpeakOptions;
    if (typeof textOrOptions === 'string') {
      options = { text: textOrOptions, language: langCode, onEnd, onError };
    } else {
      options = textOrOptions;
    }
    this.speakInternal(options).catch((err) => {
      console.warn('[TTSService] speakInternal error:', err);
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
    });
  }

  private async speakInternal(options: SpeakOptions): Promise<void> {
    this.stop();
    const requestId = ++this.currentRequestId;

    const { text, language, audioUrl, rate, forceTts, onEnd, onError } = options;
    if (!text) {
      onEnd?.();
      return;
    }

    const langTag = this.normalizeLanguage(language);

    if (audioUrl && !forceTts) {
      try {
        console.log(`[TTSService] ▶ Playing MP3 (${rate ? `${rate}x` : '1.0x'}): ${audioUrl.split('/').pop()}`);
        await this.playAudioUrl(audioUrl, rate, onEnd, onError);
        if (requestId !== this.currentRequestId) {
          this.cleanupPlayer();
          return;
        }
        return;
      } catch (err) {
        console.warn('[TTSService] ❌ MP3 playback failed, falling back to native TTS:', err);
      }
    }

    if (requestId !== this.currentRequestId) {
      return;
    }

    const sourceLabel = forceTts ? 'expo-speech (slow mode)' : audioUrl ? 'expo-speech (fallback)' : 'expo-speech (no MP3)';
    console.log(`[TTSService] ▶ Playing ${sourceLabel}: "${text.slice(0, 30)}..." (${langTag}) [rate=${rate || 1.0}]`);
    this.playExpoSpeech(text, langTag, rate, onEnd, onError);
  }

  private playAudioUrl(url: string, rate?: number, onEnd?: () => void, onError?: (error: Error) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        this.cleanupPlayer();
        onEnd?.();
        resolve();
      };
      const fail = (error: Error) => {
        if (settled) return;
        settled = true;
        this.cleanupPlayer();
        reject(error);
      };

      try {
        const player = createAudioPlayer({ uri: url });
        this.currentPlayer = player;

        const applyRate = () => {
          if (rate && typeof rate === 'number') {
            try {
              if (typeof (player as any).setPlaybackRate === 'function') {
                (player as any).setPlaybackRate(rate);
              }
              (player as any).playbackRate = rate;
            } catch (_rErr) {
              // Ignore playbackRate unsupported on some targets
            }
          }
        };

        applyRate();

        this.statusListener = player.addListener('playbackStatusUpdate', (status: any) => {
          if (status.error || status.status === 'error') {
            fail(new Error(typeof status.error === 'string' ? status.error : 'Audio playback status error'));
            return;
          }
          if (status.isLoaded) {
            applyRate();
          }
          if (status.didJustFinish) {
            finish();
          }
        });

        this.loadTimeoutId = setTimeout(() => {
          if (!player.isLoaded) {
            fail(new Error('Audio load timeout'));
          }
        }, 8000);

        const playPromise: any = player.play();
        applyRate();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch((playErr: any) => {
            const errStr = String(playErr || '');
            if (playErr?.name === 'AbortError' || errStr.includes('interrupted')) {
              fail(new Error('Audio playback interrupted'));
              return;
            }
            if (playErr?.name === 'NotAllowedError' || errStr.includes("user didn't interact") || errStr.includes('NotAllowedError')) {
              // Let speakInternal invoke the native speech fallback.
              fail(playErr instanceof Error ? playErr : new Error('Audio playback requires user interaction'));
              return;
            }
            console.warn('[TTSService] player.play() error:', playErr);
            fail(playErr instanceof Error ? playErr : new Error(String(playErr)));
          });
        }
      } catch (err) {
        fail(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  private playExpoSpeech(text: string, langTag: string, rate?: number, onEnd?: () => void, onError?: (error: Error) => void): void {
    // Normalize speech rate across platforms (Android Speech engine rate scaling)
    const effectiveRate = rate ?? 1.0;
    const finalRate = Platform.OS === 'android' && effectiveRate < 1.0
      ? Math.max(0.65, effectiveRate * 0.9)
      : effectiveRate;

    Speech.speak(text, {
      language: langTag,
      rate: finalRate,
      pitch: 1.0,
      onDone: () => {
        onEnd?.();
      },
      onError: (err) => {
        console.warn('[TTSService] expo-speech error:', err);
        if (Platform.OS === 'web') {
          this.playWebSpeech(text, langTag, rate, onEnd, onError);
        } else {
          onError?.(err);
        }
      },
    });
  }

  private playWebSpeech(text: string, langTag: string, rate?: number, onEnd?: () => void, onError?: (error: Error) => void): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langTag;
        utterance.rate = rate ?? 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => onEnd?.();
        utterance.onerror = (e) => {
          console.warn('[TTSService] Web Speech error:', e);
          onError?.(new Error('Web Speech synthesis error'));
        };

        const playSpeech = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const langPrefix = langTag.split('-')[0].toLowerCase();
            const matchedVoice = voices.find(
              (v) => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix) ||
                     v.lang.toLowerCase().includes(langPrefix)
            );
            if (matchedVoice) {
              utterance.voice = matchedVoice;
            }
          }
          window.speechSynthesis.speak(utterance);
        };

        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null;
            playSpeech();
          };
          setTimeout(playSpeech, 100);
        } else {
          playSpeech();
        }
      } catch (err) {
        console.warn('[TTSService] Web Speech exception:', err);
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    } else {
      setTimeout(() => onEnd?.(), 800);
    }
  }

  private cleanupPlayer(): void {
    if (this.loadTimeoutId) {
      clearTimeout(this.loadTimeoutId);
      this.loadTimeoutId = null;
    }
    if (this.statusListener) {
      try { this.statusListener.remove(); } catch {}
      this.statusListener = null;
    }
    if (this.currentPlayer) {
      const pToClean = this.currentPlayer;
      this.currentPlayer = null;
      try {
        const pauseRes: any = pToClean.pause();
        if (pauseRes && typeof pauseRes.catch === 'function') {
          pauseRes.catch(() => {});
        }
      } catch {}
      try { pToClean.remove(); } catch {}
    }
  }

  stop(): void {
    this.currentRequestId += 1;
    Speech.stop().catch(() => {});

    this.cleanupPlayer();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
  }

  dispose(): void {
    this.stop();
    this.currentPlayer = null;
  }
}

export const ttsService = new TTSService();
