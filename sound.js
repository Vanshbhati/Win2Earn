// ==========================================================================
// SOUND ENGINE - Dynamic Ambient Synthesizer & Sound FX (Web Audio API)
// ==========================================================================
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.currentEnv = null;
    this.ambientNodes = [];
    this.activeIntervals = [];
    this.isMuted = false;
    this.masterGain = null;
    
    // Helicopter-specific continuous audio nodes
    this.chopperNode = null;
    this.chopperGain = null;
    this.chopperFilter = null;
    this.chopperLfo = null;
    
    // Rain-specific continuous audio nodes
    this.rainNode = null;
    this.rainGain = null;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audioCtx.destination);
    }
  }

  // Ensures audio context is active (vital for mobile touch/click requirements)
  ensureContextActive() {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Purely stop all ambient sounds & clear running intervals/loops
  stopBgMusic() {
    // Clear all scheduled intervals (bird chirps, owl hoots, thunder, etc.)
    this.activeIntervals.forEach(intervalId => clearInterval(intervalId));
    this.activeIntervals = [];

    // Stop and disconnect active audio nodes
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Safe catch for already stopped nodes
      }
    });
    this.ambientNodes = [];
    this.currentEnv = null;
  }

  // Switches audio environment dynamically based on game cycle
  setEnvironment(envType) {
    if (this.currentEnv === envType) return;
    this.ensureContextActive();

    this.stopBgMusic();
    this.currentEnv = envType;

    switch (envType) {
      case 'morning':
        this.startMorningAmbient();
        break;
      case 'sunset':
        this.startSunsetAmbient();
        break;
      case 'night':
        this.startNightAmbient();
        break;
    }
  }

  // ==========================================================================
  // HELICOPTER CONTINUOUS LOOP (Loud Chopper Engine Sound with Blade LFO)
  // ==========================================================================
  startChopper() {
    this.ensureContextActive();
    if (!this.audioCtx) return;
    this.stopChopper();

    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.chopperNode = this.audioCtx.createBufferSource();
      this.chopperNode.buffer = buffer;
      this.chopperNode.loop = true;

      this.chopperFilter = this.audioCtx.createBiquadFilter();
      this.chopperFilter.type = 'lowpass';
      this.chopperFilter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

      this.chopperGain = this.audioCtx.createGain();
      this.chopperGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

      // LFO to create realistic helicopter chop-chop blade sound
      this.chopperLfo = this.audioCtx.createOscillator();
      this.chopperLfo.frequency.setValueAtTime(15, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

      this.chopperLfo.connect(lfoGain);
      lfoGain.connect(this.chopperGain.gain);
      this.chopperLfo.start();

      this.chopperNode.connect(this.chopperFilter);
      this.chopperFilter.connect(this.chopperGain);
      if (this.masterGain) {
        this.chopperGain.connect(this.masterGain);
      } else {
        this.chopperGain.connect(this.audioCtx.destination);
      }

      this.chopperNode.start();
    } catch (e) {
      console.error("Chopper audio init error:", e);
    }
  }

  stopChopper() {
    if (this.chopperLfo) {
      try { this.chopperLfo.stop(); this.chopperLfo.disconnect(); } catch (e) {}
      this.chopperLfo = null;
    }
    if (this.chopperNode) {
      try { this.chopperNode.stop(); this.chopperNode.disconnect(); } catch (e) {}
      this.chopperNode = null;
    }
  }

  // ==========================================================================
  // RAIN EFFECT (15-second ambient rain sound, independent of environment)
  // ==========================================================================
  playRain() {
    this.ensureContextActive();
    if (!this.audioCtx) return;
    this.stopRain();

    try {
      const bufferSize = this.audioCtx.sampleRate * 15;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.rainNode = this.audioCtx.createBufferSource();
      this.rainNode.buffer = buffer;

      const rainFilter = this.audioCtx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      rainFilter.Q.setValueAtTime(1.0, this.audioCtx.currentTime);

      this.rainGain = this.audioCtx.createGain();
      this.rainGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.25, this.audioCtx.currentTime + 1.5);
      this.rainGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime + 13.5);
      this.rainGain.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 15.0);

      this.rainNode.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      if (this.masterGain) {
        this.rainGain.connect(this.masterGain);
      } else {
        this.rainGain.connect(this.audioCtx.destination);
      }

      this.rainNode.start();
      setTimeout(() => this.stopRain(), 15000);
    } catch (e) {
      console.error("Rain audio error:", e);
    }
  }

  stopRain() {
    if (this.rainNode) {
      try { this.rainNode.stop(); this.rainNode.disconnect(); } catch (e) {}
      this.rainNode = null;
    }
  }

  // ==========================================================================
  // AMBIENT ENVIRONMENTS
  // ==========================================================================
  startMorningAmbient() {
    const birdInterval = setInterval(() => {
      if (this.currentEnv !== 'morning') {
        clearInterval(birdInterval);
        return;
      }
      if (Math.random() < 0.65) this.playBirdChirp();
    }, 1600);

    this.activeIntervals.push(birdInterval);

    const windNoise = this.createNoiseNode(0.025, 400);
    if (windNoise) this.ambientNodes.push(windNoise);
  }

  playBirdChirp() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    const startFreq = 1800 + Math.random() * 800;
    osc.frequency.setValueAtTime(startFreq, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 600, this.audioCtx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(startFreq - 300, this.audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);

    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  startSunsetAmbient() {
    if (!this.audioCtx) return;
    const cricketOsc = this.audioCtx.createOscillator();
    const cricketGain = this.audioCtx.createGain();
    
    cricketOsc.type = 'sawtooth';
    cricketOsc.frequency.value = 4500;
    cricketGain.gain.value = 0.015;

    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 0.015;

    lfo.connect(cricketGain.gain);
    cricketOsc.connect(cricketGain);
    if (this.masterGain) cricketGain.connect(this.masterGain);

    lfo.start();
    cricketOsc.start();

    this.ambientNodes.push(lfo, cricketOsc);

    const windNoise = this.createNoiseNode(0.02, 300);
    if (windNoise) this.ambientNodes.push(windNoise);
  }

  startNightAmbient() {
    const windNoise = this.createNoiseNode(0.04, 220);
    if (windNoise) this.ambientNodes.push(windNoise);

    const owlInterval = setInterval(() => {
      if (this.currentEnv !== 'night') {
        clearInterval(owlInterval);
        return;
      }
      if (Math.random() < 0.4) this.playOwlHoot();
    }, 4500);

    this.activeIntervals.push(owlInterval);
  }

  playOwlHoot() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(270, this.audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, this.audioCtx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }

  createNoiseNode(vol, cutoffFreq) {
    if (!this.audioCtx) return null;
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoffFreq;

    const gain = this.audioCtx.createGain();
    gain.gain.value = vol;

    whiteNoise.connect(filter);
    filter.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    whiteNoise.start();
    return whiteNoise;
  }

  // ==========================================================================
  // SOUND FX
  // ==========================================================================
  playScore() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  playCrash() {
    this.ensureContextActive();
    if (!this.audioCtx) return;
    this.stopChopper();
    this.stopRain();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.audioCtx.currentTime + 0.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    filter.frequency.linearRampToValueAtTime(80, this.audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    if (this.masterGain) {
      gain.connect(this.masterGain);
    } else {
      gain.connect(this.audioCtx.destination);
    }

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.5);
  }
}

// Global Singleton Instance
window.gameSounds = new SoundManager();

// Global Touch/Click Unlocker for Mobile Browsers
document.addEventListener("touchstart", () => window.gameSounds.ensureContextActive(), { passive: true });
document.addEventListener("click", () => window.gameSounds.ensureContextActive(), { passive: true });

