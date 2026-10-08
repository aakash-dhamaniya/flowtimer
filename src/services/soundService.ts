import { ChimeType } from "../types/meditation";

class SoundService {
  private ctx: AudioContext | null = null;
  private volume: number = 0.85;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Crisp electronic double beep (ideal for intervals, workouts, Pomodoro)
   */
  public playBeep() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      [0, 0.12].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + offset);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(this.volume * 0.7, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch (e) {
      console.warn("Beep audio failed:", e);
    }
  }

  /**
   * Clear modern bell chime
   */
  public playBell() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(ctx.destination);

      const harmonics = [
        { freq: 587.33, gain: 0.8, decay: 3.5 }, // D5
        { freq: 1174.66, gain: 0.4, decay: 2.5 },
        { freq: 1762.0, gain: 0.2, decay: 1.8 }
      ];

      harmonics.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(gain, now + 0.02);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn("Bell audio failed:", e);
    }
  }

  /**
   * Sparkling high chime
   */
  public playChime() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.65, now);
      masterGain.connect(ctx.destination);

      const notes = [
        { freq: 1046.5, delay: 0.0 }, // C6
        { freq: 1318.5, delay: 0.08 }, // E6
        { freq: 1567.98, delay: 0.16 } // G6
      ];

      notes.forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.5, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.2);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now + delay);
        osc.stop(now + delay + 2.3);
      });
    } catch (e) {
      console.warn("Chime audio failed:", e);
    }
  }

  /**
   * Resonant gong / low bowl
   */
  public playGong() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.75, now);
      masterGain.connect(ctx.destination);

      const harmonics = [
        { freq: 164.81, gain: 0.9, decay: 4.5 },
        { freq: 329.63, gain: 0.5, decay: 3.5 },
        { freq: 659.25, gain: 0.2, decay: 2.2 }
      ];

      harmonics.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(gain, now + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn("Gong audio failed:", e);
    }
  }

  /**
   * Resonant Om vibration (Earth frequency ~136.1 Hz with warm harmonics)
   */
  public playOm() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.85, now);
      masterGain.connect(ctx.destination);

      // 136.1 Hz is the sacred Earth / Om frequency
      const harmonics = [
        { freq: 136.1, gain: 0.8, decay: 5.5 }, // Fundamental C#3
        { freq: 272.2, gain: 0.45, decay: 4.5 }, // Octave
        { freq: 408.3, gain: 0.25, decay: 3.8 }, // Fifth
        { freq: 544.4, gain: 0.12, decay: 3.0 }, // Double octave
      ];

      harmonics.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(gain, now + 0.18);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn("Om audio failed:", e);
    }
  }

  /**
   * Plays selected chime / alert sound
   */
  public playSound(type: ChimeType) {
    switch (type) {
      case 'om':
        this.playOm();
        break;
      case 'beep':
        this.playBeep();
        break;
      case 'bell':
      case 'singing-bowl':
        this.playBell();
        break;
      case 'chime':
      case 'crystal-bell':
        this.playChime();
        break;
      case 'gong':
        this.playGong();
        break;
      case 'none':
        break;
    }
  }

  // Alias for compatibility
  public playChimeByType(type: ChimeType) {
    this.playSound(type);
  }

  public playSingingBowl() {
    this.playBell();
  }

  /**
   * Harmonious completion fanfare
   */
  public playCompletionChime() {
    this.playChime();
    setTimeout(() => this.playBell(), 600);
  }

  public playCompleteTone() {
    this.playCompletionChime();
  }

  /**
   * Short subtle tick for preparation countdown
   */
  public playPrepTick() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }
}

export const soundService = new SoundService();
