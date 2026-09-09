// ==========================================================================
// STATE MANAGEMENT & DATA
// ==========================================================================
const appState = {
  currentUser: null,
  activeTab: 'home',
  leaderboardType: 'daily',
  generatedOtp: null,
  dailyScore: 0,
  currentRunScore: 0
};

// 50 Real Indian Names with ₹5000 Winnings
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
  { name: "Neha Kapoor", amount: "₹5000" },
  { name: "Arjun Reddy", amount: "₹5000" },
  { name: "Divya Nair", amount: "₹5000" },
  { name: "Suresh Kumar", amount: "₹5000" },
  { name: "Riya Sen", amount: "₹5000" },
  { name: "Manish Agarwal", amount: "₹5000" },
  { name: "Kavya Deshmukh", amount: "₹5000" },
  { name: "Deepak Yadav", amount: "₹5000" },
  { name: "Shweta Tiwari", amount: "₹5000" },
  { name: "Aakash Mishra", amount: "₹5000" },
  { name: "Isha Choudhary", amount: "₹5000" },
  { name: "Siddharth Jain", amount: "₹5000" },
  { name: "Meera Das", amount: "₹5000" },
  { name: "Gaurav Saxena", amount: "₹5000" },
  { name: "Simran Kaur", amount: "₹5000" },
  { name: "Varun Bhatia", amount: "₹5000" },
  { name: "Tanvi Hegde", amount: "₹5000" },
  { name: "Nikhil Pandey", amount: "₹5000" },
  { name: "Kirti Solanki", amount: "₹5000" },
  { name: "Rajesh Rao", amount: "₹5000" },
  { name: "Aditi Joshi", amount: "₹5000" },
  { name: "Sachin Tendulkar", amount: "₹5000" },
  { name: "Kavita Pillai", amount: "₹5000" },
  { name: "Alok Srivastava", amount: "₹5000" },
  { name: "Sonali Kulkarni", amount: "₹5000" },
  { name: "Prateek Bansal", amount: "₹5000" },
  { name: "Richa Sharma", amount: "₹5000" },
  { name: "Mohit Chauhan", amount: "₹5000" },
  { name: "Bhavna Shah", amount: "₹5000" },
  { name: "Tarun Gill", amount: "₹5000" },
  { name: "Swati Bhatt", amount: "₹5000" },
  { name: "Abhishek Dube", amount: "₹5000" },
  { name: "Preeti Mahajan", amount: "₹5000" },
  { name: "Harish Chandra", amount: "₹5000" },
  { name: "Nisha Raj", amount: "₹5000" },
  { name: "Sanjay Singhania", amount: "₹5000" },
  { name: "Monika Arora", amount: "₹5000" },
  { name: "Vishal Pandey", amount: "₹5000" },
  { name: "Shalini Tripathi", amount: "₹5000" },
  { name: "Aman Gupta", amount: "₹5000" },
  { name: "Rutuja Bhosale", amount: "₹5000" }
];

// Leaderboard Mock Data
let lbDailyData = [
  { rank: 1, name: "Aarav Sharma", score: 9850 },
  { rank: 2, name: "Rohan Verma", score: 9420 },
  { rank: 3, name: "Priya Patel", score: 9100 },
  { rank: 4, name: "Kabir Singh", score: 8750 },
  { rank: 5, name: "Ananya Iyer", score: 8300 },
  { rank: 6, name: "Siddharth Rao", score: 8120 },
  { rank: 7, name: "Neha Gupta", score: 7900 },
  { rank: 8, name: "Karan Mehta", score: 7650 },
  { rank: 9, name: "Diya Deshmukh", score: 7400 },
  { rank: 10, name: "Vikram Joshi", score: 7150 }
];

