import { Platform } from 'react-native';
import { createAudioPlayer } from 'expo-audio';

// Require local WAV sound effects generated dynamically at build/dev start
const correctSource = require('../../../assets/correct.wav');
const incorrectSource = require('../../../assets/incorrect.wav');

// Web & Mobile Synthetic Sound Effect Service
// Extremely fast (0ms latency), gentle, and non-intrusive sound synthesis/play for quiz feedback.
export class SoundService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Gentle, warm, and cute Success Chime (Ding-Dong / C5 -> E5 -> G5)
  playCorrectSound() {
    if (Platform.OS !== 'web') {
      try {
        const player = createAudioPlayer(correctSource);
        const listener = player.addListener('playbackStatusUpdate', (status) => {
          if (status.didJustFinish) {
            listener.remove();
            player.remove();
          }
        });
        player.play();
      } catch (e) {
        console.warn('[SoundService] Correct sound play error (native):', e);
      }
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine'; // Smooth sine wave for pleasant bell sound
      
      // Arpeggio notes (C5 -> E5 -> G5)
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

      // Soft envelope (Gentle attack & quick fade out)
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      console.warn('[SoundService] Correct sound play error:', e);
    }
  }

  // Soft, subtle, non-punishing Encouragement Sound (Gentle low pop)
  playIncorrectSound() {
    if (Platform.OS !== 'web') {
      try {
        const player = createAudioPlayer(incorrectSource);
        const listener = player.addListener('playbackStatusUpdate', (status) => {
          if (status.didJustFinish) {
            listener.remove();
            player.remove();
          }
        });
        player.play();
      } catch (e) {
        console.warn('[SoundService] Incorrect sound play error (native):', e);
      }
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      
      // Gentle pitch bend downwards (260Hz -> 180Hz)
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      // Very soft gain envelope so it never hurts the ears
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('[SoundService] Incorrect sound play error:', e);
    }
  }
  // Alias compatibility methods
  playCorrect() {
    this.playCorrectSound();
  }

  playIncorrect() {
    this.playIncorrectSound();
  }

  playWrong() {
    this.playIncorrectSound();
  }
}

export const soundService = new SoundService();
