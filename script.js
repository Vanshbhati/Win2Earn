// ==========================================================================
// STATE MANAGEMENT & DATA
// ==========================================================================
const appState = {
  currentUser: null,
  activeTab: 'home',
  leaderboardType: 'daily',
  generatedOtp: null,
  dailyScore: 0,
  monthlyScore: 0,
  currentRunScore: 0,
  activeGameType: 'daily'
};

const recentWinnersData = [
  { name: "Rahul Sharma", amount: "₹5000" },
  { name: "Priya Verma", amount: "₹5000" },
  { name: "Amit Patel", amount: "₹5000" }
];

let lbDailyData = [
  { rank: 1, name: "Aarav Sharma", score: 9850 },
  { rank: 2, name: "Rohan Verma", score: 9420 }
];

const lbWeeklyData = [
  { rank: 1, name: "Vikram Joshi", score: 48200 }
];

const alertsData = [
  { title: "🔥 Daily Tournament Active", desc: "Top 10 daily players get rewards!", time: "2 mins ago" }
];

// ==========================================================================
// PREMIUM SYNTHESIZED SOUND SYSTEM
// ==========================================================================
const gameSounds = {
  audioCtx: null,
  chopperNode: null,
  chopperGain: null,
  chopperFilter: null,
  chopperLfo: null,
  rainNode: null,
  rainGain: null,

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  startChopper() {
    this.init();
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
      this.chopperFilter.frequency.setValueAtTime(550, this.audioCtx.currentTime);

      this.chopperGain = this.audioCtx.createGain();
      this.chopperGain.gain.setValueAtTime(0.38, this.audioCtx.currentTime);

      this.chopperLfo = this.audioCtx.createOscillator();
      this.chopperLfo.frequency.setValueAtTime(16, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.chopperLfo.connect(lfoGain);
      lfoGain.connect(this.chopperGain.gain);
      this.chopperLfo.start();

      this.chopperNode.connect(this.chopperFilter);
      this.chopperFilter.connect(this.chopperGain);
      this.chopperGain.connect(this.audioCtx.destination);

      this.chopperNode.start();
    } catch (e) {
      console.error("Chopper audio init error:", e);
    }
  },

  stopChopper() {
    if (this.chopperLfo) {
      try { this.chopperLfo.stop(); this.chopperLfo.disconnect(); } catch (e) {}
      this.chopperLfo = null;
    }
    if (this.chopperNode) {
      try {
        this.chopperNode.stop();
        this.chopperNode.disconnect();
      } catch (e) {}
      this.chopperNode = null;
    }
  },

  playMilestone() {
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(987.77, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {
      console.error("Milestone audio error:", e);
    }
  },

  playBonus() {
    this.init();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, this.audioCtx.currentTime + 0.16);
      
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {
      console.error("Bonus audio error:", e);
    }
  },

  playRain() {
    this.init();
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
      rainFilter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      rainFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      this.rainGain = this.audioCtx.createGain();
      this.rainGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.32, this.audioCtx.currentTime + 1.5);
      this.rainGain.gain.setValueAtTime(0.32, this.audioCtx.currentTime + 13.5);
      this.rainGain.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 15.0);

      this.rainNode.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.audioCtx.destination);

      this.rainNode.start();
      setTimeout(() => this.stopRain(), 15000);
    } catch (e) {
      console.error("Rain audio error:", e);
    }
  },

  stopRain() {
    if (this.rainNode) {
      try {
        this.rainNode.stop();
        this.rainNode.disconnect();
      } catch (e) {}
      this.rainNode = null;
    }
  },

  playCrash() {
    this.init();
    if (!this.audioCtx) return;
    this.stopChopper();
    this.stopRain();

    try {
      const bufferSize = this.audioCtx.sampleRate * 0.6;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.6);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(15, this.audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
      osc.start();
      noise.stop(this.audioCtx.currentTime + 0.6);
      osc.stop(this.audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error("Crash audio error:", e);
    }
  }
};

function unlockMobileAudio() {
  gameSounds.init();
}

document.addEventListener("touchstart", unlockMobileAudio, { passive: true });
document.addEventListener("click", unlockMobileAudio, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initTicker();
  renderLeaderboard('daily');
  renderAlerts();
  initHeliGameListeners();
  setupMonthlyButtons();
  setupPauseModalHTML();
});

function setupMonthlyButtons() {
  const monthlyCards = document.querySelectorAll('.monthly-premium-card .game-play-btn');
  monthlyCards.forEach(btn => {
    btn.setAttribute('onclick', 'handleGameLaunch()');
  });
}

