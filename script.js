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
    } catch (e) {}
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
    } catch (e) {}
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
    } catch (e) {}
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
      this.rainGain = this.audioCtx.createGain();
      this.rainGain.gain.setValueAtTime(0.32, this.audioCtx.currentTime);
      this.rainNode.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.audioCtx.destination);
      this.rainNode.start();
      setTimeout(() => this.stopRain(), 15000);
    } catch (e) {}
  },

  stopRain() {
    if (this.rainNode) {
      try { this.rainNode.stop(); this.rainNode.disconnect(); } catch (e) {}
      this.rainNode = null;
    }
  },

  playCrash() {
    this.init();
    if (!this.audioCtx) return;
    this.stopChopper();
    this.stopRain();
    try {
      const bufferSize = this.audioCtx.sampleRate * 0.5;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
      noise.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);
      noise.start();
      noise.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {}
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
      <div class="glass-card" style="text-align:center; padding:32px 24px; max-width:320px; width:90%; background:rgba(255, 255, 255, 0.95); border-radius:24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
        <div style="font-size: 3rem; margin-bottom: 8px;">⏸️</div>
        <h2 style="font-size:1.6rem; font-weight:900; color:#0f172a; margin-bottom:6px;">GAME PAUSED</h2>
        <p style="font-size:0.9rem; color:#64748b; margin-bottom:24px;">Tap below to resume your session.</p>
        <button id="resumeBtnInternal" class="glass-btn primary-btn" style="width:100%; padding:14px; font-weight:900; background:#2563eb; color:#fff; border:none; border-radius:12px; font-size:1rem;">RESUME GAME</button>
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
    countDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.6); display:flex; align-items:center; justify-content:center; z-index:50;";
    countDiv.innerHTML = `<div style="font-size:6rem; font-weight:900; color:#facc15;" id="countdownNumber">3</div>`;
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

function showModal(modalId) { unlockMobileAudio(); document.getElementById(modalId)?.classList.remove("hidden"); }
function hideModal(modalId) { unlockMobileAudio(); document.getElementById(modalId)?.classList.add("hidden"); }

function openInfoModal() { showModal("infoModal"); }
function closeInfoModal() { hideModal("infoModal"); }
function openPayoutInfoModal() { showModal("payoutInfoModal"); }
function closePayoutInfoModal() { hideModal("payoutInfoModal"); }
function openTelegramModal() { showModal("telegramModal"); }
function closeTelegramModal() { hideModal("telegramModal"); }
function openAuthModal(tab) { switchTab(tab); showModal("authModal"); }
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
}

function handleSignup(e) {
  e.preventDefault();
  unlockMobileAudio();
  const name = document.getElementById("signupName")?.value || "Player";
  const email = document.getElementById("signupEmail")?.value || "";
  appState.currentUser = { name, email, upi: null };
  closeAuthModal();
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

function handleUniversalStart() { startHeliGame(); }

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
// OPTIMIZED GAME ENGINE FOR 60 FPS SMOOTH PERFORMANCE
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
  basePipeSpeed: 160,
  currentPipeSpeed: 160,
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
      
      // Hitbox for Clean Compact Quit Button (Top Left)
      if (clickX >= 10 && clickX <= 95 && clickY >= 10 && clickY <= 42) {
        closeGameScreen();
        return;
      }
      // Hitbox for Clean Compact Pause Button (Below Quit)
      if (clickX >= 10 && clickX <= 95 && clickY >= 48 && clickY <= 80) {
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
  for (let i = 0; i < 30; i++) {
    heliGame.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.6),
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3
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

  if (heliGame.scoreBlinkTimer > 0) heliGame.scoreBlinkTimer -= dt;

  const currentRainMilestone = Math.floor(heliGame.distanceMeters / 750);
  if (currentRainMilestone > 0 && currentRainMilestone !== heliGame.lastRainMilestone) {
    heliGame.lastRainMilestone = currentRainMilestone;
    heliGame.isRaining = true;
    heliGame.rainTimer = 15.0;
    gameSounds.playRain();
  }

  if (heliGame.isRaining) {
    heliGame.rainTimer -= dt;
    if (heliGame.rainTimer <= 0) heliGame.isRaining = false;
  }

  // Optimized Speed curve: smooth and controlled so it never gets too fast abruptly
  const speedGrowthFactor = 0.035;
  const maxAllowedSpeed = 290;
  let calculatedSpeed = heliGame.basePipeSpeed + (heliGame.distanceMeters * speedGrowthFactor);
  heliGame.currentPipeSpeed = Math.min(maxAllowedSpeed, calculatedSpeed);

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

  const heliBox = { x: heliGame.x + 6, y: heliGame.y + 6, w: heliGame.width - 12, h: heliGame.height - 10 };

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
      if (distToTopEdge <= 18 || distToBottomEdge <= 18) {
        heliGame.bonusScore += 50;
        gameSounds.playBonus();
        heliGame.floatingTexts.push({
          text: "+50",
          x: p.x + heliGame.pipeWidth / 2,
          y: distToTopEdge <= 18 ? p.topHeight + 15 : p.bottomY - 15,
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
    if (ft.alpha <= 0) heliGame.floatingTexts.splice(f, 1);
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth - 10) {
    heliGame.pipes.shift();
  }

  if (heliGame.isRaining) {
    if (heliGame.raindrops.length < 80) {
      heliGame.raindrops.push({
        x: Math.random() * canvas.width,
        y: -10,
        length: Math.random() * 12 + 8,
        speed: Math.random() * 300 + 500
      });
    }
    for (let drop of heliGame.raindrops) {
      drop.y += drop.speed * dt;
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

  // Simple clean background fill to guarantee zero rendering lags
  ctx.fillStyle = score >= 1000 ? "#1e1b4b" : (score >= 500 ? "#fb923c" : (heliGame.isRaining ? "#2c3e50" : "#38bdf8"));
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (score >= 1000 && heliGame.stars) {
    ctx.fillStyle = "#ffffff";
    for (let star of heliGame.stars) {
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }

  if (score < 500) {
    drawMovingClouds(ctx, canvas.width, canvas.height, heliGame.cloudScroll);
  }

  drawBackgroundCity(ctx, canvas.width, canvas.height, heliGame.bgScroll, score >= 500, score >= 1000);

  const playableHeight = canvas.height - heliGame.groundHeight;
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, playableHeight - p.bottomY + 12, false);
  }

  if (heliGame.floatingTexts && heliGame.floatingTexts.length > 0) {
    ctx.font = "900 15px sans-serif";
    ctx.textAlign = "center";
    for (let ft of heliGame.floatingTexts) {
      ctx.fillStyle = `rgba(250, 204, 21, ${ft.alpha})`;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
  }

  drawCartoonThemeGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);
  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame, score >= 1000);

  if (heliGame.isRaining && heliGame.raindrops.length > 0) {
    ctx.strokeStyle = "rgba(174, 219, 238, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let drop of heliGame.raindrops) {
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
    }
    ctx.stroke();
  }

  renderTopHeaderUI(ctx, canvas.width);
}

function drawMovingClouds(ctx, w, h, cloudScroll) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  const loopW = 400;
  const offsetX = (cloudScroll * 0.3) % loopW;
  for (let i = -1; i < 3; i++) {
    let cx = i * loopW - offsetX + 80;
    ctx.fillRect(cx, 50, 80, 24);
    ctx.fillRect(cx + 40, 35, 60, 20);
  }
}

function drawBackgroundCity(ctx, w, h, bgScroll, isSunset, isNight) {
  const baseLineY = h - heliGame.groundHeight + 10;
  const loopW = 260;
  const offsetX = (bgScroll * 0.12) % loopW;
  ctx.fillStyle = isNight ? "#1e293b" : (isSunset ? "#c2410c" : "#3b82f6");
  
  for (let i = -1; i < 3; i++) {
    let bx = i * loopW - offsetX;
    ctx.fillRect(bx, baseLineY - 100, 48, 110);
    ctx.fillRect(bx + 52, baseLineY - 130, 40, 140);
    ctx.fillRect(bx + 96, baseLineY - 80, 54, 90);
  }
}

function drawCartoonThemeGround(ctx, width, height, groundHeight, scrollOffset) {
  const groundY = height - groundHeight;
  ctx.fillStyle = "#5c9e31";
  ctx.fillRect(0, groundY, width, 14);
  ctx.fillStyle = "#d8be70";
  ctx.fillRect(0, groundY + 14, width, groundHeight - 14);
}

function drawCleanPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;
  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#2e520e";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  const capH = 18;
  const overhang = 3;
  const capY = isTop ? y + h - capH : y;
  ctx.fillRect(x - overhang, capY, w + (overhang * 2), capH);
  ctx.strokeRect(x - overhang, capY, w + (overhang * 2), capH);
}

