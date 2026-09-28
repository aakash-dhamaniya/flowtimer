interface AndroidTTSInterface {
  speak: (text: string) => void;
  stop: () => void;
  isAvailable: () => boolean;
  setSpeechRate: (rate: number) => void;
}

declare global {
  interface Window {
    AndroidTTS?: AndroidTTSInterface;
  }
}

class SpeechService {
  private enabled: boolean = true;
  private rate: number = 0.88; // Slightly slower, calm meditative cadence
  private pitch: number = 1.0;
  private selectedVoiceUri: string | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const updateVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  public isNativeAndroid(): boolean {
    return typeof window !== 'undefined' && !!window.AndroidTTS;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(1.5, rate));
    if (typeof window !== 'undefined' && window.AndroidTTS) {
      try {
        window.AndroidTTS.setSpeechRate(this.rate);
      } catch (e) {
        console.warn("Error setting Android TTS rate:", e);
      }
    }
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(1.5, pitch));
  }

  public setVoice(voiceUri: string | null) {
    this.selectedVoiceUri = voiceUri;
  }

  public stop() {
    // 1. Android Native TTS
    if (typeof window !== 'undefined' && window.AndroidTTS) {
      try {
        window.AndroidTTS.stop();
      } catch (e) {
        console.warn("Android TTS stop error:", e);
      }
    }

    // 2. Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Speech cancel error:", e);
      }
    }
  }

  /**
   * Speaks the given text using Android Native TTS if available, or Web Speech API as fallback.
   * Returns a promise that resolves when speech finishes or after a timeout.
   */
  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.enabled) {
        resolve();
        return;
      }

      console.log("[ZenFlow] Speaking text:", text);

      // Strategy 1: Android Native TTS Bridge (100% reliable on mobile APK)
      if (typeof window !== 'undefined' && window.AndroidTTS) {
        try {
          window.AndroidTTS.setSpeechRate(this.rate);
          window.AndroidTTS.speak(text);
          // Allow reasonable duration for speech to complete
          const duration = Math.min(5000, Math.max(1800, text.length * 80));
          setTimeout(resolve, duration);
          return;
        } catch (e) {
          console.warn("AndroidTTS bridge call failed, falling back to Web Speech:", e);
        }
      }

      // Strategy 2: Web Speech API (for desktop, browser, or supported WebViews)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();

          // Workaround for Chrome/WebView synthesis pause bug
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = this.rate;
          utterance.pitch = this.pitch;

          const voices = this.getVoices();
          if (this.selectedVoiceUri) {
            const found = voices.find((v) => v.voiceURI === this.selectedVoiceUri);
            if (found) utterance.voice = found;
          } else if (voices.length > 0) {
            const preferred =
              voices.find(
                (v) =>
                  v.lang.startsWith('en') &&
                  (v.name.includes('Natural') ||
                    v.name.includes('Google') ||
                    v.name.includes('Zira') ||
                    v.name.includes('Samantha'))
              ) ||
              voices.find((v) => v.lang.startsWith('en')) ||
              voices[0];
            if (preferred) utterance.voice = preferred;
          }

          let hasEnded = false;
          const done = () => {
            if (!hasEnded) {
              hasEnded = true;
              resolve();
            }
          };

          utterance.onend = done;
          utterance.onerror = (err) => {
            console.warn("Speech error:", err);
            done();
          };

          const safetyTimeout = Math.max(2500, text.length * 100);
          setTimeout(done, safetyTimeout);

          window.speechSynthesis.speak(utterance);
          return;
        } catch (err) {
          console.warn("Web Speech failed:", err);
        }
      }

      // If neither is available
      resolve();
    });
  }

  /**
   * Spoken announcement at stage start
   */
  public async speakStageStart(title: string, customAnnouncement?: string) {
    if (customAnnouncement && customAnnouncement.trim()) {
      await this.speak(customAnnouncement.trim());
    } else {
      await this.speak(`Starting ${title}`);
    }
  }

  /**
   * Spoken announcement when a stage ends
   */
  public async speakStageOver(title: string) {
    await this.speak(`${title} is over.`);
  }

  /**
   * Spoken announcement transitioning to next stage
   */
  public async speakNextStageTransition(endedTitle: string, nextTitle: string) {
    await this.speak(`${endedTitle} is over. Next: ${nextTitle}.`);
  }

  /**
   * Spoken announcement when the entire session finishes
   */
  public async speakSessionComplete() {
    await this.speak("Routine complete!");
  }
}

export const speechService = new SpeechService();
