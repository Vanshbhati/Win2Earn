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
// ULTRA HIGH-PERFORMANCE 60FPS HELICOPTER ENGINE
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // Sleek Helicopter Sizing
  x: 55,
  y: 200,
  width: 44,
  height: 24,
  
  // Responsive Flight Physics
  gravity: 0.38,
  velocity: 0,
  jumpVelocity: -6.4,
  angle: 0,
  
  // Slim Pipes
  pipes: [],
  pipeWidth: 44,      // Patle pipes
  pipeGap: 155,
  pipeSpeed: 2.3,
  pipeSpacing: 200,
  groundHeight: 65,
  groundOffset: 0,

  distanceMeters: 0,
  bestScore: 0
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  const handlePointer = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      // Exit Pill Hitbox Check
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

  const dt = Math.min((timestamp - heliGame.lastTime) / 16.66, 1.8);
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
  heliGame.angle = Math.min(20, Math.max(-16, heliGame.velocity * 3.0));
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.pipeSpeed * dt)) % 16;

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  const heliBox = { 
    x: heliGame.x + 3, 
    y: heliGame.y + 3, 
    w: heliGame.width - 6, 
    h: heliGame.height - 6 
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
  const minH = 50;
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

  // Optimized Background Rendering
  ctx.fillStyle = "#4EC0CA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const groundY = canvas.height - heliGame.groundHeight;

  // City Skyline
  ctx.fillStyle = "#A2D2FF";
  for (let bx = 0; bx < canvas.width + 40; bx += 40) {
    ctx.fillRect(bx, groundY - 95, 34, 60);
    ctx.fillRect(bx + 12, groundY - 110, 10, 15);
  }

  // Bushes
  ctx.fillStyle = "#52BE80";
  ctx.fillRect(0, groundY - 35, canvas.width, 35);

  // Slim Pipes
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawSlimPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = (canvas.height - heliGame.groundHeight) - p.bottomY;
    drawSlimPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  // Striped Ground
  ctx.fillStyle = "#DED895";
  ctx.fillRect(0, groundY, canvas.width, heliGame.groundHeight);
  ctx.fillStyle = "#C8B26B";
  for (let gx = -heliGame.groundOffset; gx < canvas.width + 20; gx += 16) {
    ctx.beginPath();
    ctx.moveTo(gx, groundY + 12);
    ctx.lineTo(gx - 6, groundY + heliGame.groundHeight);
    ctx.lineTo(gx - 2, groundY + heliGame.groundHeight);
    ctx.lineTo(gx + 4, groundY + 12);
    ctx.fill();
  }
  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(0, groundY, canvas.width, 12);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();

  // Draw Detailed Helicopter
  drawDetailedHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle);

  // Render Clean Header Pills
  renderTopHeaderUI(ctx, canvas.width);
}

// SLIM PIPE DRAWING ENGINE
function drawSlimPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;

  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "#9CE659";
  ctx.fillRect(x + 3, y, 4, h);

  ctx.fillStyle = "#55A021";
  ctx.fillRect(x + w - 6, y, 6, h);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  const capH = 18;
  const overhang = 3;
  const capX = x - overhang;
  const capW = w + (overhang * 2);
  const capY = isTop ? y + h - capH : y;

  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(capX, capY, capW, capH);
  ctx.fillStyle = "#9CE659";
  ctx.fillRect(capX + 3, capY, 4, capH);
  ctx.fillStyle = "#55A021";
  ctx.fillRect(capX + capW - 6, capY, 6, capH);
  ctx.strokeRect(capX, capY, capW, capH);
}

// HIGH QUALITY 2D HELICOPTER GRAPHICS
function drawDetailedHelicopter(ctx, x, y, angleDeg) {
  ctx.save();
  ctx.translate(x + 22, y + 12);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Tail Boom & Fin
  ctx.fillStyle = "#E74C3C";
  ctx.fillRect(-20, -2, 12, 4);
  ctx.strokeRect(-20, -2, 12, 4);
  
  ctx.beginPath();
  ctx.moveTo(-20, -2);
  ctx.lineTo(-24, -8);
  ctx.lineTo(-18, -2);
  ctx.fill();
  ctx.stroke();

  // Main Body
  ctx.fillStyle = "#F1C40F";
  ctx.beginPath();
  ctx.ellipse(0, 1, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glass Cockpit
  ctx.fillStyle = "#3498DB";
  ctx.beginPath();
  ctx.arc(5, -1, 6, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.stroke();

  // Top Rotor Mast & Blade
  ctx.fillStyle = "#000000";
  ctx.fillRect(-1, -11, 3, 3);
  ctx.fillRect(-16, -12, 32, 2);

  // Landing Skids
  ctx.strokeStyle = "#34495E";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, 11);
  ctx.lineTo(10, 11);
  ctx.moveTo(-3, 8);
  ctx.lineTo(-3, 11);
  ctx.moveTo(5, 8);
  ctx.lineTo(5, 11);
  ctx.stroke();

  ctx.restore();
}

// HEADER UI (ONLY EXIT & SCORE)
function renderTopHeaderUI(ctx, w) {
  ctx.save();

  // EXIT Button
  const exitX = 12;
  const exitY = 12;
  const exitW = 75;
  const exitH = 32;

  ctx.fillStyle = "#FFFFFF";
  drawRoundedRect(ctx, exitX, exitY, exitW, exitH, 8, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000000";
  ctx.font = "900 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EXIT", exitX + exitW / 2, exitY + exitH / 2 + 1);

  // SCORE Display
  const scoreStr = String(heliGame.distanceMeters).padStart(4, '0');
  const scoreW = 85;
  const scoreH = 32;
  const scoreX = w - scoreW - 12;
  const scoreY = 12;

  ctx.fillStyle = "#3B82F6";
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 8, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
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

