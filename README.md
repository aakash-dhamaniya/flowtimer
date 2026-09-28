# ZenFlow - Mindful Meditation Routine Timer

A tranquil, distraction-free mobile application built with **Tauri 2**, **React**, **TypeScript**, and **Tailwind CSS**.

ZenFlow solves a common challenge during multi-phase meditation: needing to open your eyes, check your phone, and reset a timer between different stages (e.g. transitioning from 5 minutes of Om chanting to 10 minutes of breath focus).

With ZenFlow, you define your routine once, close your eyes, and let calm **spoken voice guidance (TTS)** and **harmonic Tibetan singing bowls** guide you smoothly between stages automatically.

---

## Key Features

1. **Multi-Stage Sequential Routines & Repeat Nodes**:
   - Create custom routines with the `+` button.
   - Add regular sequential stages or **Repeat Nodes** (Loop Blocks).
   - Configure Repeat Nodes with **fixed repeat counts** (e.g. 4 cycles, 8 cycles) or **unlimited until stopped** (∞ infinite loop), ideal for pranayama / breathwork (4-7-8 breathing, box breathing) and interval training.
   - Real-time total duration calculation (showing `∞ Unlimited` when applicable), stage reordering, duplication, and editing.

2. **Eyes-Closed Voice Guidance & Audio**:
   - **Start Announcement**: Speaks stage title (e.g., *"Starting Om Chanting, five minutes"*) accompanied by a resonant singing bowl chime.
   - **Transition Announcement**: When the timer finishes, it announces completion (*"Om Chanting is over"*), announces the next stage (*"Next: Breath Focus"*), and immediately begins counting down without any touch or visual check required.
   - **Session Completion**: Triple harmonic singing bowl chime with completion message (*"Meditation session complete. Namaste."*).
   - **Web Audio API Sound Engine**: 100% offline synthesized Tibetan singing bowl, temple gong, and crystal chimes. Zero external audio file downloads needed.

3. **Distraction-Free Zen Interface**:
   - Large circular timer progress ring with soothing breathing pulse animation.
   - Screen Wake Lock API enabled so your phone screen never sleeps prematurely while meditating.
   - Large, accessible pause/resume and skip controls.
   - Customizable speech cadence, voice selection, singing bowl volume, and preparation countdown buffer.

---

## How to Run

Navigate into the `zenflow` directory:
```bash
cd zenflow
```

### 1. Run in Browser (Fast Testing)
```bash
npm run dev
```

### 2. Run Desktop App (Tauri)
```bash
npm run tauri dev
```

### 3. Run on Android Device or Emulator
Ensure your Android device or emulator is connected, then:
```bash
npm run tauri android dev
```

---

## Project Structure

```
zenflow/
├── src-tauri/                 # Tauri 2 backend & Android native project
│   ├── gen/android/           # Generated Android Studio project
│   ├── Cargo.toml
│   └── tauri.conf.json        # Tauri configuration & window sizing
├── src/                       # React frontend
│   ├── components/
│   │   ├── ActivePlayer.tsx   # Fullscreen player with automated stage progression & TTS
│   │   ├── RoutineCard.tsx    # Card displaying routine summary and quick start
│   │   ├── RoutineModal.tsx   # Modal for '+' button to add/edit routines & stages
│   │   ├── StageItemInput.tsx # Stage row with preset duration chips, sound, and voice
│   │   ├── SettingsModal.tsx  # Settings (voice speed, singing bowl volume, wake lock)
│   │   └── Header.tsx         # Clean top bar with branding and actions
│   ├── services/
│   │   ├── soundService.ts    # Web Audio API singing bowl & gong synthesizer
│   │   ├── speechService.ts   # Web Speech API TTS voice announcer
│   │   ├── wakeLockService.ts # Screen Wake Lock API wrapper
│   │   └── storageService.ts  # Local storage persistence & default routines
│   ├── types/
│   │   └── meditation.ts      # TypeScript interfaces
│   ├── utils/
│   │   └── timeUtils.ts       # Duration calculation and formatting
│   ├── App.tsx                # Main app component
│   └── index.css              # Calming zen theme & breathing animations
```
