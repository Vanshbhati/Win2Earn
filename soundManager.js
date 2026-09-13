// Safe Sound System for Mobile
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.envInterval = null;
    this.rainOsc = null;
    this.rainGain = null;
    this.currentEnv = null;
  }

  init() {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.log("Audio init error:", e);
    }
  }

  playScore() {
    this.init();
    if (!this.audioCtx) return;
    try {
      const osc1 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, this.audioCtx.currentTime);
      osc1.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);
      osc1.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc1.start();
      osc1.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {}
  }

  playCrash() {
    this.init();
    if (!this.audioCtx) return;
    try {
      this.stopBgMusic();
      this.stopRainSound();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, this.audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.4);
    } catch (e) {}
  }

  setEnvironment(type) {
    if (this.currentEnv === type) return;
    this.currentEnv = type;
    this.stopBgMusic();
    this.init();
    if (!this.audioCtx) return;

    try {
      if (type === 'morning') {
        this.envInterval = setInterval(() => {
          if (Math.random() > 0.5 && this.audioCtx) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            const freq = 2000 + Math.random() * 800;
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.08);
          }
        }, 500);
      } else if (type === 'sunset') {
        this.envInterval = setInterval(() => {
          if (this.audioCtx) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(4500, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.05);
          }
        }, 200);
      } else if (type === 'night') {
        this.envInterval = setInterval(() => {
          if (this.audioCtx) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(110, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.8);
          }
        }, 1200);
      }
    } catch (e) {}
  }

  startRainSound() {
    this.init();
    if (!this.audioCtx || this.rainOsc) return;
    try {
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
      this.rainGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);

      noise.connect(this.rainGain);
      this.rainGain.connect(this.audioCtx.destination);
      noise.start();
      this.rainOsc = noise;
    } catch (e) {}
  }

  stopRainSound() {
    if (this.rainOsc) {
      try {
        this.rainOsc.stop();
        this.rainOsc.disconnect();
      } catch (e) {}
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

window.gameSounds = new SoundManager();