const lbWeeklyData = [
  { rank: 1, name: "Vikram Joshi", score: 48200 },
  { rank: 2, name: "Aarav Sharma", score: 46100 },
  { rank: 3, name: "Ananya Iyer", score: 44500 },
  { rank: 4, name: "Rohan Verma", score: 42800 },
  { rank: 5, name: "Priya Patel", score: 40100 },
  { rank: 6, name: "Kabir Singh", score: 38900 },
  { rank: 7, name: "Siddharth Rao", score: 36400 },
  { rank: 8, name: "Neha Gupta", score: 34200 },
  { rank: 9, name: "Karan Mehta", score: 32800 },
  { rank: 10, name: "Diya Deshmukh", score: 31000 }
];

// Alerts Mock Data
const alertsData = [
  { title: "🔥 Daily Tournament Active", desc: "Top 10 daily players get ₹100 each directly in their UPI wallet!", time: "2 mins ago" },
  { title: "👑 Monthly Championship Live", desc: "New game coming soon! Stay tuned for the upcoming Monthly Premium Tournament.", time: "1 hour ago" },
  { title: "🚀 Fast Engine Engine Loaded", desc: "Performance engine optimized for smooth high-speed gameplay.", time: "3 hours ago" }
];

// On Document Ready
document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initTicker();
  renderLeaderboard('daily');
  renderAlerts();
  initHeliGameListeners();
});

// Splash Screen Logic
function initSplashScreen() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.visibility = "hidden";
    document.body.classList.remove("no-scroll");
  }, 3500);
}

// Ticker Animation
let tickerAnimationId = null;
function initTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;

  const fullWinners = [...recentWinnersData, ...recentWinnersData];
  track.innerHTML = fullWinners.map(item => `
    <div class="ticker-item">🎉 <strong>${item.name}</strong> won <span>${item.amount}</span></div>
  `).join("");

  let pos = 0;
  const speed = 0.6;

  function step() {
    pos -= speed;
    const halfWidth = track.scrollWidth / 2;
    if (Math.abs(pos) >= halfWidth) {
      pos = 0;
    }
    track.style.transform = `translate3d(${pos}px, 0, 0)`;
    tickerAnimationId = requestAnimationFrame(step);
  }

  if (tickerAnimationId) cancelAnimationFrame(tickerAnimationId);
  tickerAnimationId = requestAnimationFrame(step);
}

// Navigation Handler
function handleNavClick(e, tabName) {
  if (e) e.preventDefault();
  
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) selectedTab.classList.remove("hidden");

  const activeNavItem = Array.from(document.querySelectorAll(".nav-item")).find(item => 
    item.getAttribute("onclick") && item.getAttribute("onclick").includes(`'${tabName}'`)
  );
  if (activeNavItem) activeNavItem.classList.add("active");

  appState.activeTab = tabName;

  if (tabName === 'wallet') {
    renderProfileWallet();
  }
}

// Modal Controllers
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
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

function closeOtpModal() { hideModal("otpDisplayModal"); }

// Auth Tab Switching
function switchTab(type) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  
  if (type === 'login') {
    if (loginForm) loginForm.classList.remove("hidden");
    if (signupForm) signupForm.classList.add("hidden");
  } else {
    if (loginForm) loginForm.classList.add("hidden");
    if (signupForm) signupForm.classList.remove("hidden");
  }
}

// OTP Generation
function sendOtp() {
  const mobileInput = document.getElementById("signupMobile");
  const mobile = mobileInput ? mobileInput.value : "";
  if (!mobile || mobile.length < 10) {
    openPopup("Please enter a valid 10-digit mobile number.");
    return;
  }
  
  const generated = Math.floor(1000 + Math.random() * 9000);
  appState.generatedOtp = generated.toString();
  
  const otpMsgElement = document.getElementById("otpPopupMessage");
  if (otpMsgElement) {
    otpMsgElement.innerText = `Your Win2Earn OTP Code is: ${generated}`;
  }
  showModal("otpDisplayModal");
}

