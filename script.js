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
// HIGH-GRAPHICS ULTRA-SMOOTH PREMIUM GAME ENGINE
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // 110px 3D Toy Chopper Specs
  x: 70,
  y: 220,
  width: 110,
  height: 60,
  
  // Smooth Physics & Animations
  gravity: 0.36,
  velocity: 0,
  jumpVelocity: -6.2,
  angle: 0,
  bobTimer: 0,
  rotorFrame: 0,
  
  // 3D Pipes & World Layout
  pipes: [],
  pipeWidth: 64,
  pipeGap: 175,
  pipeSpeed: 2.6,
  pipeSpacing: 220,
  groundHeight: 75,
  groundOffset: 0,
  
  // Cloud Engine
  clouds: [
    { x: 40, y: 70, speed: 0.3, scale: 1.1, opacity: 0.7 },
    { x: 220, y: 130, speed: 0.5, scale: 0.85, opacity: 0.6 },
    { x: 420, y: 90, speed: 0.4, scale: 1.3, opacity: 0.8 }
  ],

  distanceMeters: 0,
  bestScore: 0
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  const handleJump = (e) => {
    // Prevent default touch drag
    if (e.type === 'touchstart') e.preventDefault();
    
    // Check click on exit button hit box in top left
    if (e.clientX && e.clientY) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      if (clickX >= 15 && clickX <= 110 && clickY >= 15 && clickY <= 55) {
        closeGameScreen();
        return;
      }
    }
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

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 30;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.distanceMeters = 0;
  heliGame.bobTimer = 0;
  
  drawPremiumStaticPreview();
}

function drawPremiumStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  heliGame.bobTimer += 0.05;
  const hoverY = heliGame.y + Math.sin(heliGame.bobTimer) * 6;

  renderPremiumBackground(ctx, canvas.width, canvas.height);
  renderCitySkyline(ctx, canvas.width, canvas.height);
  renderPremiumGround(ctx, canvas.width, canvas.height);
  draw3DToyChopper(ctx, heliGame.x, hoverY, 0);
  renderTopPillsUI(ctx, canvas.width);
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 30;
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

  // Smooth dynamic tilt rotation
  heliGame.angle = Math.min(28, Math.max(-20, heliGame.velocity * 3.8));
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.pipeSpeed * dt)) % 30;
  heliGame.rotorFrame += 1 * dt;

  // Cloud Animation
  heliGame.clouds.forEach(cloud => {
    cloud.x -= cloud.speed * dt;
    if (cloud.x < -120) cloud.x = canvas.width + 80;
  });

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  // Exact Hitbox padding for 110px Chopper
  const heliBox = { 
    x: heliGame.x + 15, 
    y: heliGame.y + 12, 
    w: heliGame.width - 30, 
    h: heliGame.height - 20 
  };

  if (heliGame.y + heliGame.height - 10 >= playableHeight) {
    handleCrash();
    return;
  }

  // Pipe Spawner
  if (heliGame.pipes.length === 0) {
    spawnPipe(canvas.width + 40);
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

function renderCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  renderPremiumBackground(ctx, canvas.width, canvas.height);
  renderCitySkyline(ctx, canvas.width, canvas.height);
  render3DPipes(ctx, canvas.height);
  renderPremiumGround(ctx, canvas.width, canvas.height);
  
  if (heliGame.active) {
    draw3DToyChopper(ctx, heliGame.x, heliGame.y, heliGame.angle);
  }

  renderTopPillsUI(ctx, canvas.width);
}

