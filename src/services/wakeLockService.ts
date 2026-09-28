class WakeLockService {
  private wakeLock: any = null;
  private isRequested: boolean = false;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isRequested) {
          this.request();
        }
      });
    }
  }

  public async request(): Promise<boolean> {
    this.isRequested = true;
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
        return true;
      } catch (err) {
        console.warn("Screen wake lock request failed:", err);
        return false;
      }
    }
    return false;
  }

  public release() {
    this.isRequested = false;
    if (this.wakeLock) {
      try {
        this.wakeLock.release();
      } catch (err) {
        console.warn("Wake lock release failed:", err);
      }
      this.wakeLock = null;
    }
  }
}

export const wakeLockService = new WakeLockService();