function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById("loginEmail");
  const email = emailInput ? emailInput.value : "user@example.com";
  
  appState.currentUser = {
    name: email.split("@")[0].toUpperCase(),
    email: email,
    upi: null
  };

  closeAuthModal();
  onUserLoggedIn();
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById("signupName")?.value || "Player";
  const email = document.getElementById("signupEmail")?.value || "";
  const otpInput = document.getElementById("signupOtp")?.value || "";
  const pass = document.getElementById("signupPassword")?.value || "";
  const confirmPass = document.getElementById("signupConfirmPassword")?.value || "";

  if (pass !== confirmPass) {
    openPopup("Passwords do not match!");
    return;
  }

  if (appState.generatedOtp && otpInput !== appState.generatedOtp) {
    openPopup("Invalid OTP code. Please check and try again.");
    return;
  }

  appState.currentUser = {
    name: name,
    email: email,
    upi: null
  };

  closeAuthModal();
  
  const welcomeText = document.getElementById("welcomeUserName");
  if (welcomeText) welcomeText.innerText = `Welcome, ${name}!`;
  showModal("welcomeModal");

  onUserLoggedIn();
}

function onUserLoggedIn() {
  const megaCard = document.getElementById("megaBannerCard");
  if (megaCard) megaCard.classList.add("hidden");

  const navAuth = document.getElementById("navAuthBtns");
  if (navAuth && appState.currentUser) {
    navAuth.innerHTML = `
      <div class="user-pill-badge" style="background: rgba(245, 197, 24, 0.15); border: 1px solid var(--accent-gold); padding: 6px 14px; border-radius: 12px; color: var(--accent-gold-dark); font-size: 0.8rem; font-weight: 800;">
        👤 ${appState.currentUser.name}
      </div>
    `;
  }
}

function handleWelcomePlay() {
  hideModal("welcomeModal");
  handleNavClick(null, "games");
}

// Trigger Heli Dash exclusively for Daily Tournament
function handleGameLaunch() {
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }
  showModal("gameScreenModal");
  resetHeliGameUI();
}

// Handler for Monthly Premium Tournament (Placeholder for future game)
function handleMonthlyTournamentLaunch() {
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }
  openPopup("Monthly Premium Tournament is currently under maintenance. A brand new game will be launching here soon!");
}

function closeGameScreen() {
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.active = false;
  hideModal("gameScreenModal");
}


// ==========================================================================
// HELI DASH HD - UPGRADED FAST & ATTRACTIVE FLAPPY ENGINE
// ==========================================================================
let audioCtx = null;

function playWooshSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch(e) {}
}

const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // Helicopter Specs (Sleek & Attractive)
  x: 60,
  y: 200,
  targetY: 200,
  width: 44,
  height: 22,
  hitboxW: 32,
  hitboxH: 18,
  gravity: 0.48,           // Faster physics
  velocity: 0,
  jumpVelocity: -8.2,      // Fast jump response
  maxFallSpeed: 10,
  angle: 0,
  rotorFrame: 0,
  hoverTime: 0,
  
  // Dynamic Thin Pipes & Speed Specs
  pipes: [],
  pipeWidth: 46,           // Thinner pipes (formerly 80px)
  pipeGap: 165,
  basePipeSpeed: 4.2,      // Faster initial game speed
  currentPipeSpeed: 4.2,
  pipeSpacing: 220,
  groundHeight: 85,
  groundOffset: 0,
  
  // Moving Clouds System
  clouds: [
    { x: 20, y: 40, speed: 0.8, scale: 0.9 },
    { x: 160, y: 80, speed: 1.2, scale: 0.7 },
    { x: 280, y: 30, speed: 0.6, scale: 1.1 }
  ],
  
  // Score & FX
  score: 0,
  bestScore: 0,
  scoreScaleTimer: 0,
  floatingTexts: [],
  shakeTime: 0,
  particles: []
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  const handleInteraction = (e) => {
    e.preventDefault();
    triggerHeliJump();
  };

  canvas.addEventListener("touchstart", handleInteraction, { passive: false });
  canvas.addEventListener("mousedown", handleInteraction);

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
  playWooshSound();
}

