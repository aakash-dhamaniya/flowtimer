import { Routine, UserSettings } from "../types/meditation";

const ROUTINES_STORAGE_KEY = "zenflow_routines_v2";
const SETTINGS_STORAGE_KEY = "zenflow_settings_v2";

// No default/preloaded routines as requested
export const DEFAULT_ROUTINES: Routine[] = [];

export const DEFAULT_SETTINGS: UserSettings = {
  ttsEnabled: true,
  speechRate: 0.88,
  speechPitch: 1.0,
  bellVolume: 0.85,
  keepScreenAwake: true,
  prepCountdownSeconds: 5,
  enableHaptic: true
};

class StorageService {
  public getRoutines(): Routine[] {
    try {
      const data = localStorage.getItem(ROUTINES_STORAGE_KEY);
      if (!data) {
        // Check if user had created custom routines in v1, keep only custom ones
        const v1Data = localStorage.getItem("zenflow_routines_v1");
        if (v1Data) {
          try {
            const v1List: Routine[] = JSON.parse(v1Data);
            // Strictly exclude default pre-made programs
            const userOnly = v1List.filter(
              (r) =>
                !r.id.startsWith("default-") &&
                r.title !== "Om Chanting & Breath Focus" &&
                !r.title.includes("Morning Prana") &&
                !r.title.includes("Quick 7-Min")
            );
            this.saveRoutines(userOnly);
            return userOnly;
          } catch {
            // ignore
          }
        }
        this.saveRoutines([]);
        return [];
      }
      const parsed: Routine[] = JSON.parse(data);
      // Ensure no default programs slip through
      return parsed.filter(
        (r) =>
          !r.id.startsWith("default-") &&
          r.title !== "Om Chanting & Breath Focus" &&
          !r.title.includes("Morning Prana") &&
          !r.title.includes("Quick 7-Min")
      );
    } catch (e) {
      console.warn("Failed to load routines from storage:", e);
      return [];
    }
  }

  public saveRoutines(routines: Routine[]): void {
    try {
      localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines));
    } catch (e) {
      console.error("Failed to save routines to storage:", e);
    }
  }

  public getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) {
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }
}

export const storageService = new StorageService();
