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
  if (e) e.preventDefault();
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) selectedTab.classList.remove("hidden");
  appState.activeTab = tabName;

  if (tabName === 'wallet') renderProfileWallet();
}

function showModal(modalId) { document.getElementById(modalId)?.classList.remove("hidden"); }
function hideModal(modalId) { document.getElementById(modalId)?.classList.add("hidden"); }

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
  const email = document.getElementById("loginEmail")?.value || "user@example.com";
  appState.currentUser = { name: email.split("@")[0].toUpperCase(), email, upi: null };
  closeAuthModal();
  onUserLoggedIn();
}

function handleSignup(e) {
  e.preventDefault();
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
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }
  showModal("gameScreenModal");
  resetHeliGameUI();
}

function closeGameScreen() {
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.active = false;
  hideModal("gameScreenModal");
}

function handleUniversalStart() {
  startHeliGame();
}

// ==========================================================================
// ULTRA-SMOOTH HIGH-PERFORMANCE ENGINE WITH DELTA TIMING
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // Helicopter Dimensions
  x: 50,
  y: 200,
  width: 46,
  height: 28,
  
  // Physics Parameters
  gravity: 1200,      // Pixels/sec^2
  velocity: 0,
  jumpVelocity: -380, // Impulse velocity
  angle: 0,
  rotorFrame: 0,
  
  // Pipes Parameters
  pipes: [],
  pipeWidth: 50,
  pipeGap: 160,
  pipeSpeed: 160,     // Pixels/sec
  pipeSpacing: 210,
  groundHeight: 65,
  groundOffset: 0,

  distanceMeters: 0,
  bestScore: 0,

  // Hardware Caching
  bgCanvas: null,
  bgCtx: null
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d", { alpha: false });

  const handlePointer = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      // Exit button zone (top left)
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
  heliGame.velocity = heliGame.jumpVelocity;
}

function prepareCachedBackground(w, h) {
  heliGame.bgCanvas = document.createElement("canvas");
  heliGame.bgCanvas.width = w;
  heliGame.bgCanvas.height = h;
  heliGame.bgCtx = heliGame.bgCanvas.getContext("2d");

  const ctx = heliGame.bgCtx;
  const groundY = h - heliGame.groundHeight;

  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, "#4a90e2");
  skyGrad.addColorStop(1, "#50e3c2");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Background Distant Mountains
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.beginPath();
  for (let mx = 0; mx < w + 100; mx += 80) {
    ctx.lineTo(mx, groundY - 60 - (mx % 3 === 0 ? 30 : 10));
    ctx.lineTo(mx + 40, groundY);
  }
  ctx.fill();

  // Distant City Skyline
  ctx.fillStyle = "rgba(44, 62, 80, 0.15)";
  for (let bx = 0; bx < w + 50; bx += 32) {
    const bHeight = 40 + (bx % 5) * 12;
    ctx.fillRect(bx, groundY - bHeight, 26, bHeight);
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

  prepareCachedBackground(canvas.width, canvas.height);

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.distanceMeters = 0;
  
  renderCanvas();
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  prepareCachedBackground(canvas.width, canvas.height);

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.distanceMeters = 0;
  heliGame.active = true;
  heliGame.lastTime = performance.now();

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

  heliGame.velocity += heliGame.gravity * dt;
  heliGame.y += heliGame.velocity * dt;
  heliGame.angle = Math.min(25, Math.max(-20, heliGame.velocity * 0.06));
  heliGame.rotorFrame += dt * 30;
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.pipeSpeed * dt)) % 140;

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
    p.x -= heliGame.pipeSpeed * dt;

    const topPipeBox = { x: p.x, y: 0, w: heliGame.pipeWidth, h: p.topHeight };
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY };

    if (checkAABBCollision(heliBox, topPipeBox) || checkAABBCollision(heliBox, bottomPipeBox)) {
      handleCrash();
      return;
    }

    if (!p.passed && p.x + heliGame.pipeWidth < heliGame.x) {
      p.passed = true;
      heliGame.distanceMeters += 1;
    }
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth) {
    heliGame.pipes.shift();
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

  // 1. Draw Cached Background
  if (heliGame.bgCanvas) {
    ctx.drawImage(heliGame.bgCanvas, 0, 0);
  }

  // 2. Draw Pipes
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = (canvas.height - heliGame.groundHeight) - p.bottomY;
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  // 3. Draw HD Wooden Ground & Bushes (Reference Match)
  drawHDWoodenGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);

  // 4. Draw Helicopter
  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame);

  // 5. Draw Top UI (Exit & Score)
  renderTopHeaderUI(ctx, canvas.width);
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

