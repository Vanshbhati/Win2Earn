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
  { name: "Amit Patel", amount: "₹5000" },
  { name: "Sneha Gupta", amount: "₹5000" },
  { name: "Vikram Singh", amount: "₹5000" }
];

let lbDailyData = [
  { rank: 1, name: "Aarav Sharma", score: 9850 },
  { rank: 2, name: "Rohan Verma", score: 9420 },
  { rank: 3, name: "Priya Patel", score: 9100 }
];

const lbWeeklyData = [
  { rank: 1, name: "Vikram Joshi", score: 48200 },
  { rank: 2, name: "Aarav Sharma", score: 46100 }
];

const alertsData = [
  { title: "🔥 Daily Tournament Active", desc: "Top 10 daily players get rewards!", time: "2 mins ago" }
];

// On Document Ready
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
// LAG-FREE ULTRA-SMOOTH GAME ENGINE (MATCHES IMAGE VISUALS EXACTLY)
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // Compact Helicopter (48px wide x 30px high)
  x: 60,
  y: 200,
  width: 48,
  height: 30,
  
  // Super Responsive & Crisp Arcade Physics
  gravity: 0.42,
  velocity: 0,
  jumpVelocity: -7.0,
  angle: 0,
  
  // Retro Pipe Specs (Matching Reference Image)
  pipes: [],
  pipeWidth: 54,
  pipeGap: 160,
  pipeSpeed: 2.4,
  pipeSpacing: 210,
  groundHeight: 70,
  groundOffset: 0,

  distanceMeters: 0,
  bestScore: 0
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  const handlePointerStart = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    
    // Check click on EXIT pill (Top-Left corner)
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      if (clickX >= 12 && clickX <= 95 && clickY >= 12 && clickY <= 50) {
        closeGameScreen();
        return;
      }
    }
    triggerHeliJump();
  };

  canvas.addEventListener("touchstart", handlePointerStart, { passive: false });
  canvas.addEventListener("mousedown", handlePointerStart);

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
  
  renderCanvasStatic();
}

function renderCanvasStatic() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  renderBackground(ctx, canvas.width, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  drawCompactHelicopter(ctx, heliGame.x, heliGame.y, 0);
  renderTopHeaderUI(ctx, canvas.width);
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

// 60FPS Optimized Fixed-Delta Time Loop
function heliGameLoop(timestamp) {
  if (!heliGame.active) return;

  const dt = Math.min((timestamp - heliGame.lastTime) / 16.66, 2);
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

  // Subtle tilt for smooth flight feel
  heliGame.angle = Math.min(22, Math.max(-15, heliGame.velocity * 3.2));
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.pipeSpeed * dt)) % 18;

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  const heliBox = { 
    x: heliGame.x + 4, 
    y: heliGame.y + 4, 
    w: heliGame.width - 8, 
    h: heliGame.height - 8 
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
  const minH = 55;
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

  renderBackground(ctx, canvas.width, canvas.height);
  renderPipes(ctx, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  
  if (heliGame.active) {
    drawCompactHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle);
  }

  renderTopHeaderUI(ctx, canvas.width);
}

// 1. EXACT SKY & CITY BACKGROUND FROM REFERENCE IMAGE
function renderBackground(ctx, w, h) {
  // Cyan Sky Background
  ctx.fillStyle = "#4EC0CA";
  ctx.fillRect(0, 0, w, h);

  const groundY = h - heliGame.groundHeight;

  // Soft Pixel Cloud Line
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  for (let cx = 0; cx < w + 50; cx += 60) {
    ctx.arc(cx, groundY - 110, 28, 0, Math.PI * 2);
    ctx.arc(cx + 25, groundY - 120, 35, 0, Math.PI * 2);
  }
  ctx.fill();

  // Pixel City Skyline (#BDE0FE)
  ctx.fillStyle = "#A2D2FF";
  const bHeights = [70, 50, 90, 60, 80, 45, 75];
  let curX = 0;
  let idx = 0;

  while (curX < w + 40) {
    const bh = bHeights[idx % bHeights.length];
    const bw = 38;
    ctx.fillRect(curX, groundY - bh - 35, bw, bh);
    
    // City Window Outlines
    ctx.fillStyle = "#CBE6FF";
    for (let wx = curX + 5; wx < curX + bw - 6; wx += 9) {
      for (let wy = groundY - bh - 25; wy < groundY - 42; wy += 14) {
        ctx.fillRect(wx, wy, 4, 7);
      }
    }
    ctx.fillStyle = "#A2D2FF";

    curX += bw + 6;
    idx++;
  }

  // Green Bush Layer Above Ground
  ctx.fillStyle = "#52BE80";
  ctx.fillRect(0, groundY - 35, w, 35);
  ctx.fillStyle = "#48C9B0";
  ctx.fillRect(0, groundY - 35, w, 4);
}

