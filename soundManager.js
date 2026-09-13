// Safe Sound System for Mobile - Cleaned & High Volume
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.envInterval = null;
    this.bgNoiseNode = null;
    this.bgGainNode = null;
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

  // Pipe Cross Sound (Crisp Bright Chime)
  playScore() {
    this.init();
    if (!this.audioCtx) return;
    try {
      const t = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(988, t);
      osc1.frequency.exponentialRampToValueAtTime(1318, t + 0.12);

      osc2.frequency.setValueAtTime(1976, t);
      osc2.frequency.exponentialRampToValueAtTime(2637, t + 0.12);

      // High Volume Gain
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.2);
      osc2.stop(t + 0.2);
    } catch (e) {}
  }

  // Crash Sound (Heavy Impact Burst)
  playCrash() {
    this.init();
    if (!this.audioCtx) return;
    try {
      this.stopBgMusic();
      const t = this.audioCtx.currentTime;

      // Heavy Bass Drop
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(25, t + 0.35);

      oscGain.gain.setValueAtTime(0.6, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.4);

      // Noise Impact Explosion
      const bufferSize = this.audioCtx.sampleRate * 0.4;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + 0.38);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.7, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);

      noise.start(t);
      noise.stop(t + 0.4);
    } catch (e) {}
  }

  // Dynamic High-Volume Environments
  setEnvironment(type) {
    if (this.currentEnv === type) return;
    this.currentEnv = type;
    this.stopBgMusic();
    this.init();
    if (!this.audioCtx) return;

    try {
      if (type === 'morning') {
        // High-Volume Realistic Bird Chirps
        const playChirp = () => {
          if (this.currentEnv !== 'morning' || !this.audioCtx) return;
          const t = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          const startFreq = 2200 + Math.random() * 800;
          const midFreq = startFreq + (Math.random() > 0.5 ? 600 : -400);
          const endFreq = startFreq + 300;

          osc.frequency.setValueAtTime(startFreq, t);
          osc.frequency.linearRampToValueAtTime(midFreq, t + 0.04);
          osc.frequency.linearRampToValueAtTime(endFreq, t + 0.08);

          // LOUD VOLUME
          gain.gain.setValueAtTime(0.45, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(t);
          osc.stop(t + 0.1);

          if (Math.random() < 0.6) {
            setTimeout(() => {
              if (this.currentEnv === 'morning') playChirp();
            }, 120);
          }
        };

        this.envInterval = setInterval(() => {
          if (Math.random() < 0.8) playChirp();
        }, 600);
        playChirp();

      } else if (type === 'sunset') {
        // Dusk Wind + Cricket Chirps
        const bufferSize = this.audioCtx.sampleRate * 2;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        this.bgNoiseNode = this.audioCtx.createBufferSource();
        this.bgNoiseNode.buffer = buffer;
        this.bgNoiseNode.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);
        filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

        this.bgGainNode = this.audioCtx.createGain();
        this.bgGainNode.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

        this.bgNoiseNode.connect(filter);
        filter.connect(this.bgGainNode);
        this.bgGainNode.connect(this.audioCtx.destination);
        this.bgNoiseNode.start();

        const playCricket = () => {
          if (this.currentEnv !== 'sunset' || !this.audioCtx) return;
          const t = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(4500, t);

          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(t);
          osc.stop(t + 0.06);
        };

        this.envInterval = setInterval(() => {
          if (Math.random() < 0.7) playCricket();
        }, 250);

      } else if (type === 'night') {
        // Strong Howling Night Wind
        const bufferSize = this.audioCtx.sampleRate * 3;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        this.bgNoiseNode = this.audioCtx.createBufferSource();
        this.bgNoiseNode.buffer = buffer;
        this.bgNoiseNode.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(280, this.audioCtx.currentTime);
        filter.Q.setValueAtTime(4.0, this.audioCtx.currentTime);

        this.bgGainNode = this.audioCtx.createGain();
        this.bgGainNode.gain.setValueAtTime(0.55, this.audioCtx.currentTime);

        this.bgNoiseNode.connect(filter);
        filter.connect(this.bgGainNode);
        this.bgGainNode.connect(this.audioCtx.destination);
        this.bgNoiseNode.start();

        let angle = 0;
        this.envInterval = setInterval(() => {
          if (this.currentEnv !== 'night' || !this.audioCtx) return;
          angle += 0.15;
          const freq = 220 + Math.sin(angle) * 160 + Math.cos(angle * 0.5) * 80;
          filter.frequency.setTargetAtTime(freq, this.audioCtx.currentTime, 0.1);
        }, 100);
      }
    } catch (e) {}
  }

  stopBgMusic() {
    if (this.envInterval) {
      clearInterval(this.envInterval);
      this.envInterval = null;
    }
    if (this.bgNoiseNode) {
      try { this.bgNoiseNode.stop(); } catch(e) {}
      this.bgNoiseNode.disconnect();
      this.bgNoiseNode = null;
    }
    if (this.bgGainNode) {
      this.bgGainNode.disconnect();
      this.bgGainNode = null;
    }
    this.currentEnv = null;
  }
}

window.gameSounds = new SoundManager();