function resetHeliGameUI() {
  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  
  const canvas = heliGame.canvas;
  if (!canvas) return;
  
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : 360;
  canvas.height = container ? container.clientHeight : 640;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2;
  heliGame.targetY = heliGame.y;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.particles = [];
  heliGame.floatingTexts = [];
  heliGame.score = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.scoreScaleTimer = 0;
  heliGame.shakeTime = 0;
  heliGame.hoverTime = 0;
  
  drawHeliStaticPreview();
}

function drawHeliStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  heliGame.hoverTime += 0.05;
  const bobbing = Math.sin(heliGame.hoverTime * 3) * 3;

  renderBackground(ctx, canvas.width, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  drawAttractiveHelicopter(ctx, heliGame.x, heliGame.y + bobbing, 0, Math.floor(Date.now() / 60) % 3);
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : 360;
  canvas.height = container ? container.clientHeight : 640;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2;
  heliGame.targetY = heliGame.y;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.particles = [];
  heliGame.floatingTexts = [];
  heliGame.score = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.scoreScaleTimer = 0;
  heliGame.shakeTime = 0;
  heliGame.active = true;
  heliGame.lastTime = performance.now();

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGameLoop(performance.now());
}

function heliGameLoop(now) {
  if (!heliGame.active) return;

  const dt = Math.min((now - heliGame.lastTime) / 1000, 0.033);
  heliGame.lastTime = now;

  updateHeliGamePhysics(dt);
  renderHeliGameCanvas();

  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function updateHeliGamePhysics(dt) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;

  // Helicopter Physics with smooth response
  heliGame.velocity += heliGame.gravity;
  if (heliGame.velocity > heliGame.maxFallSpeed) {
    heliGame.velocity = heliGame.maxFallSpeed;
  }
  
  heliGame.targetY += heliGame.velocity;
  heliGame.y += (heliGame.targetY - heliGame.y) * 0.9;

  // Tilt physics
  if (heliGame.velocity < 0) {
    heliGame.angle = Math.max(-25, heliGame.angle - 10);
  } else {
    heliGame.angle = Math.min(35, heliGame.angle + 4.5);
  }

  // Rotor animation frame
  heliGame.rotorFrame = Math.floor(Date.now() / 50) % 3;

  // Speed scaling as score increases (Smooth fast progression)
  const speedTier = Math.floor(heliGame.score / 4);
  heliGame.currentPipeSpeed = Math.min(7.5, heliGame.basePipeSpeed + (speedTier * 0.25));

  // Ground and Cloud scrolls
  heliGame.groundOffset = (heliGame.groundOffset + heliGame.currentPipeSpeed) % 24;
  heliGame.clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
    if (cloud.x < -80) cloud.x = canvas.width + 40;
  });

  // Ceiling collision check
  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.targetY = 0;
    heliGame.velocity = 0;
  }

  // Collision Box Definition
  const heliHitbox = {
    x: heliGame.x + (heliGame.width - heliGame.hitboxW) / 2,
    y: heliGame.y + (heliGame.height - heliGame.hitboxH) / 2,
    w: heliGame.hitboxW,
    h: heliGame.hitboxH
  };

  if (heliHitbox.y + heliHitbox.h >= playableHeight) {
    triggerCollisionEffects();
    return;
  }

  // Spawn Thin Pipes
  if (heliGame.pipes.length === 0) {
    spawnPipe(canvas.width);
  } else {
    const lastPipe = heliGame.pipes[heliGame.pipes.length - 1];
    if (canvas.width - lastPipe.x >= heliGame.pipeSpacing) {
      spawnPipe(canvas.width);
    }
  }

  // Pipe Movement & Collision Check
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.currentPipeSpeed;

    if (!p.passed && p.x + heliGame.pipeWidth < heliHitbox.x) {
      p.passed = true;
      heliGame.score += 1;
      heliGame.scoreScaleTimer = performance.now();

      heliGame.floatingTexts.push({
        x: canvas.width - 50,
        y: 65,
        alpha: 1.0,
        scale: 1.2
      });
    }

    const topPipeBox = { x: p.x, y: 0, w: heliGame.pipeWidth, h: p.topHeight };
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY };

    if (checkAABBCollision(heliHitbox, topPipeBox) || checkAABBCollision(heliHitbox, bottomPipeBox)) {
      triggerCollisionEffects();
      return;
    }
  }

  // Clean off-screen pipes
  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth) {
    heliGame.pipes.shift();
  }

  // Update floating text & particles
  for (let i = heliGame.floatingTexts.length - 1; i >= 0; i--) {
    const ft = heliGame.floatingTexts[i];
    ft.y -= 1.2;
    ft.alpha -= 0.035;
    if (ft.alpha <= 0) heliGame.floatingTexts.splice(i, 1);
  }

  for (let i = heliGame.particles.length - 1; i >= 0; i--) {
    const pt = heliGame.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.alpha -= 0.04;
    if (pt.alpha <= 0) heliGame.particles.splice(i, 1);
  }
}