// 2. EXACT GREEN PIPES FROM REFERENCE IMAGE
function renderPipes(ctx, canvasHeight) {
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawClassicPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = (canvasHeight - heliGame.groundHeight) - p.bottomY;
    drawClassicPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }
}

function drawClassicPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;

  ctx.save();

  // Main Green Fill
  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(x, y, w, h);

  // Left Glossy Highlight Line
  ctx.fillStyle = "#9CE659";
  ctx.fillRect(x + 4, y, 6, h);

  // Right Shadow Strip
  ctx.fillStyle = "#55A021";
  ctx.fillRect(x + w - 8, y, 8, h);

  // Solid Black Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  // Top/Bottom Rim Cap
  const capH = 22;
  const overhang = 4;
  const capX = x - overhang;
  const capW = w + (overhang * 2);
  const capY = isTop ? y + h - capH : y;

  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(capX, capY, capW, capH);
  ctx.fillStyle = "#9CE659";
  ctx.fillRect(capX + 4, capY, 6, capH);
  ctx.fillStyle = "#55A021";
  ctx.fillRect(capX + capW - 8, capY, 8, capH);
  ctx.strokeRect(capX, capY, capW, capH);

  ctx.restore();
}

// 3. EXACT FLAPPY GROUND (Dirt + Green Grass Trim)
function renderGround(ctx, w, h) {
  const groundY = h - heliGame.groundHeight;

  ctx.save();
  // Dirt Base
  ctx.fillStyle = "#DED895";
  ctx.fillRect(0, groundY, w, heliGame.groundHeight);

  // Striped Dirt Pattern
  ctx.fillStyle = "#C8B26B";
  for (let gx = -heliGame.groundOffset; gx < w + 30; gx += 18) {
    ctx.beginPath();
    ctx.moveTo(gx, groundY + 16);
    ctx.lineTo(gx - 8, groundY + heliGame.groundHeight);
    ctx.lineTo(gx - 3, groundY + heliGame.groundHeight);
    ctx.lineTo(gx + 5, groundY + 16);
    ctx.fill();
  }

  // Top Green Grass Trim
  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(0, groundY, w, 14);
  ctx.fillStyle = "#55A021";
  ctx.fillRect(0, groundY + 11, w, 4);

  // Black Top Line
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  ctx.restore();
}

// 4. CHOTA REFINED HELICOPTER (48px)
function drawCompactHelicopter(ctx, x, y, angleDeg) {
  ctx.save();
  ctx.translate(x + 24, y + 15);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Main Yellow Body
  ctx.fillStyle = "#FFC93C";
  ctx.beginPath();
  ctx.ellipse(0, 1, 15, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glass Window
  ctx.fillStyle = "#6EC6FF";
  ctx.beginPath();
  ctx.arc(6, -1, 6, -Math.PI / 2, Math.PI / 2);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.fillStyle = "#E67E22";
  ctx.fillRect(-18, -2, 8, 4);
  ctx.strokeRect(-18, -2, 8, 4);

  // Simple Clean Rotor Line
  ctx.fillStyle = "#000000";
  ctx.fillRect(-2, -12, 4, 3);
  ctx.fillRect(-16, -13, 32, 2);

  // Landing Skid
  ctx.strokeStyle = "#2C3E50";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, 13);
  ctx.lineTo(10, 13);
  ctx.moveTo(-3, 10);
  ctx.lineTo(-3, 13);
  ctx.moveTo(5, 10);
  ctx.lineTo(5, 13);
  ctx.stroke();

  ctx.restore();
}

// 5. CLEAN HEADER UI: ONLY LEFT EXIT AND RIGHT SCORE
function renderTopHeaderUI(ctx, w) {
  ctx.save();

  // Left EXIT Pill Button
  const exitX = 14;
  const exitY = 14;
  const exitW = 80;
  const exitH = 34;

  ctx.fillStyle = "#FFFFFF";
  drawRoundedRect(ctx, exitX, exitY, exitW, exitH, 10, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000000";
  ctx.font = "900 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("EXIT", exitX + exitW / 2, exitY + exitH / 2 + 1);

  // Right SCORE Display
  const scoreStr = String(heliGame.distanceMeters).padStart(4, '0');
  const scoreW = 95;
  const scoreH = 34;
  const scoreX = w - scoreW - 14;
  const scoreY = 14;

  ctx.fillStyle = "#3B82F6";
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 10, true);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
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

