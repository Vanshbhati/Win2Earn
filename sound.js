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
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.audioCtx.destination);
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
    this.init();
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

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
      case 'rain':
        this.startRainAmbient();
        break;
    }
  }

  // 1. MORNING AMBIENT (Birds Chirping + Gentle Wind)
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
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  // 2. SUNSET AMBIENT (Crickets Chirping + Evening Breeze)
  startSunsetAmbient() {
    const cricketOsc = this.audioCtx.createOscillator();
    const cricketGain = this.audioCtx.createGain();
    
    cricketOsc.type = 'sawtooth';
    cricketOsc.frequency.value = 4500;
    cricketGain.gain.value = 0.015;

    // Pulse cricket sound using LFO
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.value = 8;
    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.value = 0.015;

    lfo.connect(cricketGain.gain);
    cricketOsc.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    lfo.start();
    cricketOsc.start();

    this.ambientNodes.push(lfo, cricketOsc);

    const windNoise = this.createNoiseNode(0.02, 300);
    if (windNoise) this.ambientNodes.push(windNoise);
  }

  // 3. NIGHT AMBIENT (Deep Night Breeze + Owl Hoot)
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
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }

  // 4. RAIN AMBIENT (Constant Rain Sound + Random Thunder Claps)
  startRainAmbient() {
    const rainNoise = this.createNoiseNode(0.09, 1300);
    if (rainNoise) this.ambientNodes.push(rainNoise);

    const thunderInterval = setInterval(() => {
      if (this.currentEnv !== 'rain') {
        clearInterval(thunderInterval);
        return;
      }
      if (Math.random() < 0.35) this.playThunder();
    }, 5000);

    this.activeIntervals.push(thunderInterval);
  }

  playThunder() {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 160;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.8);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
  }

  // Helper function to synthesize ambient noise
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
    gain.connect(this.masterGain);

    whiteNoise.start();
    return whiteNoise;
  }

  // SOUND FX: Score Point Ring
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
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  // SOUND FX: Crash Sound
  playCrash() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }
}

// Global Singleton Instance
window.gameSounds = new SoundManager();