function spawnPipe(startX) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;
  const minHeight = 60;
  const maxHeight = playableHeight - heliGame.pipeGap - minHeight;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

  heliGame.pipes.push({
    x: startX,
    topHeight: topHeight,
    bottomY: topHeight + heliGame.pipeGap,
    passed: false
  });
}

function checkAABBCollision(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function renderHeliGameCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  ctx.save();

  if (heliGame.shakeTime > 0) {
    heliGame.shakeTime -= 16;
    const dx = (Math.random() - 0.5) * 8;
    const dy = (Math.random() - 0.5) * 8;
    ctx.translate(dx, dy);
  }

  renderBackground(ctx, canvas.width, canvas.height);
  renderPipes(ctx, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  drawAttractiveHelicopter(ctx, heliGame.x, heliGame.y, -heliGame.angle, heliGame.rotorFrame);
  renderParticles(ctx);
  renderTopRightScoreUI(ctx, canvas.width);

  ctx.restore();
}

function renderBackground(ctx, w, h) {
  // Vibrant Blue Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#1A73E8");
  skyGrad.addColorStop(0.6, "#2EC1CC");
  skyGrad.addColorStop(1, "#80DEEA");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Moving Animated Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  heliGame.clouds.forEach(c => {
    drawCloud(ctx, c.x, c.y, c.scale);
  });

  const groundY = h - heliGame.groundHeight;

  // Background City Skyline
  ctx.fillStyle = "#A0E0E0";
  const buildingHeights = [65, 45, 80, 55, 90, 50, 75];
  let currentX = 0;
  let idx = 0;
  while (currentX < w) {
    const bw = 32;
    const bh = buildingHeights[idx % buildingHeights.length];
    ctx.fillRect(currentX, groundY - bh - 20, bw, bh + 20);
    currentX += bw + 4;
    idx++;
  }

  // Bushes Layer
  ctx.fillStyle = "#8FD68E";
  ctx.fillRect(0, groundY - 20, w, 20);
}

function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 16, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(16, -12, 18, Math.PI * 1, Math.PI * 1.85);
  ctx.arc(36, -6, 14, Math.PI * 1.37, Math.PI * 1.91);
  ctx.arc(46, 0, 14, Math.PI * 1.5, Math.PI * 0.5);
  ctx.moveTo(46, 16);
  ctx.lineTo(0, 16);
  ctx.fill();
  ctx.restore();
}

function renderPipes(ctx, canvasHeight) {
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    
    // Top Pipe
    drawThinMetallicPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);

    // Bottom Pipe
    const bottomHeight = (canvasHeight - heliGame.groundHeight) - p.bottomY;
    drawThinMetallicPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomHeight, false);
  }
}