function drawVectorHelicopter(ctx, x, y, angleDeg, frame, isNight) {
  ctx.save();
  ctx.translate(x + 22, y + 14);
  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(-20, -3, 15, 6);

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.ellipse(2, 1, 14, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.arc(6, -1, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2;
  let blurWidth = 20 * Math.abs(Math.sin(frame));
  ctx.beginPath();
  ctx.moveTo(1 - blurWidth, -12);
  ctx.lineTo(1 + blurWidth, -12);
  ctx.stroke();

  ctx.restore();
}

// ==========================================================================
// ULTRA-CLEAN NON-LAGGY COMPACT HUD BUTTONS
// ==========================================================================
function renderTopHeaderUI(ctx, w) {
  ctx.save();

  // --- COMPACT QUIT BUTTON (Top Left) ---
  const exitX = 12, exitY = 12, exitW = 85, exitH = 30;
  ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
  drawRoundedRect(ctx, exitX, exitY, exitW, exitH, 8, true);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✕ QUIT", exitX + exitW / 2, exitY + exitH / 2);

  // --- COMPACT PAUSE BUTTON (Below Quit) ---
  const pauseX = 12, pauseY = 46, pauseW = 85, pauseH = 30;
  ctx.fillStyle = "rgba(59, 130, 246, 0.9)";
  drawRoundedRect(ctx, pauseX, pauseY, pauseW, pauseH, 8, true);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⏸ PAUSE", pauseX + pauseW / 2, pauseY + pauseH / 2);

  // --- COMPACT SCORE BOX (Top Right) ---
  const scoreStr = String(heliGame.distanceMeters).padStart(5, '0');
  const scoreW = 115, scoreH = 30;
  const scoreX = w - scoreW - 12, scoreY = 12;

  ctx.fillStyle = heliGame.scoreBlinkTimer > 0 ? "rgba(245, 158, 11, 0.95)" : "rgba(109, 40, 217, 0.9)";
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 8, true);
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`🚀 ${scoreStr}`, scoreX + scoreW / 2, scoreY + scoreH / 2);

  // --- COMPACT BONUS BOX (Below Score Box) ---
  const bonusStr = `⭐ +${heliGame.bonusScore}`;
  const bonusW = 115, bonusH = 30;
  const bonusX = w - bonusW - 12, bonusY = 46;

  ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
  drawRoundedRect(ctx, bonusX, bonusY, bonusW, bonusH, 8, true);
  ctx.strokeStyle = "#a7f3d0";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 12px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(bonusStr, bonusX + bonusW / 2, bonusY + bonusH / 2);

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

