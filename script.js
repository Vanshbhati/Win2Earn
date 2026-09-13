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
  { name: "Vikram Singh", amount: "₹5000" },
  { name: "Ananya Roy", amount: "₹5000" },
  { name: "Rohan Mehta", amount: "₹5000" },
  { name: "Pooja Joshi", amount: "₹5000" },
  { name: "Karan Malhotra", amount: "₹5000" },
  { name: "Neha Kapoor", amount: "₹5000" }
];

let lbDailyData = [
  { rank: 1, name: "Aarav Sharma", score: 9850 },
  { rank: 2, name: "Rohan Verma", score: 9420 },
  { rank: 3, name: "Priya Patel", score: 9100 },
  { rank: 4, name: "Kabir Singh", score: 8750 },
  { rank: 5, name: "Ananya Iyer", score: 8300 }
];

const lbWeeklyData = [
  { rank: 1, name: "Vikram Joshi", score: 48200 },
  { rank: 2, name: "Aarav Sharma", score: 46100 },
  { rank: 3, name: "Ananya Iyer", score: 44500 }
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
// LIGHTWEIGHT CLASSIC GAME ENGINE (60 FPS OPTIMIZED)
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  
  // 2x Smaller Aeroplane Dimensions (Compact 2D Plane)
  x: 60,
  y: 200,
  width: 36,
  height: 24,
  
  gravity: 0.38,
  velocity: 0,
  jumpVelocity: -6.5,
  angle: 0,
  
  // Classic Thin Pipes & Spacing
  pipes: [],
  pipeWidth: 48,
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

  const handleJump = (e) => {
    e.preventDefault();
    triggerHeliJump();
  };

  canvas.addEventListener("touchstart", handleJump, { passive: false });
  canvas.addEventListener("mousedown", handleJump);

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

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.distanceMeters = 0;
  
  drawClassicStaticPreview();
}

function drawClassicStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  renderClassicBackground(ctx, canvas.width, canvas.height);
  renderClassicGround(ctx, canvas.width, canvas.height);
  drawClassicAeroplane(ctx, heliGame.x, heliGame.y, 0);
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.distanceMeters = 0;
  heliGame.active = true;

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGameLoop();
}

