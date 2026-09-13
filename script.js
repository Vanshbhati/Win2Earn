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

// Master Function for Unlocking Web Audio Context on Mobile Browsers
function unlockMobileAudio() {
  if (window.gameSounds) {
    if (!window.gameSounds.audioCtx) {
      window.gameSounds.init();
    }
    if (window.gameSounds.audioCtx && window.gameSounds.audioCtx.state === 'suspended') {
      window.gameSounds.audioCtx.resume();
    }
  }
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
  if (window.gameSounds) {
    window.gameSounds.stopBgMusic();
    window.gameSounds.stopRainSound();
  }
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.active = false;
  hideModal("gameScreenModal");
}

function handleUniversalStart() {
  startHeliGame();
}

// ==========================================================================
// GAME ENGINE WITH ENVIRONMENT CYCLE, HEADLIGHTS & TIMED RAIN & AUDIO
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
  
  // Rain System
  rainParticles: [],
  rainTimer: 0,
  lastRainMilestone: -1,

  // Environment & Audio Tracker
  lastEnvType: null,
  isRainPlaying: false
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
  // Note: Tap sound removed as requested
}

function initRainParticles(w, h) {
  heliGame.rainParticles = [];
  for (let i = 0; i < 60; i++) {
    heliGame.rainParticles.push({
      x: Math.random() * (w + 100) - 50,
      y: Math.random() * h,
      length: Math.random() * 14 + 10,
      speedY: Math.random() * 300 + 400,
      speedX: -80
    });
  }
}

function resetHeliGameUI() {
  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  
  const canvas = heliGame.canvas;
  if (!canvas) return;
  
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  initRainParticles(canvas.width, canvas.height);

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bgScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = -1;
  heliGame.lastEnvType = null;
  heliGame.isRainPlaying = false;
  
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

  initRainParticles(canvas.width, canvas.height);

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bgScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = -1;
  heliGame.lastEnvType = null;
  heliGame.isRainPlaying = false;
  heliGame.active = true;
  heliGame.lastTime = performance.now();

  // Set Morning Audio Environment at start
  if (window.gameSounds) {
    window.gameSounds.setEnvironment('morning');
    heliGame.lastEnvType = 'morning';
  }

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

  // Dynamic Environment Sound Cycle (Morning -> Sunset -> Night)
  const scorePhase = Math.floor(heliGame.distanceMeters / 500) % 3;
  let currentEnv = 'morning';
  if (scorePhase === 1) currentEnv = 'sunset';
  else if (scorePhase === 2) currentEnv = 'night';

  if (currentEnv !== heliGame.lastEnvType) {
    heliGame.lastEnvType = currentEnv;
    if (window.gameSounds) {
      window.gameSounds.setEnvironment(currentEnv);
    }
  }

  // Progressive Speed Scaling
  const speedTier = Math.floor(heliGame.distanceMeters / 500);
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed + (speedTier * 14);

  // Timed Rain Management & Rain Audio
  const currentRainMilestone = Math.floor(heliGame.distanceMeters / 750);
  if (currentRainMilestone > 0 && currentRainMilestone !== heliGame.lastRainMilestone) {
    heliGame.lastRainMilestone = currentRainMilestone;
    heliGame.rainTimer = 18;
  }

  if (heliGame.rainTimer > 0) {
    heliGame.rainTimer = Math.max(0, heliGame.rainTimer - dt);
    if (!heliGame.isRainPlaying) {
      heliGame.isRainPlaying = true;
      if (window.gameSounds) window.gameSounds.startRainSound();
    }
  } else {
    if (heliGame.isRainPlaying) {
      heliGame.isRainPlaying = false;
      if (window.gameSounds) window.gameSounds.stopRainSound();
    }
  }

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

    // Check Pipe Cross Sound
    if (!p.passed && p.x + heliGame.pipeWidth < heliGame.x) {
      p.passed = true;
      if (window.gameSounds) window.gameSounds.playScore();
    }

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

  // Rain Particles Update
  if (heliGame.rainTimer > 0) {
    for (let p of heliGame.rainParticles) {
      p.y += p.speedY * dt;
      p.x += p.speedX * dt;
      if (p.y > canvas.height) {
        p.y = -15;
        p.x = Math.random() * (canvas.width + 100) - 50;
      }
    }
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

  const scorePhase = Math.floor(heliGame.distanceMeters / 500) % 3;
  let skyTop, skyBottom, isNight = false;

  if (scorePhase === 0) { // Day
    skyTop = "#4ec0ca";
    skyBottom = "#b3f0db";
  } else if (scorePhase === 1) { // Sunset
    skyTop = "#fd5e53";
    skyBottom = "#ffbe76";
  } else { // Night
    skyTop = "#0f2027";
    skyBottom = "#2c5364";
    isNight = true;
  }

  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, skyTop);
  skyGrad.addColorStop(1, skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background Cityscape
  drawBackgroundCity(ctx, canvas.width, canvas.height, heliGame.bgScroll, isNight);

  // Pipes
  const playableHeight = canvas.height - heliGame.groundHeight;
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = playableHeight - p.bottomY + 12;
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  // Cartoon Style Platform Base
  drawCartoonThemeGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);

  // Helicopter
  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame, isNight);

  // Timed Rain Overlay
  if (heliGame.rainTimer > 0) {
    drawRainOverlay(ctx);
  }

  // Header UI
  renderTopHeaderUI(ctx, canvas.width);
}

