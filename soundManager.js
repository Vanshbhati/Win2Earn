// Web Audio API Sound System (No MP3 Files Required)
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.envInterval = null;
    this.rainOsc = null;
    this.rainGain = null;
    this.currentEnv = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  // Pipe Cross / Point Sound
  playScore() {
    this.init();
    if (!this.audioCtx) return;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
    osc1.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08); // E5

    osc2.frequency.setValueAtTime(1046.50, this.audioCtx.currentTime); 
    osc2.frequency.setValueAtTime(1318.51, this.audioCtx.currentTime + 0.08); 

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.audioCtx.currentTime + 0.25);
    osc2.stop(this.audioCtx.currentTime + 0.25);
  }

  // Heavy Crash Sound
  playCrash() {
    this.init();
    if (!this.audioCtx) return;

    this.stopBgMusic();
    this.stopRainSound();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }

  // Continuous Environment Ambient Loops (Morning, Sunset, Night)
  setEnvironment(type) {
    if (this.currentEnv === type) return;
    this.currentEnv = type;
    this.stopBgMusic();
    this.init();
    if (!this.audioCtx) return;

    if (type === 'morning') {
      // Birds Chirping Loop
      this.envInterval = setInterval(() => {
        if (Math.random() > 0.4) {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          const freq = 2000 + Math.random() * 800;
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq + 400, this.audioCtx.currentTime + 0.08);

          gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.08);
        }
      }, 400);

    } else if (type === 'sunset') {
      // Crickets / Breeze Loop
      this.envInterval = setInterval(() => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(4500, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.05);
      }, 150);

    } else if (type === 'night') {
      // Deep Synth Atmosphere
      this.envInterval = setInterval(() => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.8);
      }, 1000);
    }
  }

  // Rain Ambient Audio Effect
  startRainSound() {
    this.init();
    if (!this.audioCtx || this.rainGain) return;

    // White Noise for Rain Effect
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    this.rainGain = this.audioCtx.createGain();
    this.rainGain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);

    noise.connect(this.rainGain);
    this.rainGain.connect(this.audioCtx.destination);
    noise.start();
    this.rainOsc = noise;
  }

  stopRainSound() {
    if (this.rainOsc) {
      this.rainOsc.stop();
      this.rainOsc.disconnect();
      this.rainOsc = null;
      this.rainGain = null;
    }
  }

  stopBgMusic() {
    if (this.envInterval) {
      clearInterval(this.envInterval);
      this.envInterval = null;
    }
  }
}

// Global Sound Controller
window.gameSounds = new SoundManager();