function heliGameLoop() {
  if (!heliGame.active) return;

  updateClassicPhysics();
  renderClassicCanvas();

  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function updateClassicPhysics() {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;

  heliGame.velocity += heliGame.gravity;
  heliGame.y += heliGame.velocity;

  // Simple Smooth Tilt (-20deg to +30deg)
  heliGame.angle = Math.min(30, Math.max(-20, heliGame.velocity * 4));

  heliGame.groundOffset = (heliGame.groundOffset + heliGame.pipeSpeed) % 18;

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  const planeBox = { x: heliGame.x, y: heliGame.y, w: heliGame.width, h: heliGame.height };

  if (planeBox.y + planeBox.h >= playableHeight) {
    handleClassicCrash();
    return;
  }

  if (heliGame.pipes.length === 0) {
    spawnClassicPipe(canvas.width + 50);
  } else {
    const lastPipe = heliGame.pipes[heliGame.pipes.length - 1];
    if (canvas.width - lastPipe.x >= heliGame.pipeSpacing) {
      spawnClassicPipe(canvas.width);
    }
  }

  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.pipeSpeed;

    const topPipeBox = { x: p.x, y: 0, w: heliGame.pipeWidth, h: p.topHeight };
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY };

    if (checkAABBCollision(planeBox, topPipeBox) || checkAABBCollision(planeBox, bottomPipeBox)) {
      handleClassicCrash();
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

function spawnClassicPipe(startX) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;
  const minH = 60;
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

function renderClassicCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  renderClassicBackground(ctx, canvas.width, canvas.height);
  renderClassicPipes(ctx, canvas.height);
  renderClassicGround(ctx, canvas.width, canvas.height);
  
  if (heliGame.active) {
    drawClassicAeroplane(ctx, heliGame.x, heliGame.y, heliGame.angle);
  }

  const scoreText = document.getElementById("liveScoreText");
  if (scoreText) scoreText.innerText = `${heliGame.distanceMeters}`;
}

// 1. Classic Clean Sky Background & Pixel Skyline
function renderClassicBackground(ctx, w, h) {
  // Cyan Blue Sky
  ctx.fillStyle = "#4EC0CA";
  ctx.fillRect(0, 0, w, h);

  const groundY = h - heliGame.groundHeight;

  // Pixel White Clouds & Skyline Background
  ctx.fillStyle = "#A3E4D7";
  ctx.fillRect(0, groundY - 80, w, 40);

  ctx.fillStyle = "#85C1E9";
  for (let bx = 0; bx < w; bx += 32) {
    ctx.fillRect(bx + 4, groundY - 75, 14, 35);
    ctx.fillRect(bx + 20, groundY - 60, 10, 20);
  }

  // Green Bush Layer
  ctx.fillStyle = "#52BE80";
  ctx.fillRect(0, groundY - 35, w, 35);
  ctx.fillStyle = "#27AE60";
  for (let cx = -10; cx < w + 20; cx += 24) {
    ctx.beginPath();
    ctx.arc(cx, groundY - 30, 16, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 2. Thinner Clean Green Pipes (Exact Retro Look)
function renderClassicPipes(ctx, canvasHeight) {
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawSingleClassicPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = (canvasHeight - heliGame.groundHeight) - p.bottomY;
    drawSingleClassicPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }
}

function drawSingleClassicPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;

  // Solid Green Pipe Body
  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(x, y, w, h);

  // Subtle Highlight Line
  ctx.fillStyle = "#9CE659";
  ctx.fillRect(x + 4, y, 6, h);

  ctx.fillStyle = "#55A021";
  ctx.fillRect(x + w - 8, y, 8, h);

  // Black Borders
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Single Cap Rim
  const capH = 20;
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
}

// 3. Flat Classic Ground
function renderClassicGround(ctx, w, h) {
  const groundY = h - heliGame.groundHeight;

  // Grass Edge
  ctx.fillStyle = "#73BF2E";
  ctx.fillRect(0, groundY, w, 14);
  ctx.fillStyle = "#55A021";
  ctx.fillRect(0, groundY + 14, w, 4);

  // Dirt Layer
  ctx.fillStyle = "#DED895";
  ctx.fillRect(0, groundY + 18, w, heliGame.groundHeight - 18);

  // Dirt Pattern Stripes
  ctx.fillStyle = "#C8B26B";
  for (let gx = -heliGame.groundOffset; gx < w + 30; gx += 20) {
    ctx.beginPath();
    ctx.moveTo(gx, groundY + 22);
    ctx.lineTo(gx - 8, groundY + heliGame.groundHeight);
    ctx.lineTo(gx - 3, groundY + heliGame.groundHeight);
    ctx.lineTo(gx + 5, groundY + 22);
    ctx.fill();
  }

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();
}

// 4. Compact Clean Aeroplane (2x Smaller)
function drawClassicAeroplane(ctx, x, y, angleDeg) {
  ctx.save();
  ctx.translate(x + 18, y + 12);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Body
  ctx.fillStyle = "#F4D03F";
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Wing
  ctx.fillStyle = "#E74C3C";
  ctx.fillRect(-6, 2, 14, 5);
  ctx.strokeRect(-6, 2, 14, 5);

  // Eye / Window
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(8, -3, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(9, -3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function handleClassicCrash() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  appState.currentRunScore = heliGame.distanceMeters;
  appState.dailyScore += heliGame.distanceMeters;

  if (heliGame.distanceMeters > heliGame.bestScore) {
    heliGame.bestScore = heliGame.distanceMeters;
  }

  const modalTitleEl = document.querySelector("#gameOverOverlay h2");
  if (modalTitleEl) modalTitleEl.innerText = "GAME OVER!";

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