// 1. GRADIENT BACKGROUND WITH SOFT BLURRED CLOUDS (#2ED3E0 -> #7EE8FA)
function renderPremiumBackground(ctx, w, h) {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#2ED3E0");
  bgGrad.addColorStop(1, "#7EE8FA");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Soft Blurred Cloud Rendering
  ctx.save();
  heliGame.clouds.forEach(cloud => {
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = "#FFFFFF";
    const cx = cloud.x;
    const cy = cloud.y;
    const s = cloud.scale;

    ctx.beginPath();
    ctx.arc(cx, cy, 22 * s, 0, Math.PI * 2);
    ctx.arc(cx + 20 * s, cy - 10 * s, 26 * s, 0, Math.PI * 2);
    ctx.arc(cx + 45 * s, cy, 20 * s, 0, Math.PI * 2);
    ctx.arc(cx + 25 * s, cy + 10 * s, 18 * s, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// 2. DETAILED LIGHT BLUE CITY SILHOUETTE (#A2D2FF)
function renderCitySkyline(ctx, w, h) {
  const groundY = h - heliGame.groundHeight;
  ctx.save();
  ctx.fillStyle = "#A2D2FF";

  const buildingWidths = [45, 30, 55, 40, 60, 35, 50];
  const buildingHeights = [110, 80, 140, 95, 125, 75, 130];
  let currentX = 0;
  let i = 0;

  while (currentX < w + 60) {
    const bw = buildingWidths[i % buildingWidths.length];
    const bh = buildingHeights[i % buildingHeights.length];
    const by = groundY - bh;

    ctx.fillRect(currentX, by, bw, bh);

    // Architectural Roof Accents
    if (i % 2 === 0) {
      ctx.fillRect(currentX + bw / 2 - 3, by - 14, 6, 14); // Antenna
    } else if (i % 3 === 0) {
      ctx.fillRect(currentX + 6, by - 8, bw - 12, 8); // Roof Top Step
    }

    // Windows Detail
    ctx.fillStyle = "#BDE0FE";
    for (let wx = currentX + 6; wx < currentX + bw - 8; wx += 10) {
      for (let wy = by + 12; wy < groundY - 15; wy += 18) {
        ctx.fillRect(wx, wy, 5, 8);
      }
    }
    ctx.fillStyle = "#A2D2FF";

    currentX += bw + 8;
    i++;
  }
  ctx.restore();
}

// 3. GLOSSY 3D PIPES (#4CAF50 + White Highlights & Inner Caps)
function render3DPipes(ctx, canvasHeight) {
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawSingle3DPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = (canvasHeight - heliGame.groundHeight) - p.bottomY;
    drawSingle3DPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }
}

function drawSingle3DPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;

  ctx.save();
  
  // Base Green Gradient Fill
  const pipeGrad = ctx.createLinearGradient(x, 0, x + w, 0);
  pipeGrad.addColorStop(0, "#388E3C");
  pipeGrad.addColorStop(0.3, "#4CAF50");
  pipeGrad.addColorStop(0.7, "#66BB6A");
  pipeGrad.addColorStop(1, "#2E7D32");

  ctx.fillStyle = pipeGrad;
  ctx.fillRect(x, y, w, h);

  // White Highlight Left Stripe (10px)
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillRect(x + 5, y, 10, h);

  // Black Stroke 3px
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  // 3D Cap Rim (Height 24px)
  const capH = 24;
  const overhang = 5;
  const capX = x - overhang;
  const capW = w + (overhang * 2);
  const capY = isTop ? y + h - capH : y;

  const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
  capGrad.addColorStop(0, "#388E3C");
  capGrad.addColorStop(0.35, "#4CAF50");
  capGrad.addColorStop(0.75, "#81C784");
  capGrad.addColorStop(1, "#1B5E20");

  ctx.fillStyle = capGrad;
  ctx.fillRect(capX, capY, capW, capH);

  // Cap Gloss Inner Shine & Highlights
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.fillRect(capX + 6, capY + 3, 11, capH - 6);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.strokeRect(capX, capY, capW, capH);

  ctx.restore();
}

// 4. PREMIUM GROUND LAYER (#4ADE80 Grass + Wood Plank Beige #F5E6C8)
function renderPremiumGround(ctx, w, h) {
  const groundY = h - heliGame.groundHeight;

  ctx.save();
  
  // Dirt / Wood Plank Base (#F5E6C8)
  ctx.fillStyle = "#F5E6C8";
  ctx.fillRect(0, groundY, w, heliGame.groundHeight);

  // Horizontal Wood Grain Stripes
  ctx.fillStyle = "#E6D3A7";
  ctx.fillRect(0, groundY + 38, w, 4);
  ctx.fillRect(0, groundY + 58, w, 4);

  // Vertical Plank Joints
  ctx.fillStyle = "#D4C094";
  for (let px = -heliGame.groundOffset; px < w + 50; px += 70) {
    ctx.fillRect(px, groundY + 32, 3, 43);
  }

  // Top Grass Texture Layer (#4ADE80 - 32px High)
  ctx.fillStyle = "#4ADE80";
  ctx.fillRect(0, groundY, w, 32);

  // Grass Edge Dark Outline & Dots
  ctx.fillStyle = "#22C55E";
  ctx.fillRect(0, groundY + 28, w, 4);

  // Leaf Accents / Dots
  ctx.fillStyle = "#86EFAC";
  for (let lx = -heliGame.groundOffset; lx < w + 30; lx += 18) {
    ctx.beginPath();
    ctx.arc(lx, groundY + 12, 3, 0, Math.PI * 2);
    ctx.arc(lx + 6, groundY + 18, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top Ground Boundary Stroke
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  ctx.restore();
}

// 5. 3D TOY CHOPPER (Size 110px, Glossy #FFC93C Body, Motion Blur Disc)
function draw3DToyChopper(ctx, x, y, angleDeg) {
  ctx.save();
  ctx.translate(x + 55, y + 30);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // A. Spinning Rotor Motion Blur Disc (#FFFFFF 30% Opacity)
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.30)";
  ctx.beginPath();
  ctx.ellipse(5, -28, 52, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.50)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Rotor Blades Solid Line Flash
  const bladePhase = Math.sin(heliGame.rotorFrame * 0.9);
  ctx.fillStyle = "#2C3E50";
  ctx.fillRect(-45 * bladePhase, -29, 90 * bladePhase, 3);

  // Shaft Connection
  ctx.fillStyle = "#34495E";
  ctx.fillRect(3, -24, 5, 8);

  // B. Tail Boom & Tail Fin
  ctx.fillStyle = "#E67E22";
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(-50, -6);
  ctx.lineTo(-52, -18);
  ctx.lineTo(-40, -4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Tail Rotor Blur Disc
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.arc(-51, -12, 11, 0, Math.PI * 2);
  ctx.fill();

  // C. Main Toy Chopper Body (#FFC93C 3D Sphere Look)
  const bodyGrad = ctx.createRadialGradient(-5, -6, 4, 0, 0, 32);
  bodyGrad.addColorStop(0, "#FFE082");
  bodyGrad.addColorStop(0.5, "#FFC93C");
  bodyGrad.addColorStop(1, "#F39C12");

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(2, 2, 34, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Body Gloss Reflection Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.ellipse(-6, -10, 18, 6, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // D. Blue Glossy Windows (#6EC6FF)
  const windowGrad = ctx.createLinearGradient(10, -14, 32, 10);
  windowGrad.addColorStop(0, "#E0F7FA");
  windowGrad.addColorStop(0.4, "#6EC6FF");
  windowGrad.addColorStop(1, "#0288D1");

  ctx.fillStyle = windowGrad;
  ctx.beginPath();
  ctx.arc(14, -2, 14, -Math.PI * 0.55, Math.PI * 0.45);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Window Reflection Specular Glare
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.ellipse(18, -6, 4, 2, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // E. Landing Skids
  ctx.strokeStyle = "#2C3E50";
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Vertical Struts
  ctx.moveTo(-10, 22);
  ctx.lineTo(-10, 28);
  ctx.moveTo(14, 22);
  ctx.lineTo(14, 28);
  // Skid Bar
  ctx.moveTo(-24, 28);
  ctx.lineTo(28, 28);
  ctx.stroke();

  ctx.restore();
}

// 6. TOP UI PILLS (Separated Exit & Padded Score)
function renderTopPillsUI(ctx, w) {
  ctx.save();

  // A. Left EXIT Pill
  const exitX = 16;
  const exitY = 16;
  const exitW = 92;
  const exitH = 38;

  // Shadow 0 4px 12px rgba(0,0,0,0.15)
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, exitX, exitY, exitW, exitH, 12, true, false);

  ctx.shadowColor = "transparent"; // Reset Shadow

  ctx.fillStyle = "#000000";
  ctx.font = "900 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✕  EXIT", exitX + exitW / 2, exitY + exitH / 2 + 1);

  // B. Right SCORE Pill (Blue #3B82F6)
  const scoreStr = String(heliGame.distanceMeters).padStart(4, '0');
  const scoreW = 110;
  const scoreH = 38;
  const scoreX = w - scoreW - 16;
  const scoreY = 16;

  ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = "#3B82F6";
  roundRect(ctx, scoreX, scoreY, scoreW, scoreH, 12, true, false);

  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 16px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(scoreStr, scoreX + scoreW / 2, scoreY + scoreH / 2 + 1);

  ctx.restore();
}

// Helper Rounded Rect
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
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
  if (stroke) ctx.stroke();
}

function handleCrash() {
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

