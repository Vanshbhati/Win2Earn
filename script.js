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
// PURE SYNTHESIZED SOUND SYSTEM (CHOPPER LOOP, CRASH & RAIN ONLY)
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

  // Continuous looping helicopter blade sound from start to crash (with LFO chop effect)
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

  // 15-second rain sound effect
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
      rainFilter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      rainFilter.Q.setValueAtTime(1.0, this.audioCtx.currentTime);

      this.rainGain = this.audioCtx.createGain();
      this.rainGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.25, this.audioCtx.currentTime + 1.5);
      this.rainGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime + 13.5);
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

  // Heavy crash sound effect
  playCrash() {
    this.init();
    if (!this.audioCtx) return;
    this.stopChopper();
    this.stopRain();

    try {
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
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Crash audio error:", e);
    }
  }
};

// Master Function for Unlocking Web Audio Context on Mobile Browsers
function unlockMobileAudio() {
  gameSounds.init();
}

// Global Touch/Click Unlocker for Mobile Audio
document.addEventListener("touchstart", unlockMobileAudio, { passive: true });
document.addEventListener("click", unlockMobileAudio, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initTicker();
  renderLeaderboard('daily');
  renderAlerts();
  initHeliGameListeners();
  setupMonthlyButtons();
});

function setupMonthlyButtons() {
  const monthlyCards = document.querySelectorAll('.monthly-premium-card .game-play-btn');
  monthlyCards.forEach(btn => {
    btn.setAttribute('onclick', 'handleGameLaunch()');
  });
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
  resetHeliGameUI();
}

function closeGameScreen() {
  unlockMobileAudio();
  gameSounds.stopChopper();
  gameSounds.stopRain();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.active = false;
  hideModal("gameScreenModal");
}

function handleUniversalStart() {
  startHeliGame();
}

// ==========================================================================
// GAME ENGINE WITH RAIN & CHOPPER LOGIC
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
  pipeGap: 160,
  basePipeSpeed: 160,
  currentPipeSpeed: 160,
  pipeSpacing: 215,
  groundHeight: 60,
  groundOffset: 0,

  rawScoreAcc: 0,
  distanceMeters: 0,
  bestScore: 0,
  bgScroll: 0,

  // Rain Tracking State
  isRaining: false,
  rainTimer: 0,
  lastRainMilestone: 0,
  raindrops: []
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d", { alpha: false });

  const handlePointer = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    unlockMobileAudio();
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      if (clickX >= 10 && clickX <= 90 && clickY >= 10 && clickY <= 48) {
        closeGameScreen();
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
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  
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
  heliGame.bgScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.isRaining = false;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = 0;
  heliGame.raindrops = [];
  
  renderCanvas();
}

function startHeliGame() {
  unlockMobileAudio();

  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

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
  heliGame.bgScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.isRaining = false;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = 0;
  heliGame.raindrops = [];
  heliGame.active = true;
  heliGame.lastTime = performance.now();

  // Start continuous looping helicopter sound instantly
  gameSounds.startChopper();

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGameLoop(performance.now());
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

  // Rain milestone trigger (Every 750 score points for 15 seconds with rain audio)
  const currentRainMilestone = Math.floor(heliGame.distanceMeters / 750);
  if (currentRainMilestone > 0 && currentRainMilestone !== heliGame.lastRainMilestone) {
    heliGame.lastRainMilestone = currentRainMilestone;
    heliGame.isRaining = true;
    heliGame.rainTimer = 15.0; // 15 seconds duration
    gameSounds.playRain();
  }

  if (heliGame.isRaining) {
    heliGame.rainTimer -= dt;
    if (heliGame.rainTimer <= 0) {
      heliGame.isRaining = false;
    }
  }

  // Progressive Speed Scaling
  const speedTier = Math.floor(heliGame.distanceMeters / 500);
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed + (speedTier * 14);

  heliGame.velocity += heliGame.gravity * dt;
  heliGame.y += heliGame.velocity * dt;
  heliGame.angle = Math.min(25, Math.max(-20, heliGame.velocity * 0.06));
  heliGame.rotorFrame += dt * 35;
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.currentPipeSpeed * dt)) % 30;
  heliGame.bgScroll += (heliGame.currentPipeSpeed * dt);

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
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth - 10) {
    heliGame.pipes.shift();
  }

  // Update raindrops if raining
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
  const minH = 40;
  const maxH = playableHeight - heliGame.pipeGap - minH;
  const topHeight = Math.floor(Math.random() * (maxH - minH + 1)) + minH;

  heliGame.pipes.push({
    x: startX,
    topHeight: topHeight,
    bottomY: topHeight + heliGame.pipeGap,
    passed: false
  });
}