// ==========================================================================
// HD WOODEN GROUND WITH BUSHES (REFERENCE DESIGN MATCH)
// ==========================================================================
function drawHDWoodenGround(ctx, width, height, groundHeight, scrollOffset) {
  const groundY = height - groundHeight;
  const bushHeight = 22;
  const woodY = groundY + bushHeight;
  const woodHeight = groundHeight - bushHeight;

  // --- A. GREEN BUSHES / HEDGES (TOP LAYER) ---
  ctx.save();
  
  ctx.fillStyle = "#2d6a4f";
  ctx.beginPath();
  for (let x = -20; x < width + 40; x += 18) {
    ctx.arc(x, woodY - 2, 12, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.fillStyle = "#52b788";
  ctx.beginPath();
  for (let x = -10; x < width + 30; x += 22) {
    ctx.arc(x, woodY + 2, 14, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.fillStyle = "#74c69d";
  ctx.beginPath();
  for (let x = -5; x < width + 30; x += 22) {
    ctx.arc(x - 3, woodY - 3, 7, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.restore();

  // --- B. HD WOODEN BOARDWALK / PLANKS ---
  ctx.save();

  const woodGrad = ctx.createLinearGradient(0, woodY, 0, height);
  woodGrad.addColorStop(0, "#e9c46a");
  woodGrad.addColorStop(0.3, "#d4a373");
  woodGrad.addColorStop(1, "#bc6c25");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, woodY, width, woodHeight);

  ctx.fillStyle = "#f4a261";
  ctx.fillRect(0, woodY, width, 3);

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, height - 4, width, 4);

  ctx.strokeStyle = "rgba(111, 62, 17, 0.25)";
  ctx.lineWidth = 1.5;
  
  ctx.beginPath();
  ctx.moveTo(0, woodY + 12);
  ctx.lineTo(width, woodY + 12);
  ctx.moveTo(0, woodY + 24);
  ctx.lineTo(width, woodY + 24);
  ctx.stroke();

  const plankWidth = 140;
  const startX = -(scrollOffset % plankWidth);

  ctx.strokeStyle = "rgba(74, 38, 7, 0.5)";
  ctx.lineWidth = 2.5;

  for (let px = startX; px < width + plankWidth; px += plankWidth) {
    ctx.beginPath();
    ctx.moveTo(px, woodY);
    ctx.lineTo(px, height);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + 1.5, woodY);
    ctx.lineTo(px + 1.5, height);
    ctx.stroke();

    ctx.strokeStyle = "rgba(74, 38, 7, 0.5)";
    ctx.lineWidth = 2.5;
  }

  ctx.restore();
}

// MODERN 2D VECTOR HELICOPTER GRAPHICS
function drawVectorHelicopter(ctx, x, y, angleDeg, frame) {
  ctx.save();
  ctx.translate(x + 23, y + 14);
  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(-22, -3, 16, 6);
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.strokeRect(-22, -3, 16, 6);

  ctx.fillStyle = "#f39c12";
  ctx.beginPath();
  ctx.moveTo(-22, -3);
  ctx.lineTo(-27, -10);
  ctx.lineTo(-20, -3);
  ctx.fill();
  
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const tailRotorOffset = Math.sin(frame * 2) * 6;
  ctx.moveTo(-25, -7 - tailRotorOffset);
  ctx.lineTo(-25, -7 + tailRotorOffset);
  ctx.stroke();

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.ellipse(3, 1, 15, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.arc(8, -1, 7, -Math.PI / 2, Math.PI / 3);
  ctx.lineTo(8, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(9, -4, 4, 3);

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
  ctx.moveTo(-5, 11);
  ctx.lineTo(-5, 15);
  ctx.moveTo(7, 11);
  ctx.lineTo(7, 15);
  ctx.moveTo(-12, 15);
  ctx.lineTo(15, 15);
  ctx.stroke();

  ctx.restore();
}

// CANVAS UI: EXIT & SCORE HUD
function renderTopHeaderUI(ctx, w) {
  ctx.save();

  const exitX = 12;
  const exitY = 12;
  const exitW = 75;
  const exitH = 32;

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

  const scoreStr = String(heliGame.distanceMeters).padStart(4, '0');
  const scoreW = 85;
  const scoreH = 32;
  const scoreX = w - scoreW - 12;
  const scoreY = 12;

  ctx.fillStyle = "#3b82f6";
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 8, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 14px monospace";
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
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
}

function handleCrash() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

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
