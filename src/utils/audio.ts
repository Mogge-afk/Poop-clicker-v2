// Synthesized Web Audio Sound Engine with multiple sound profiles & looping background music
export type SoundTheme = 'fart' | 'retro' | 'pop';

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.5; // 0.0 to 1.0
  public theme: SoundTheme = 'fart';

  // Music sequencer state
  public musicEnabled: boolean = false;
  public musicVolume: number = 0.3; // 0.0 to 1.0
  private musicIntervalId: number | null = null;
  private currentStep: number = 0;
  private nextNoteTime: number = 0;
  private masterMusicGain: GainNode | null = null;

  public getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Generate realistic noise buffer for squelch/fart sounds
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // ==========================================
  // LOOPING BACKGROUND THEME MUSIC
  // ==========================================
  // Upbeat, goofy, bouncy cartoon clicker soundtrack (124 BPM, 16 steps per cycle)
  private readonly BPM = 122;
  private readonly STEP_TIME = 60 / 122 / 2; // 16th-note steps

  // Melody notes in Hz (C Major pentatonic / playful scale)
  private readonly NOTES: Record<string, number> = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00,
  };

  // 32-step cheerful pattern
  private readonly MELODY_PATTERN: (string | null)[] = [
    'E4', null, 'G4', null, 'C5', null, 'G4', null,
    'A4', 'C5', 'A4', null, 'G4', null, 'E4', null,
    'F4', null, 'A4', null, 'D5', null, 'B4', null,
    'C5', null, 'G4', 'E4', 'D4', null, 'C4', null,
  ];

  // Bouncy walking bassline
  private readonly BASS_PATTERN: (string | null)[] = [
    'C3', null, 'C3', null, 'G3', null, 'C3', null,
    'A3', null, 'A3', null, 'E3', null, 'A3', null,
    'F3', null, 'F3', null, 'C3', null, 'F3', null,
    'G3', null, 'G3', null, 'D3', null, 'G3', null,
  ];

  public startMusic() {
    this.musicEnabled = true;
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.musicIntervalId) return; // Already running

    this.nextNoteTime = ctx.currentTime + 0.05;
    this.currentStep = 0;

    // Run lookahead scheduler
    this.musicIntervalId = window.setInterval(() => {
      this.scheduleMusicSteps();
    }, 40);
  }

  public stopMusic() {
    this.musicEnabled = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.musicEnabled) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.masterMusicGain && this.ctx) {
      this.masterMusicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  private scheduleMusicSteps() {
    const ctx = this.getContext();
    if (!ctx || !this.musicEnabled) return;

    // Lookahead: schedule notes up to 150ms in the future
    while (this.nextNoteTime < ctx.currentTime + 0.15) {
      this.playStepAtTime(this.currentStep, this.nextNoteTime);
      this.nextNoteTime += this.STEP_TIME;
      this.currentStep = (this.currentStep + 1) % 32;
    }
  }

  private playStepAtTime(step: number, time: number) {
    const ctx = this.getContext();
    if (!ctx || !this.musicEnabled || this.musicVolume <= 0.001) return;

    // Master music gain node
    if (!this.masterMusicGain) {
      this.masterMusicGain = ctx.createGain();
      this.masterMusicGain.connect(ctx.destination);
    }
    this.masterMusicGain.gain.setValueAtTime(this.musicVolume * 0.35, time);

    // 1. Play Lead Melody
    const leadNote = this.MELODY_PATTERN[step];
    if (leadNote && this.NOTES[leadNote]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Cheerful marimba-style tone (triangle with soft low-pass)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.NOTES[leadNote], time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.frequency.exponentialRampToValueAtTime(300, time + 0.16);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + 0.17);
    }

    // 2. Play Bouncy Bass
    const bassNote = this.BASS_PATTERN[step];
    if (bassNote && this.NOTES[bassNote]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.NOTES[bassNote], time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, time);

      gain.gain.setValueAtTime(0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + 0.15);
    }

    // 3. Play Soft Percussion (Woodblock / Hat tick)
    if (step % 2 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const isDownbeat = step % 8 === 0;
      osc.frequency.setValueAtTime(isDownbeat ? 600 : 900, time);
      osc.frequency.exponentialRampToValueAtTime(150, time + 0.03);

      gain.gain.setValueAtTime(isDownbeat ? 0.08 : 0.035, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

      osc.connect(gain);
      gain.connect(this.masterMusicGain);

      osc.start(time);
      osc.stop(time + 0.035);
    }
  }

  // ==========================================
  // SOUND EFFECTS
  // ==========================================

  // 1. CLICK / SPLAT SOUND
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(ctx.destination);

      if (this.theme === 'fart') {
        // Juicy squelch/fart pop sound
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Modulator for jittery vibration (fart buzz)
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();

        const basePitch = 85 + Math.random() * 45;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(basePitch, now);
        osc.frequency.exponentialRampToValueAtTime(basePitch * 0.45, now + 0.12);

        mod.type = 'sine';
        mod.frequency.setValueAtTime(35, now);
        modGain.gain.setValueAtTime(30, now);
        mod.connect(osc.frequency);

        // Lowpass filter for muffled squelch
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.12);

        oscGain.gain.setValueAtTime(0.35, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);

        mod.start(now);
        osc.start(now);
        mod.stop(now + 0.13);
        osc.stop(now + 0.13);

      } else if (this.theme === 'pop') {
        // Bubble pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350 + Math.random() * 100, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.07);

      } else {
        // Arcade 8-bit blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220 + Math.random() * 60, now);
        osc.frequency.setValueAtTime(330, now + 0.03);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio autoplay policy catch
    }
  }

  // 2. FLUSH / PRESTIGE SOUND
  playFlush() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.8, now);
      masterGain.connect(ctx.destination);

      // Noise generator for rushing water flush
      const noise = this.createNoiseBuffer(1.4);
      if (noise) {
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = noise;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
        filter.frequency.exponentialRampToValueAtTime(200, now + 1.4);
        filter.Q.setValueAtTime(1.5, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now);
        noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.2);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noiseNode.start(now);
        noiseNode.stop(now + 1.4);
      }
    } catch {
      // ignore
    }
  }

  // 3. BUY UPGRADE SOUND
  playBuy() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Cheerful cash register chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.06); // G5

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio autoplay policy catch
    }
  }

  // 4. MILESTONE / FANFARE SOUND
  playMilestone() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(ctx.destination);

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.28);
      });
    } catch {
      // ignore
    }
  }

  // 5. GOLDEN POOP / SPARKLE SOUND
  playGolden() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.75, now);
      masterGain.connect(ctx.destination);

      [880, 1174.66, 1318.51, 1760, 2093].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.25, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // 6. PRESTIGE TRUMPET / RESET
  playPrestige() {
    if (!this.enabled) return;
    this.playFlush();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.7, now);
      masterGain.connect(ctx.destination);

      [330, 440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + 0.2 + i * 0.09);
        gain.gain.setValueAtTime(0.18, now + 0.2 + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + i * 0.09 + 0.4);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + 0.2 + i * 0.09);
        osc.stop(now + 0.2 + i * 0.09 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // 7. CHEAT ALARM
  playCheatAlarm() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.75, now);
      masterGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.15);
      osc.frequency.linearRampToValueAtTime(320, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
