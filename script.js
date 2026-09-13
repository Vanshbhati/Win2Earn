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
// GAME ENGINE
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
  pipeSpeed: 160,
  pipeSpacing: 210,
  groundHeight: 60,
  groundOffset: 0,

  rawScoreAcc: 0,
  distanceMeters: 0,
  bestScore: 0,

  bgScroll: 0,
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

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#4ec0ca");
  skyGrad.addColorStop(0.75, "#80e1d9");
  skyGrad.addColorStop(1, "#b3f0db");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);
}

// SOFT VIBRANT BACKGROUND BUILDINGS (PERFECT VISIBILITY BALANCE)
function drawBalancedBackgroundCity(ctx, w, h, bgScroll) {
  const baseLineY = h - heliGame.groundHeight + 10;

  const buildings = [
    { x: 0, w: 48, h: 95, color: "rgba(255, 178, 115, 0.68)", dark: "rgba(230, 140, 75, 0.68)" },
    { x: 52, w: 40, h: 125, color: "rgba(186, 148, 235, 0.68)", dark: "rgba(150, 110, 205, 0.68)" },
    { x: 96, w: 54, h: 80, color: "rgba(125, 175, 240, 0.68)", dark: "rgba(90, 140, 210, 0.68)" },
    { x: 154, w: 44, h: 140, color: "rgba(255, 138, 148, 0.68)", dark: "rgba(225, 100, 110, 0.68)" },
    { x: 202, w: 50, h: 105, color: "rgba(110, 225, 165, 0.68)", dark: "rgba(75, 190, 130, 0.68)" },
    { x: 256, w: 46, h: 118, color: "rgba(250, 218, 110, 0.68)", dark: "rgba(215, 180, 70, 0.68)" }
  ];

  const loopW = 310;
  const offsetX = (bgScroll * 0.12) % loopW;

  ctx.save();

  for (let i = -1; i < Math.ceil(w / loopW) + 1; i++) {
    const baseX = i * loopW - offsetX;
    buildings.forEach(b => {
      const bx = baseX + b.x;
      const by = baseLineY - b.h;

      // Building Main Frame
      ctx.fillStyle = b.color;
      ctx.fillRect(bx, by, b.w, b.h + 20);

      // Side Shade Rim
      ctx.fillStyle = b.dark;
      ctx.fillRect(bx + b.w - 4, by, 4, b.h + 20);

      // White Roof Trim
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(bx - 1, by, b.w + 2, 3);

      // Windows
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      for (let wY = 12; wY < b.h - 8; wY += 18) {
        ctx.fillRect(bx + 6, by + wY, 7, 9);
        if (b.w > 36) {
          ctx.fillRect(bx + b.w - 13, by + wY, 7, 9);
        }
      }
    });
  }

  // Soft Background Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  const cloudOffset = (bgScroll * 0.08) % (w + 200);
  drawCloud(ctx, (w * 0.25) - cloudOffset, h * 0.12, 30);
  drawCloud(ctx, (w * 0.8) - cloudOffset, h * 0.2, 40);

  ctx.restore();
}

function drawCloud(ctx, cx, cy, radius) {
  let x = cx < -100 ? cx + ctx.canvas.width + 200 : cx;
  ctx.beginPath();
  ctx.arc(x, cy, radius, 0, Math.PI * 2);
  ctx.arc(x + radius * 0.7, cy - radius * 0.3, radius * 0.75, 0, Math.PI * 2);
  ctx.arc(x + radius * 1.4, cy, radius * 0.8, 0, Math.PI * 2);
  ctx.fill();
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
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bgScroll = 0;
  
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
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bgScroll = 0;
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
  heliGame.rotorFrame += dt * 35;
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.pipeSpeed * dt)) % 32;
  heliGame.bgScroll += (heliGame.pipeSpeed * dt);

  heliGame.rawScoreAcc += dt * 12;
  heliGame.distanceMeters = Math.floor(heliGame.rawScoreAcc);

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
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY + 10 };

    if (checkAABBCollision(heliBox, topPipeBox) || checkAABBCollision(heliBox, bottomPipeBox)) {
      handleCrash();
      return;
    }
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth - 10) {
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

  // Sky Gradient
  if (heliGame.bgCanvas) {
    ctx.drawImage(heliGame.bgCanvas, 0, 0);
  }

  // Soft & Balanced Background City
  drawBalancedBackgroundCity(ctx, canvas.width, canvas.height, heliGame.bgScroll);

  // Pipes
  const playableHeight = canvas.height - heliGame.groundHeight;
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = playableHeight - p.bottomY + 12;
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  // Cartoon Lush Grass Ground (Perfect Match)
  drawCartoonGrassGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);

  // Helicopter
  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame);

  // Header UI
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

// MATCHING CARTOON GRASS & DIRT GROUND
function drawCartoonGrassGround(ctx, width, height, groundHeight, scrollOffset) {
  const groundY = height - groundHeight;
  const topGrassH = 14;

  ctx.save();

  // Dirt Base Bottom
  ctx.fillStyle = "#ded895";
  ctx.fillRect(0, groundY + topGrassH, width, groundHeight - topGrassH);

  // Darker Dirt Texture Line
  ctx.fillStyle = "#ce8e41";
  ctx.fillRect(0, groundY + topGrassH + 18, width, 6);

  // Top Lush Green Grass Base
  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(0, groundY, width, topGrassH);

  // Top Light Grass Highlight Strip
  ctx.fillStyle = "#9ce659";
  ctx.fillRect(0, groundY, width, 3.5);

  // Wavy Scalloped Grass Bush Edge
  ctx.fillStyle = "#538d21";
  const step = 16;
  const startX = -(scrollOffset % step);
  for (let x = startX; x < width + step; x += step) {
    ctx.fillRect(x, groundY + topGrassH - 2, 8, 3.5);
  }

  // Top Border Line
  ctx.strokeStyle = "#2e520e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();

  ctx.restore();
}

function drawVectorHelicopter(ctx, x, y, angleDeg, frame) {
  ctx.save();
  ctx.translate(x + 22, y + 14);
  ctx.rotate((angleDeg * Math.PI) / 180);

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
  const container = document.getElementById("alertsFeedFeed");
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