function drawBackgroundCity(ctx, w, h, bgScroll, isNight) {
  const baseLineY = h - heliGame.groundHeight + 10;
  const buildings = [
    { x: 0, w: 48, h: 95, color: isNight ? "#1c2541" : "rgba(255, 178, 115, 0.70)" },
    { x: 52, w: 40, h: 125, color: isNight ? "#0b132b" : "rgba(186, 148, 235, 0.70)" },
    { x: 96, w: 54, h: 80, color: isNight ? "#1c2541" : "rgba(125, 175, 240, 0.70)" },
    { x: 154, w: 44, h: 140, color: isNight ? "#0b132b" : "rgba(255, 138, 148, 0.70)" },
    { x: 202, w: 50, h: 105, color: isNight ? "#1c2541" : "rgba(110, 225, 165, 0.70)" }
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

      // Window Lights
      ctx.fillStyle = isNight ? "#f9d71c" : "rgba(255, 255, 255, 0.75)";
      for (let wY = 12; wY < b.h - 8; wY += 18) {
        ctx.fillRect(bx + 6, by + wY, 6, 8);
        if (b.w > 36) ctx.fillRect(bx + b.w - 12, by + wY, 6, 8);
      }
    });
  }
  ctx.restore();
}

function drawRainOverlay(ctx) {
  ctx.save();
  ctx.strokeStyle = "rgba(180, 225, 255, 0.65)";
  ctx.lineWidth = 1.8;

  for (let p of heliGame.rainParticles) {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.speedX * 0.04, p.y + p.length);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCartoonThemeGround(ctx, width, height, groundHeight, scrollOffset) {
  const groundY = height - groundHeight;

  ctx.save();

  // Grass Layer
  ctx.fillStyle = "#5c9e31";
  ctx.fillRect(0, groundY, width, 14);

  // Grass Top Highlight
  ctx.fillStyle = "#80d038";
  ctx.fillRect(0, groundY, width, 4);

  // Brick Base Body
  ctx.fillStyle = "#d8be70";
  ctx.fillRect(0, groundY + 14, width, groundHeight - 14);

  // Scrolling Pattern Lines
  ctx.fillStyle = "#be9d48";
  const tileSize = 20;
  const startX = -(scrollOffset % tileSize);

  for (let x = startX; x < width + tileSize; x += tileSize) {
    ctx.fillRect(x, groundY + 14, 2, groundHeight - 14);
    ctx.fillRect(x, groundY + 28, tileSize, 2);
    ctx.fillRect(x, groundY + 44, tileSize, 2);
  }

  // Top/Bottom Dark Edges
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
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Night Mode Headlight
  if (isNight) {
    const beamGrad = ctx.createLinearGradient(12, 0, 180, 0);
    beamGrad.addColorStop(0, "rgba(255, 240, 150, 0.8)");
    beamGrad.addColorStop(1, "rgba(255, 240, 150, 0.0)");

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.lineTo(190, -45);
    ctx.lineTo(190, 55);
    ctx.closePath();
    ctx.fill();
  }

  // Tail Boom
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(-20, -3, 15, 6);
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -3, 15, 6);

  // Tail Fin
  ctx.fillStyle = "#f39c12";
  ctx.beginPath();
  ctx.moveTo(-18, -3);
  ctx.lineTo(-24, -10);
  ctx.lineTo(-14, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tail Rotor
  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2.5;
  const tailRotorSpin = Math.sin(frame * 2.5) * 7;
  ctx.beginPath();
  ctx.moveTo(-23, -6 - tailRotorSpin);
  ctx.lineTo(-23, -6 + tailRotorSpin);
  ctx.stroke();

  // Cabin Body
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.ellipse(2, 1, 14, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Windshield
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

  // Rotor Mount & Blade
  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(-1, -13, 4, 4);

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 3;
  const blurWidth = 24 * Math.abs(Math.sin(frame));
  ctx.beginPath();
  ctx.moveTo(1 - blurWidth, -13);
  ctx.lineTo(1 + blurWidth, -13);
  ctx.stroke();

  // Landing Skids
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
  if (window.gameSounds) {
    window.gameSounds.stopBgMusic();
    window.gameSounds.stopRainSound();
    window.gameSounds.playCrash();
  }

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