function setupPauseModalHTML() {
  const modalContainer = document.getElementById("gameScreenModal");
  if (!modalContainer) return;

  if (!document.getElementById("gamePauseOverlay")) {
    const pauseDiv = document.createElement("div");
    pauseDiv.id = "gamePauseOverlay";
    pauseDiv.className = "game-overlay hidden";
    pauseDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); display:flex; align-items:center; justify-content:center; z-index:50; cursor:pointer;";
    pauseDiv.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:32px 24px; max-width:320px; width:90%; background:rgba(255, 255, 255, 0.95); border: 2px solid rgba(255,255,255,0.8); border-radius:24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); transform: scale(1); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        <div style="font-size: 3rem; margin-bottom: 8px;">⏸️</div>
        <h2 style="font-size:1.6rem; font-weight:900; color:#0f172a; margin-bottom:6px; letter-spacing:0.5px;">GAME PAUSED</h2>
        <p style="font-size:0.9rem; color:#64748b; margin-bottom:24px; font-weight:500;">Take a breather! Tap below to resume your session.</p>
        <button id="resumeBtnInternal" class="glass-btn primary-btn" style="width:100%; padding:14px; font-weight:900; background:linear-gradient(135deg, #2563eb, #1d4ed8); color:#fff; border:none; border-radius:12px; font-size:1rem; box-shadow:0 8px 16px rgba(37,99,235,0.3);">RESUME GAME</button>
      </div>
    `;
    
    pauseDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      resumeGameWithCountdown();
    });
    modalContainer.appendChild(pauseDiv);
  }

  if (!document.getElementById("gameCountdownOverlay")) {
    const countDiv = document.createElement("div");
    countDiv.id = "gameCountdownOverlay";
    countDiv.className = "game-overlay hidden";
    countDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display:flex; align-items:center; justify-content:center; z-index:50;";
    countDiv.innerHTML = `
      <div style="font-size:6rem; font-weight:900; color:#facc15; text-shadow:0 4px 30px rgba(250,204,21,0.5); animation: pulseCount 0.9s infinite;" id="countdownNumber">3</div>
    `;
    modalContainer.appendChild(countDiv);
  }
}

function initSplashScreen() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.visibility = "hidden";
    document.body.classList.remove("no-scroll");
  }, 2000);
}

let tickerAnimationId = null;
function initTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;

  const fullWinners = [...recentWinnersData, ...recentWinnersData];
  track.innerHTML = fullWinners.map(item => `
    <div class="ticker-item">🎉 <strong>${item.name}</strong> won <span>${item.amount}</span></div>
  `).join("");

  let pos = 0;
  function step() {
    pos -= 0.6;
    if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
    track.style.transform = `translate3d(${pos}px, 0, 0)`;
    tickerAnimationId = requestAnimationFrame(step);
  }
  if (tickerAnimationId) cancelAnimationFrame(tickerAnimationId);
  tickerAnimationId = requestAnimationFrame(step);
}

function handleNavClick(e, tabName) {
  unlockMobileAudio();
  if (e) e.preventDefault();

  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) selectedTab.classList.remove("hidden");
  appState.activeTab = tabName;

  if (tabName === 'wallet') renderProfileWallet();
}

function showModal(modalId) { 
  unlockMobileAudio();
  document.getElementById(modalId)?.classList.remove("hidden"); 
}

function hideModal(modalId) { 
  unlockMobileAudio();
  document.getElementById(modalId)?.classList.add("hidden"); 
}

function openInfoModal() { showModal("infoModal"); }
function closeInfoModal() { hideModal("infoModal"); }
function openPayoutInfoModal() { showModal("payoutInfoModal"); }
function closePayoutInfoModal() { hideModal("payoutInfoModal"); }
function openTelegramModal() { showModal("telegramModal"); }
function closeTelegramModal() { hideModal("telegramModal"); }

function openAuthModal(tab) {
  switchTab(tab);
  showModal("authModal");
}
function closeAuthModal() { hideModal("authModal"); }

function openPopup(msg) {
  const msgElement = document.getElementById("popupMessage");
  if (msgElement) msgElement.innerText = msg;
  showModal("errorPopup");
}
function closePopup() { hideModal("errorPopup"); }

function switchTab(type) {
  unlockMobileAudio();
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (type === 'login') {
    loginForm?.classList.remove("hidden");
    signupForm?.classList.add("hidden");
  } else {
    loginForm?.classList.add("hidden");
    signupForm?.classList.remove("hidden");
  }
}

function sendOtp() {
  unlockMobileAudio();
  const mobile = document.getElementById("signupMobile")?.value;
  if (!mobile || mobile.length < 10) {
    openPopup("Please enter a valid 10-digit mobile number.");
    return;
  }
  const generated = Math.floor(1000 + Math.random() * 9000);
  appState.generatedOtp = generated.toString();
  const otpMsgElement = document.getElementById("otpPopupMessage");
  if (otpMsgElement) otpMsgElement.innerText = `OTP: ${generated}`;
  showModal("otpDisplayModal");
}

function handleLogin(e) {
  e.preventDefault();
  unlockMobileAudio();
  const email = document.getElementById("loginEmail")?.value || "user@example.com";
  appState.currentUser = { name: email.split("@")[0].toUpperCase(), email, upi: null };
  closeAuthModal();
  onUserLoggedIn();
}

function handleSignup(e) {
  e.preventDefault();
  unlockMobileAudio();
  const name = document.getElementById("signupName")?.value || "Player";
  const email = document.getElementById("signupEmail")?.value || "";
  appState.currentUser = { name, email, upi: null };
  closeAuthModal();
  onUserLoggedIn();
}

function onUserLoggedIn() {
  document.getElementById("megaBannerCard")?.classList.add("hidden");
}

function handleGameLaunch() {
  unlockMobileAudio();
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }
  showModal("gameScreenModal");
  setupPauseModalHTML();
  resetHeliGameUI();
}

function closeGameScreen() {
  unlockMobileAudio();
  gameSounds.stopChopper();
  gameSounds.stopRain();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.active = false;
  document.getElementById("gamePauseOverlay")?.classList.add("hidden");
  document.getElementById("gameCountdownOverlay")?.classList.add("hidden");
  hideModal("gameScreenModal");
}

function handleUniversalStart() {
  startHeliGame();
}

function pauseGame() {
  if (!heliGame.active) return;
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  gameSounds.stopChopper();
  gameSounds.stopRain();
  
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) {
    pauseOverlay.classList.remove("hidden");
    pauseOverlay.style.display = "flex";
  }
}

function resumeGameWithCountdown() {
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) {
    pauseOverlay.classList.add("hidden");
    pauseOverlay.style.display = "none";
  }

  const countOverlay = document.getElementById("gameCountdownOverlay");
  const countNumber = document.getElementById("countdownNumber");
  if (countOverlay) {
    countOverlay.classList.remove("hidden");
    countOverlay.style.display = "flex";
  }

  let count = 3;
  if (countNumber) countNumber.innerText = count;

  const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
      if (countNumber) countNumber.innerText = count;
    } else {
      clearInterval(countInterval);
      if (countOverlay) {
        countOverlay.classList.add("hidden");
        countOverlay.style.display = "none";
      }
      startHeliGameResumed();
    }
  }, 1000);
}

function startHeliGameResumed() {
  unlockMobileAudio();
  gameSounds.startChopper();
  if (heliGame.isRaining) gameSounds.playRain();

  heliGame.active = true;
  heliGame.lastTime = performance.now();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

// ==========================================================================
// GAME ENGINE WITH UPDATED SPEED & 1500-UNIT ENVIRONMENT LOOP
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  x: 50,
  y: 200,
  width: 48,
  height: 28,
  
  gravity: 1200,
  velocity: 0,
  jumpVelocity: -380,
  angle: 0,
  rotorFrame: 0,
  
  pipes: [],
  pipeWidth: 50,
  basePipeSpeed: 170, // Updated base speed to 170
  currentPipeSpeed: 170,
  pipeSpacing: 230,
  groundHeight: 60,
  groundOffset: 0,

  rawScoreAcc: 0,
  distanceMeters: 0,
  bonusScore: 0,
  bestScore: 0,
  bgScroll: 0,
  cloudScroll: 0,

  lastMilestoneScore: 0,
  scoreBlinkTimer: 0,
  isRaining: false,
  rainTimer: 0,
  lastRainMilestone: 0,
  raindrops: [],
  stars: [],
  floatingTexts: []
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d", { alpha: false });

  const handlePointer = (e) => {
    if (!heliGame.active) return;
    if (e.type === 'touchstart') e.preventDefault();
    unlockMobileAudio();
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      
      // Exit button check
      if (clickX >= 12 && clickX <= 92 && clickY >= 12 && clickY <= 44) {
        closeGameScreen();
        return;
      }
      // Pause button check
      if (clickX >= 12 && clickX <= 92 && clickY >= 48 && clickY <= 80) {
        pauseGame();
        return;
      }
    }
    triggerHeliJump();
  };

  canvas.addEventListener("touchstart", handlePointer, { passive: false });
  canvas.addEventListener("mousedown", handlePointer);

  window.addEventListener("keydown", (e) => {
    const gameModal = document.getElementById("gameScreenModal");
    if (e.code === "Space" && gameModal && !gameModal.classList.contains("hidden")) {
      e.preventDefault();
      triggerHeliJump();
    }
  });
}

function triggerHeliJump() {
  if (!heliGame.active) return;
  unlockMobileAudio();
  heliGame.velocity = heliGame.jumpVelocity;
}

function resetHeliGameUI() {
  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) { pauseOverlay.classList.add("hidden"); pauseOverlay.style.display = "none"; }
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  document.getElementById("gameCountdownOverlay")?.classList.add("hidden");
  
  const canvas = heliGame.canvas;
  if (!canvas) return;
  
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bonusScore = 0;
  heliGame.bgScroll = 0;
  heliGame.cloudScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.lastMilestoneScore = 0;
  heliGame.scoreBlinkTimer = 0;
  heliGame.isRaining = false;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = 0;
  heliGame.raindrops = [];
  heliGame.floatingTexts = [];
  
  heliGame.stars = [];
  for (let i = 0; i < 40; i++) {
    heliGame.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.6),
      size: Math.random() * 2.2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1
    });
  }
  
  renderCanvas();
}

function startHeliGame() {
  unlockMobileAudio();

  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) { pauseOverlay.classList.add("hidden"); pauseOverlay.style.display = "none"; }
  document.getElementById("gameCountdownOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bonusScore = 0;
  heliGame.bgScroll = 0;
  heliGame.cloudScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.lastMilestoneScore = 0;
  heliGame.scoreBlinkTimer = 0;
  heliGame.isRaining = false;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = 0;
  heliGame.raindrops = [];
  heliGame.floatingTexts = [];
  heliGame.active = true;
  heliGame.lastTime = performance.now();

  gameSounds.startChopper();

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function heliGameLoop(timestamp) {
  if (!heliGame.active) return;

  let dt = (timestamp - heliGame.lastTime) / 1000;
  if (dt > 0.05) dt = 0.05;
  heliGame.lastTime = timestamp;

  updatePhysics(dt);
  renderCanvas();

  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function updatePhysics(dt) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;

  heliGame.rawScoreAcc += dt * 12;
  heliGame.distanceMeters = Math.floor(heliGame.rawScoreAcc);

  if (heliGame.distanceMeters > 0 && heliGame.distanceMeters % 100 === 0 && heliGame.distanceMeters !== heliGame.lastMilestoneScore) {
    heliGame.lastMilestoneScore = heliGame.distanceMeters;
    heliGame.scoreBlinkTimer = 0.6;
    gameSounds.playMilestone();
  }

  if (heliGame.scoreBlinkTimer > 0) {
    heliGame.scoreBlinkTimer -= dt;
  }

  const currentRainMilestone = Math.floor(heliGame.distanceMeters / 750);
  if (currentRainMilestone > 0 && currentRainMilestone !== heliGame.lastRainMilestone) {
    heliGame.lastRainMilestone = currentRainMilestone;
    heliGame.isRaining = true;
    heliGame.rainTimer = 15.0;
    gameSounds.playRain();
  }

  if (heliGame.isRaining) {
    heliGame.rainTimer -= dt;
    if (heliGame.rainTimer <= 0) {
      heliGame.isRaining = false;
    }
  }

  // --- Speed Logic: Base speed 170, +40 increase for every 1000 distance completed ---
  const speedIncrement = Math.floor(heliGame.distanceMeters / 1000) * 40;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed + speedIncrement;

  heliGame.velocity += heliGame.gravity * dt;
  heliGame.y += heliGame.velocity * dt;
  heliGame.angle = Math.min(25, Math.max(-20, heliGame.velocity * 0.06));
  heliGame.rotorFrame += dt * 35;
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.currentPipeSpeed * dt)) % 30;
  heliGame.bgScroll += (heliGame.currentPipeSpeed * dt);
  heliGame.cloudScroll += (heliGame.currentPipeSpeed * dt * 0.4);

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  const heliBox = { 
    x: heliGame.x + 6, 
    y: heliGame.y + 6, 
    w: heliGame.width - 12, 
    h: heliGame.height - 10 
  };

  if (heliGame.y + heliGame.height >= playableHeight) {
    handleCrash();
    return;
  }

  if (heliGame.pipes.length === 0) {
    spawnPipe(canvas.width + 20);
  } else {
    const lastPipe = heliGame.pipes[heliGame.pipes.length - 1];
    if (canvas.width - lastPipe.x >= heliGame.pipeSpacing) {
      spawnPipe(canvas.width);
    }
  }

  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.currentPipeSpeed * dt;

    const topPipeBox = { x: p.x, y: 0, w: heliGame.pipeWidth, h: p.topHeight };
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY + 10 };

    if (checkAABBCollision(heliBox, topPipeBox) || checkAABBCollision(heliBox, bottomPipeBox)) {
      handleCrash();
      return;
    }

    if (!p.bonusAwarded && heliGame.x > p.x + heliGame.pipeWidth) {
      p.bonusAwarded = true;
      
      const distToTopEdge = Math.abs(heliGame.y - p.topHeight);
      const distToBottomEdge = Math.abs((heliGame.y + heliGame.height) - p.bottomY);
      const strictThreshold = 18;

      if (distToTopEdge <= strictThreshold || distToBottomEdge <= strictThreshold) {
        heliGame.bonusScore += 50;
        gameSounds.playBonus();

        heliGame.floatingTexts.push({
          text: "+50",
          x: p.x + heliGame.pipeWidth / 2,
          y: distToTopEdge <= strictThreshold ? p.topHeight + 15 : p.bottomY - 15,
          alpha: 1.0,
          vy: -40
        });
      }
    }
  }

  for (let f = heliGame.floatingTexts.length - 1; f >= 0; f--) {
    let ft = heliGame.floatingTexts[f];
    ft.y += ft.vy * dt;
    ft.alpha -= dt * 1.2;
    if (ft.alpha <= 0) {
      heliGame.floatingTexts.splice(f, 1);
    }
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth - 10) {
    heliGame.pipes.shift();
  }

  if (heliGame.isRaining) {
    if (heliGame.raindrops.length < 120) {
      heliGame.raindrops.push({
        x: Math.random() * canvas.width,
        y: -10,
        length: Math.random() * 15 + 10,
        speed: Math.random() * 400 + 600
      });
    }
    for (let drop of heliGame.raindrops) {
      drop.y += drop.speed * dt;
      drop.x -= 120 * dt;
      if (drop.y > canvas.height) {
        drop.y = -10;
        drop.x = Math.random() * canvas.width;
      }
    }
  } else {
    heliGame.raindrops = [];
  }
}

function spawnPipe(startX) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;
  
  const currentGap = 165;
  const minH = 40;
  const maxH = playableHeight - currentGap - minH;
  const topHeight = Math.floor(Math.random() * (maxH - minH + 1)) + minH;

  heliGame.pipes.push({
    x: startX,
    topHeight: topHeight,
    bottomY: topHeight + currentGap,
    gapSize: currentGap,
    bonusAwarded: false
  });
}

function checkAABBCollision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function renderCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  const score = heliGame.distanceMeters;

  // --- Environment Sequence & Timing (1500-unit loop repeated) ---
  const cycleScore = score % 1500;
  
  let skyTop, skyMid, skyBottom, showSun = false, showStars = false;

  if (cycleScore >= 1000 && cycleScore < 1500) {
    // Night: 1000 – 1500
    skyTop = "#1e1b4b";
    skyMid = "#312e81";
    skyBottom = "#4338ca";
    showStars = true;
  } else if (cycleScore >= 500 && cycleScore < 1000) {
    // Sunset: 500 – 1000
    skyTop = "#fed7aa";
    skyMid = "#f472b6";
    skyBottom = "#fb923c";
    showSun = true;
  } else {
    // Normal Day: 0 – 500 (and 1500-2000 loop continuation)
    skyTop = heliGame.isRaining ? "#2c3e50" : "#38bdf8";
    skyMid = heliGame.isRaining ? "#34495e" : "#7dd3fc";
    skyBottom = heliGame.isRaining ? "#475569" : "#e0f2fe";
  }

  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, skyTop);
  skyGrad.addColorStop(0.5, skyMid);
  skyGrad.addColorStop(1, skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (showStars && heliGame.stars) {
    ctx.save();
    for (let star of heliGame.stars) {
      star.alpha += (Math.random() * 0.04 - 0.02) * star.twinkleSpeed;
      if (star.alpha > 1) star.alpha = 1;
      if (star.alpha < 0.2) star.alpha = 0.2;

      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (showSun) {
    ctx.save();
    const sunX = canvas.width * 0.75;
    const sunY = canvas.height * 0.35;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
    sunGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    sunGrad.addColorStop(0.5, "rgba(254, 240, 138, 0.7)");
    sunGrad.addColorStop(1, "rgba(251, 146, 60, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (!(cycleScore >= 500 && cycleScore < 1000) && !(cycleScore >= 1000 && cycleScore < 1500)) {
    drawMovingClouds(ctx, canvas.width, canvas.height, heliGame.cloudScroll);
  }

  drawBackgroundCity(ctx, canvas.width, canvas.height, heliGame.bgScroll, (cycleScore >= 500 && cycleScore < 1000), (cycleScore >= 1000 && cycleScore < 1500));

  const playableHeight = canvas.height - heliGame.groundHeight;
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = playableHeight - p.bottomY + 12;
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  if (heliGame.floatingTexts && heliGame.floatingTexts.length > 0) {
    ctx.save();
    ctx.font = "900 16px sans-serif";
    ctx.textAlign = "center";
    for (let ft of heliGame.floatingTexts) {
      ctx.fillStyle = `rgba(250, 204, 21, ${ft.alpha})`;
      ctx.strokeStyle = `rgba(15, 23, 42, ${ft.alpha})`;
      ctx.lineWidth = 3.5;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  drawCartoonThemeGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);

  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame, (cycleScore >= 1000 && cycleScore < 1500));

  if (heliGame.isRaining && heliGame.raindrops.length > 0) {
    ctx.strokeStyle = "rgba(174, 219, 238, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let drop of heliGame.raindrops) {
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 4, drop.y + drop.length);
    }
    ctx.stroke();
  }

  renderTopHeaderUI(ctx, canvas.width);
}

function drawMovingClouds(ctx, w, h, cloudScroll) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  const loopW = 400;
  const offsetX = (cloudScroll * 0.3) % loopW;

  const clouds = [
    { x: 50, y: 60, w: 70, h: 24 },
    { x: 220, y: 110, w: 90, h: 30 },
    { x: 340, y: 50, w: 60, h: 20 }
  ];

  for (let i = -1; i < Math.ceil(w / loopW) + 1; i++) {
    const baseX = i * loopW - offsetX;
    clouds.forEach(c => {
      const cx = baseX + c.x;
      const cy = c.y;
      ctx.beginPath();
      ctx.arc(cx, cy, c.h, 0, Math.PI * 2);
      ctx.arc(cx + c.w * 0.4, cy - c.h * 0.3, c.h * 0.8, 0, Math.PI * 2);
      ctx.arc(cx + c.w, cy, c.h * 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawBackgroundCity(ctx, w, h, bgScroll, isSunset, isNight) {
  const baseLineY = h - heliGame.groundHeight + 10;
  
  const buildings = [
    { x: 0, w: 48, h: 95, wallColor: isNight ? "#1e293b" : (isSunset ? "#c2410c" : "#3b82f6") },
    { x: 52, w: 40, h: 125, wallColor: isNight ? "#1e293b" : (isSunset ? "#db2777" : "#8b5cf6") },
    { x: 96, w: 54, h: 80, wallColor: isNight ? "#1e293b" : (isSunset ? "#ea580c" : "#10b981") },
    { x: 154, w: 44, h: 140, wallColor: isNight ? "#1e293b" : (isSunset ? "#9333ea" : "#f59e0b") },
    { x: 202, w: 50, h: 105, wallColor: isNight ? "#1e293b" : (isSunset ? "#be185d" : "#06b6d4") }
  ];

  const loopW = 260;
  const offsetX = (bgScroll * 0.12) % loopW;

  ctx.save();
  for (let i = -1; i < Math.ceil(w / loopW) + 1; i++) {
    const baseX = i * loopW - offsetX;
    buildings.forEach(b => {
      const bx = baseX + b.x;
      const by = baseLineY - b.h;

      ctx.fillStyle = b.wallColor;
      ctx.fillRect(bx, by, b.w, b.h + 20);

      ctx.fillStyle = isNight ? "#fde047" : "rgba(255, 255, 255, 0.85)";
      for (let wY = 12; wY < b.h - 8; wY += 18) {
        ctx.fillRect(bx + 6, by + wY, 6, 8);
        if (b.w > 36) ctx.fillRect(bx + b.w - 12, by + wY, 6, 8);
      }
    });
  }
  ctx.restore();
}

function drawCartoonThemeGround(ctx, width, height, groundHeight, scrollOffset) {
  const groundY = height - groundHeight;

  ctx.save();
  ctx.fillStyle = "#5c9e31";
  ctx.fillRect(0, groundY, width, 14);

  ctx.fillStyle = "#80d038";
  ctx.fillRect(0, groundY, width, 4);

  ctx.fillStyle = "#d8be70";
  ctx.fillRect(0, groundY + 14, width, groundHeight - 14);

  ctx.fillStyle = "#be9d48";
  const tileSize = 20;
  const startX = -(scrollOffset % tileSize);

  for (let x = startX; x < width + tileSize; x += tileSize) {
    ctx.fillRect(x, groundY + 14, 2, groundHeight - 14);
    ctx.fillRect(x, groundY + 28, tileSize, 2);
    ctx.fillRect(x, groundY + 44, tileSize, 2);
  }

  ctx.fillStyle = "#2d5116";
  ctx.fillRect(0, groundY + 13, width, 2);
  ctx.restore();
}

function drawCleanPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;

  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "#9ce659";
  ctx.fillRect(x + 4, y, 5, h);

  ctx.fillStyle = "#498818";
  ctx.fillRect(x + w - 7, y, 7, h);

  ctx.strokeStyle = "#2e520e";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  const capH = 20;
  const overhang = 4;
  const capX = x - overhang;
  const capW = w + (overhang * 2);
  const capY = isTop ? y + h - capH : y;

  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(capX, capY, capW, capH);
  ctx.fillStyle = "#9ce659";
  ctx.fillRect(capX + 4, capY, 5, capH);
  ctx.fillStyle = "#498818";
  ctx.fillRect(capX + capW - 7, capY, 7, capH);
  ctx.strokeRect(capX, capY, capW, capH);
}

function drawVectorHelicopter(ctx, x, y, angleDeg, frame, isNight) {
  ctx.save();
  ctx.translate(x + 22, y + 14);

  if (isNight) {
    ctx.save();
    ctx.rotate((angleDeg * Math.PI) / 180);
    const lightGrad = ctx.createLinearGradient(16, 2, 280, 20);
    lightGrad.addColorStop(0, "rgba(254, 240, 138, 0.85)");
    lightGrad.addColorStop(0.4, "rgba(250, 204, 21, 0.35)");
    lightGrad.addColorStop(1, "rgba(250, 204, 21, 0)");

    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(300, -80);
    ctx.lineTo(300, 100);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(-20, -3, 15, 6);
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -3, 15, 6);

  ctx.fillStyle = "#f39c12";
  ctx.beginPath();
  ctx.moveTo(-18, -3);
  ctx.lineTo(-24, -10);
  ctx.lineTo(-14, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2.5;
  const tailRotorSpin = Math.sin(frame * 2.5) * 7;
  ctx.beginPath();
  ctx.moveTo(-23, -6 - tailRotorSpin);
  ctx.lineTo(-23, -6 + tailRotorSpin);
  ctx.stroke();

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.ellipse(2, 1, 14, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.arc(6, -1, 7, -Math.PI / 2, Math.PI / 3);
  ctx.lineTo(6, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillRect(7, -4, 3, 3);

  if (isNight) {
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(16, 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(-1, -13, 4, 4);

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 3;
  const blurWidth = 24 * Math.abs(Math.sin(frame));
  ctx.beginPath();
  ctx.moveTo(1 - blurWidth, -13);
  ctx.lineTo(1 + blurWidth, -13);
  ctx.stroke();

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, 11);
  ctx.lineTo(-6, 15);
  ctx.moveTo(6, 11);
  ctx.lineTo(6, 15);
  ctx.moveTo(-12, 15);
  ctx.lineTo(14, 15);
  ctx.stroke();

  ctx.restore();
}

function renderTopHeaderUI(ctx, w) {
  ctx.save();

  const exitX = 12, exitY = 12, exitW = 80, exitH = 32;
  const exitGrad = ctx.createLinearGradient(exitX, exitY, exitX, exitY + exitH);
  exitGrad.addColorStop(0, "#ef4444");
  exitGrad.addColorStop(1, "#b91c1c");

  ctx.fillStyle = exitGrad;
  drawRoundedRect(ctx, exitX, exitY, exitW, exitH, 10, true);
  ctx.strokeStyle = "#fca5a5";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 4;
  ctx.fillText("✕ EXIT", exitX + exitW / 2, exitY + exitH / 2 + 1);
  ctx.shadowBlur = 0;

  const pauseX = 12, pauseY = 48, pauseW = 80, exitH_pause = 32;
  const pauseGrad = ctx.createLinearGradient(pauseX, pauseY, pauseX, pauseY + exitH_pause);
  pauseGrad.addColorStop(0, "#475569");
  pauseGrad.addColorStop(1, "#1e293b");

  ctx.fillStyle = pauseGrad;
  drawRoundedRect(ctx, pauseX, pauseY, pauseW, exitH_pause, 10, true);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 4;
  ctx.fillText("⏸ PAUSE", pauseX + pauseW / 2, pauseY + exitH_pause / 2 + 1);
  ctx.shadowBlur = 0;

  const scoreStr = String(heliGame.distanceMeters).padStart(5, '0');
  const scoreW = 115, scoreH = 32;
  const scoreX = w - scoreW - 12, scoreY = 12;

  let scoreBoxGradTop = "#3b82f6";
  let scoreBoxGradBottom = "#1d4ed8";
  let scaleOffset = 1;

  if (heliGame.scoreBlinkTimer > 0) {
    scoreBoxGradTop = "#f59e0b";
    scoreBoxGradBottom = "#b45309";
    scaleOffset = 1.04 + Math.sin(heliGame.scoreBlinkTimer * 30) * 0.04;
  }

  ctx.save();
  if (heliGame.scoreBlinkTimer > 0) {
    ctx.translate(scoreX + scoreW / 2, scoreY + scoreH / 2);
    ctx.scale(scaleOffset, scaleOffset);
    ctx.translate(-(scoreX + scoreW / 2), -(scoreY + scoreH / 2));
  }

  const scoreGrad = ctx.createLinearGradient(scoreX, scoreY, scoreX, scoreY + scoreH);
  scoreGrad.addColorStop(0, scoreBoxGradTop);
  scoreGrad.addColorStop(1, scoreBoxGradBottom);

  ctx.fillStyle = scoreGrad;
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 10, true);
  ctx.strokeStyle = heliGame.scoreBlinkTimer > 0 ? "#fef08a" : "#93c5fd";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 15px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText(scoreStr, scoreX + scoreW / 2, scoreY + scoreH / 2 + 1);
  ctx.restore();

  const bonusStr = `⭐ BONUS: +${heliGame.bonusScore}`;
  const bonusW = 125, bonusH = 30;
  const bonusX = w - bonusW - 12, bonusY = 50;

  const bonusGrad = ctx.createLinearGradient(bonusX, bonusY, bonusX + bonusW, bonusY + bonusH);
  bonusGrad.addColorStop(0, "#10b981");
  bonusGrad.addColorStop(1, "#047857");

  ctx.fillStyle = bonusGrad;
  drawRoundedRect(ctx, bonusX, bonusY, bonusW, bonusH, 10, true);
  ctx.strokeStyle = "#a7f3d0";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 11px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText(bonusStr, bonusX + bonusW / 2, bonusY + bonusH / 2 + 1);

  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
}

function handleCrash() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  unlockMobileAudio();
  gameSounds.stopChopper();
  gameSounds.stopRain();
  gameSounds.playCrash();

  const finalRunTotal = heliGame.distanceMeters + heliGame.bonusScore;

  appState.currentRunScore = finalRunTotal;
  appState.dailyScore += finalRunTotal;

  if (finalRunTotal > heliGame.bestScore) {
    heliGame.bestScore = finalRunTotal;
  }

  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  
  if (runScoreEl) runScoreEl.innerText = `${finalRunTotal} (Distance: ${heliGame.distanceMeters} + Bonus: ${heliGame.bonusScore})`;
  if (dailyTotalEl) dailyTotalEl.innerText = `Total Score: ${appState.dailyScore} (Best: ${heliGame.bestScore})`;

  updateLeaderboardWithUserScore();
  document.getElementById("gameOverOverlay")?.classList.remove("hidden");
}

function updateLeaderboardWithUserScore() {
  if (!appState.currentUser) return;
  const targetData = lbDailyData;
  const existingIdx = targetData.findIndex(item => item.name === appState.currentUser.name);
  if (existingIdx !== -1) {
    targetData[existingIdx].score = appState.dailyScore;
  } else {
    targetData.push({ rank: targetData.length + 1, name: appState.currentUser.name, score: appState.dailyScore });
  }
  targetData.sort((a, b) => b.score - a.score);
  targetData.forEach((item, index) => item.rank = index + 1);
  renderLeaderboard('daily');
}

function switchLeaderboard(type) {
  unlockMobileAudio();
  appState.leaderboardType = type;
  document.getElementById("btnDailyLb")?.classList.toggle("active", type === 'daily');
  document.getElementById("btnWeeklyLb")?.classList.toggle("active", type === 'weekly');
  renderLeaderboard(type);
}

function renderLeaderboard(type) {
  const container = document.getElementById("lbList");
  if (!container) return;
  const data = type === 'daily' ? lbDailyData : lbWeeklyData;

  container.innerHTML = data.map(item => `
    <div class="lb-row">
      <span class="lb-rank ${item.rank <= 3 ? 'top' + item.rank : ''}">#${item.rank}</span>
      <span class="lb-name">${item.name}</span>
      <span class="lb-score">${item.score.toLocaleString()} pts</span>
    </div>
  `).join("");
}

function renderAlerts() {
  const container = document.getElementById("alertsFeed");
  if (!container) return;
  container.innerHTML = alertsData.map(item => `
    <div class="alert-card glass-card">
      <div class="alert-time">${item.time}</div>
      <div class="alert-title">${item.title}</div>
      <div class="alert-desc">${item.desc}</div>
    </div>
  `).join("");
}

function renderProfileWallet() {
  const profileContainer = document.getElementById("profileDetailsContainer");
  if (!appState.currentUser) {
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="glass-card" style="padding: 16px; text-align: center;">
          <p style="font-size: 0.82rem; color: #6e6e73; margin-bottom: 10px;">Log in to access your Wallet.</p>
          <button class="glass-btn primary-btn" onclick="openAuthModal('login')">LOG IN NOW</button>
        </div>
      `;
    }
    return;
  }
  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="glass-card" style="padding: 16px; text-align: left;">
        <div style="font-size: 0.72rem; color: #8e8e93; font-weight: 800;">ACCOUNT HOLDER</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #1c1c1e;">${appState.currentUser.name}</div>
      </div>
    `;
  }
}