function checkAABBCollision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function renderCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  let skyTop = heliGame.isRaining ? "#2c3e50" : "#4ec0ca";
  let skyBottom = heliGame.isRaining ? "#34495e" : "#b3f0db";

  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, skyTop);
  skyGrad.addColorStop(1, skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBackgroundCity(ctx, canvas.width, canvas.height, heliGame.bgScroll, heliGame.isRaining);

  const playableHeight = canvas.height - heliGame.groundHeight;
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = playableHeight - p.bottomY + 12;
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  drawCartoonThemeGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);

  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame);

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

function drawBackgroundCity(ctx, w, h, bgScroll, isRaining) {
  const baseLineY = h - heliGame.groundHeight + 10;
  const buildings = [
    { x: 0, w: 48, h: 95, color: isRaining ? "#1a252f" : "rgba(255, 178, 115, 0.70)" },
    { x: 52, w: 40, h: 125, color: isRaining ? "#11181f" : "rgba(186, 148, 235, 0.70)" },
    { x: 96, w: 54, h: 80, color: isRaining ? "#1a252f" : "rgba(125, 175, 240, 0.70)" },
    { x: 154, w: 44, h: 140, color: isRaining ? "#11181f" : "rgba(255, 138, 148, 0.70)" },
    { x: 202, w: 50, h: 105, color: isRaining ? "#1a252f" : "rgba(110, 225, 165, 0.70)" }
  ];

  const loopW = 260;
  const offsetX = (bgScroll * 0.12) % loopW;

  ctx.save();
  for (let i = -1; i < Math.ceil(w / loopW) + 1; i++) {
    const baseX = i * loopW - offsetX;
    buildings.forEach(b => {
      const bx = baseX + b.x;
      const by = baseLineY - b.h;

      ctx.fillStyle = b.color;
      ctx.fillRect(bx, by, b.w, b.h + 20);

      ctx.fillStyle = isRaining ? "#f1c40f" : "rgba(255, 255, 255, 0.75)";
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

function drawVectorHelicopter(ctx, x, y, angleDeg, frame) {
  ctx.save();
  ctx.translate(x + 22, y + 14);
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

  const exitX = 12, exitY = 12, exitW = 75, exitH = 32;
  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, exitX, exitY, exitW, exitH, 8, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000000";
  ctx.font = "900 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EXIT", exitX + exitW / 2, exitY + exitH / 2 + 1);

  const scoreStr = String(heliGame.distanceMeters).padStart(5, '0');
  const scoreW = 95, scoreH = 32;
  const scoreX = w - scoreW - 12, scoreY = 12;

  ctx.fillStyle = "#3b82f6";
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 8, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 15px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(scoreStr, scoreX + scoreW / 2, scoreY + scoreH / 2 + 1);

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

  appState.currentRunScore = heliGame.distanceMeters;
  appState.dailyScore += heliGame.distanceMeters;

  if (heliGame.distanceMeters > heliGame.bestScore) {
    heliGame.bestScore = heliGame.distanceMeters;
  }

  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  
  if (runScoreEl) runScoreEl.innerText = `${heliGame.distanceMeters}`;
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