// Thin Glossy Metallic Pipe Renderer
function drawThinMetallicPipe(ctx, x, y, width, height, isTop) {
  if (height <= 0) return;

  const bodyGrad = ctx.createLinearGradient(x, 0, x + width, 0);
  bodyGrad.addColorStop(0, "#2E7D32");
  bodyGrad.addColorStop(0.3, "#4CAF50");
  bodyGrad.addColorStop(0.5, "#A5D6A7"); // Metallic Light Stripe
  bodyGrad.addColorStop(0.8, "#4CAF50");
  bodyGrad.addColorStop(1, "#1B5E20");

  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x, y, width, height);
  
  ctx.strokeStyle = "#0D3B11";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Sleek Pipe Cap
  const capH = 18;
  const overhang = 4;
  const capX = x - overhang;
  const capW = width + (overhang * 2);
  const capY = isTop ? y + height - capH : y;

  const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
  capGrad.addColorStop(0, "#388E3C");
  capGrad.addColorStop(0.5, "#C8E6C9");
  capGrad.addColorStop(1, "#1B5E20");

  ctx.fillStyle = capGrad;
  ctx.fillRect(capX, capY, capW, capH);
  ctx.strokeRect(capX, capY, capW, capH);
}

function renderGround(ctx, width, height) {
  const groundY = height - heliGame.groundHeight;

  ctx.fillStyle = "#3CB043";
  ctx.fillRect(0, groundY, width, 12);
  
  ctx.fillStyle = "#2E8B37";
  for (let gx = -heliGame.groundOffset; gx < width + 24; gx += 16) {
    ctx.beginPath();
    ctx.arc(gx, groundY + 12, 6, 0, Math.PI);
    ctx.fill();
  }

  const woodY = groundY + 12;
  const woodH = heliGame.groundHeight - 12;
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(0, woodY, width, woodH);

  ctx.strokeStyle = "#A0522D";
  ctx.lineWidth = 2;
  for (let lx = -heliGame.groundOffset; lx < width + 40; lx += 32) {
    ctx.beginPath();
    ctx.moveTo(lx, woodY);
    ctx.lineTo(lx + 12, woodY + woodH);
    ctx.stroke();
  }
}

// Highly Detailed & Attractive Helicopter
function drawAttractiveHelicopter(ctx, x, y, angleDeg, rotorFrame) {
  ctx.save();
  ctx.translate(x + 22, y + 11);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Black Skids & Supports
  ctx.strokeStyle = "#1A1A1A";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, 10); ctx.lineTo(-4, 6);
  ctx.moveTo(8, 10); ctx.lineTo(12, 6);
  ctx.moveTo(-16, 10); ctx.lineTo(18, 10);
  ctx.stroke();

  // Sleek Metallic Tail
  const tailGrad = ctx.createLinearGradient(-26, -4, -10, 4);
  tailGrad.addColorStop(0, "#FF8C00");
  tailGrad.addColorStop(1, "#FFD700");
  ctx.fillStyle = tailGrad;
  ctx.fillRect(-26, -3, 16, 6);

  // Tail Fin & Small Rotor
  ctx.fillStyle = "#D32F2F";
  ctx.beginPath();
  ctx.moveTo(-26, -3);
  ctx.lineTo(-30, -9);
  ctx.lineTo(-24, -3);
  ctx.fill();

  // Rounded Main Body
  const bodyGrad = ctx.createRadialGradient(4, -2, 2, 0, 0, 18);
  bodyGrad.addColorStop(0, "#FFF176");
  bodyGrad.addColorStop(0.5, "#FFC107");
  bodyGrad.addColorStop(1, "#FF8F00");

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(2, 0, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5D4037";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glowing Glass Cockpit Window
  const glassGrad = ctx.createLinearGradient(6, -6, 16, 4);
  glassGrad.addColorStop(0, "#80DEEA");
  glassGrad.addColorStop(0.6, "#00ACC1");
  glassGrad.addColorStop(1, "#006064");

  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.arc(9, -1, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Window Reflection
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.arc(11, -3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Top Rotor Mast
  ctx.fillStyle = "#37474F";
  ctx.fillRect(0, -14, 4, 5);

  // Dynamic High-Speed Rotor Blur
  ctx.fillStyle = "rgba(33, 33, 33, 0.8)";
  if (rotorFrame === 0) {
    ctx.fillRect(-18, -15, 38, 3);
  } else if (rotorFrame === 1) {
    ctx.fillRect(-12, -15, 26, 3);
  } else {
    ctx.fillRect(-20, -15, 42, 2);
  }

  ctx.restore();
}

function renderParticles(ctx) {
  heliGame.particles.forEach(pt => {
    ctx.fillStyle = `rgba(255, 193, 7, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderTopRightScoreUI(ctx, canvasWidth) {
  ctx.save();
  const rightX = canvasWidth - 18;
  const topY = 14;
  const formattedScore = heliGame.score < 10 ? `0${heliGame.score}` : `${heliGame.score}`;

  const elapsed = performance.now() - heliGame.scoreScaleTimer;
  let currentScale = 1.0;
  if (elapsed < 90) {
    currentScale = 1.0 + (0.35 * (1 - elapsed / 90));
  }

  const pillW = 85;
  const pillH = 46;
  const pillX = rightX - pillW;
  const pillY = topY;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(pillX, pillY, pillW, pillH, 12);
  } else {
    ctx.rect(pillX, pillY, pillW, pillH);
  }
  ctx.fill();

  ctx.translate(pillX + pillW / 2, pillY + pillH / 2);
  ctx.scale(currentScale, currentScale);

  ctx.font = "900 38px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.strokeText(formattedScore, 0, 2);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(formattedScore, 0, 2);

  ctx.restore();

  heliGame.floatingTexts.forEach(ft => {
    ctx.save();
    ctx.globalAlpha = ft.alpha;
    ctx.font = "900 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#FFD700";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeText("+1", ft.x, ft.y);
    ctx.fillText("+1", ft.x, ft.y);
    ctx.restore();
  });
}

function triggerCollisionEffects() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  heliGame.shakeTime = 120;

  heliGame.particles = [];
  for (let i = 0; i < 12; i++) {
    heliGame.particles.push({
      x: heliGame.x + 22,
      y: heliGame.y + 11,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      radius: 2 + Math.random() * 4,
      alpha: 1.0
    });
  }

  renderHeliGameCanvas();

  setTimeout(() => {
    handleHeliCrash();
  }, 180);
}

function handleHeliCrash() {
  appState.currentRunScore = heliGame.score;
  appState.dailyScore += heliGame.score;

  if (heliGame.score > heliGame.bestScore) {
    heliGame.bestScore = heliGame.score;
  }

  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  
  if (runScoreEl) runScoreEl.innerText = appState.currentRunScore;
  if (dailyTotalEl) dailyTotalEl.innerText = `${appState.dailyScore} pts (Best: ${heliGame.bestScore})`;

  updateLeaderboardWithUserScore();
  document.getElementById("gameOverOverlay")?.classList.remove("hidden");
}

function updateLeaderboardWithUserScore() {
  if (!appState.currentUser) return;

  const existingIdx = lbDailyData.findIndex(item => item.name === appState.currentUser.name);
  if (existingIdx !== -1) {
    lbDailyData[existingIdx].score = appState.dailyScore;
  } else {
    lbDailyData.push({
      rank: lbDailyData.length + 1,
      name: appState.currentUser.name,
      score: appState.dailyScore
    });
  }

  lbDailyData.sort((a, b) => b.score - a.score);
  lbDailyData.forEach((item, index) => item.rank = index + 1);

  renderLeaderboard(appState.leaderboardType);
}

// ==========================================================================
// LEADERBOARD & WALLET SYSTEM
// ==========================================================================
function switchLeaderboard(type) {
  appState.leaderboardType = type;
  const btnDaily = document.getElementById("btnDailyLb");
  const btnWeekly = document.getElementById("btnWeeklyLb");
  if (btnDaily) btnDaily.classList.toggle("active", type === 'daily');
  if (btnWeekly) btnWeekly.classList.toggle("active", type === 'weekly');
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

  const rankCard = document.getElementById("userRankCard");
  if (rankCard) {
    let userRank = 'Unranked';
    if (appState.currentUser) {
      const found = data.find(i => i.name === appState.currentUser.name);
      if (found) userRank = `#${found.rank} Rank`;
    }

    rankCard.innerHTML = `
      <div>
        <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800;">YOUR CURRENT STANDING</div>
        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${appState.currentUser ? appState.currentUser.name : 'Guest User'}</div>
      </div>
      <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold-dark);">
        ${userRank}
      </div>
    `;
  }
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
  const upiDisplay = document.getElementById("walletUpiDisplay");
  const txList = document.getElementById("txList");

  if (!appState.currentUser) {
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="glass-card" style="padding: 16px; margin-bottom: 16px; text-align: center;">
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 10px;">Log in to access your Payout Wallet and Link UPI.</p>
          <button class="glass-btn primary-btn" onclick="openAuthModal('login')">LOG IN NOW</button>
        </div>
      `;
    }
    return;
  }

  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="glass-card" style="padding: 16px; margin-bottom: 16px; text-align: left;">
        <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800;">ACCOUNT HOLDER</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">${appState.currentUser.name}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">${appState.currentUser.email}</div>
      </div>
    `;
  }

  if (upiDisplay) {
    if (appState.currentUser.upi) {
      upiDisplay.innerHTML = `<span style="color: var(--accent-green)">🟢 ${appState.currentUser.upi}</span>`;
    } else {
      upiDisplay.innerHTML = `
        <button class="glass-btn action-btn" style="padding: 10px 16px; font-size: 0.82rem;" onclick="showModal('walletActivationModal')">
          + LINK UPI ID
        </button>
      `;
    }
  }

  if (txList) {
    txList.innerHTML = `
      <div class="tx-item">
        <div>
          <div class="tx-title">Daily Tournament Reward</div>
          <div class="tx-date">Instant Transfer</div>
        </div>
        <div class="tx-amount">+₹100</div>
      </div>
    `;
  }
}

function activateWallet(e) {
  e.preventDefault();
  const upiInput = document.getElementById("upiInput")?.value;
  if (!upiInput || !upiInput.includes("@")) {
    openPopup("Please enter a valid UPI ID (e.g. username@upi)");
    return;
  }

  if (appState.currentUser) {
    appState.currentUser.upi = upiInput;
  }

  hideModal("walletActivationModal");
  renderProfileWallet();
}

// Legal Modals
const legalTexts = {
  privacy: {
    title: "Privacy Policy",
    body: "<h4>1. Data Security</h4><p>Win2Earn values user privacy. We store user credentials strictly for account authentication and tournament prize distribution.</p><h4>2. No Third-Party Sales</h4><p>Your mobile number and UPI details are kept encrypted and never shared with external agencies.</p>"
  },
  terms: {
    title: "Terms & Conditions",
    body: "<h4>1. Free Skill Platform</h4><p>Win2Earn is a 100% free gaming platform. Users cannot deposit real money to participate.</p><h4>2. Fair Play Policy</h4><p>Any use of bots, emulators, or score manipulation will lead to immediate account termination.</p>"
  },
  community: {
    title: "Community Guidelines",
    body: "<h4>1. Respectful Competition</h4><p>Maintain sportsmanship across all tournaments and support channels.</p><h4>2. Authentic Rank Standings</h4><p>Leaderboards update dynamically to guarantee genuine performance tracking.</p>"
  }
};

function openLegalModal(type) {
  const content = legalTexts[type];
  if (content) {
    const titleEl = document.getElementById("legalModalTitle");
    const bodyEl = document.getElementById("legalModalBody");
    if (titleEl) titleEl.innerText = content.title;
    if (bodyEl) bodyEl.innerHTML = content.body;
    showModal("legalModal");
  }
}

function closeLegalModal() { hideModal("legalModal"); }

