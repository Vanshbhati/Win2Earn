// State Management
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
  { title: "👑 Monthly Championship Live", desc: "Climb top 100 ranks to secure your share of 50% Ad Share Revenue Pool.", time: "1 hour ago" },
  { title: "🚀 Smooth Engine Loaded", desc: "Performance engine optimized for zero lag gaming experience.", time: "3 hours ago" }
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

// ONLY trigger Heli Dash for Daily Tournament
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

// ==========================================================================
// HELI DASH (AAA MOBILE GAME ENGINE - DAILY EXCLUSIVE)
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  
  // Helicopter Stats
  x: 50,
  y: 150,
  width: 55,
  height: 32,
  gravity: 0.38,
  velocity: 0,
  lift: -6.8,
  angle: 0,
  rotorFrame: 0,
  
  // Obstacles & World
  pipes: [],
  pipeWidth: 85,
  pipeGap: 180,
  pipeSpeed: 2.3,
  frameCounter: 0,
  currentRunScore: 1, // Starts at 1
  
  // AAA Graphics & FX Props
  clouds: [],
  particles: [],
  dustParticles: [],
  groundOffset: 0,
  scoreScale: 1.0,
  shakeTime: 0
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerHeliJump();
  }, { passive: false });

  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    triggerHeliJump();
  });

  window.addEventListener("keydown", (e) => {
    const gameModal = document.getElementById("gameScreenModal");
    if (e.code === "Space" && gameModal && !gameModal.classList.contains("hidden")) {
      e.preventDefault();
      triggerHeliJump();
    }
  });
}

function triggerHeliJump() {
  if (heliGame.active) {
    heliGame.velocity = heliGame.lift;
  }
}

function initGameAssets(width, height) {
  // Parallax Clouds Init
  heliGame.clouds = [];
  for (let i = 0; i < 5; i++) {
    heliGame.clouds.push({
      x: Math.random() * width,
      y: 30 + Math.random() * (height * 0.3),
      size: 35 + Math.random() * 25,
      speed: 0.3 + Math.random() * 0.2
    });
  }

  // Floating Dust Particles
  heliGame.dustParticles = [];
  for (let i = 0; i < 15; i++) {
    heliGame.dustParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2,
      speedX: 0.2 + Math.random() * 0.3,
      speedY: (Math.random() - 0.5) * 0.2
    });
  }
}

function resetHeliGameUI() {
  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  
  const canvas = heliGame.canvas;
  if (!canvas) return;
  canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 360;
  canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 540;

  initGameAssets(canvas.width, canvas.height);

  heliGame.y = canvas.height / 2;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.particles = [];
  heliGame.frameCounter = 0;
  heliGame.currentRunScore = 1;
  heliGame.scoreScale = 1.0;
  heliGame.shakeTime = 0;
  
  drawHeliStaticPreview();
}

function drawHeliStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  renderBackground(ctx, canvas.width, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  drawHelicopterSprite(ctx, heliGame.x, heliGame.y, 0, 0);
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 360;
  canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 540;

  initGameAssets(canvas.width, canvas.height);

  heliGame.y = canvas.height / 2;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.particles = [];
  heliGame.frameCounter = 0;
  heliGame.currentRunScore = 1;
  heliGame.scoreScale = 1.0;
  heliGame.shakeTime = 0;
  heliGame.active = true;

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGameLoop();
}

function heliGameLoop() {
  if (!heliGame.active) return;

  updateHeliGamePhysics();
  renderHeliGameCanvas();

  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function updateHeliGamePhysics() {
  const canvas = heliGame.canvas;
  const groundHeight = 48;
  
  // Helicopter Physics
  heliGame.velocity += heliGame.gravity;
  heliGame.y += heliGame.velocity;

  // Helicopter Tilt Interpolation (+25° up jump, -20° down fall)
  if (heliGame.velocity < 0) {
    heliGame.angle = Math.max(-25, heliGame.angle - 4);
  } else {
    heliGame.angle = Math.min(20, heliGame.angle + 2.5);
  }

  // Rotor animation counter
  heliGame.rotorFrame = (heliGame.rotorFrame + 1) % 2;

  // Floor Collision
  if (heliGame.y + heliGame.height >= canvas.height - groundHeight) {
    heliGame.y = canvas.height - groundHeight - heliGame.height;
    triggerCollisionEffects();
    return;
  }

  // Ceiling Collision
  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  // Ground Movement Speed Sync
  heliGame.groundOffset = (heliGame.groundOffset + heliGame.pipeSpeed) % 24;

  // Pipe Spawning
  heliGame.frameCounter++;
  if (heliGame.frameCounter % 110 === 0) {
    const minPipe = 60;
    const maxPipe = canvas.height - groundHeight - heliGame.pipeGap - minPipe;
    const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;

    heliGame.pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: canvas.height - groundHeight - (topHeight + heliGame.pipeGap),
      passed: false
    });
  }

  // Pipe Movement & Dynamic Score Update
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.pipeSpeed;

    // Score increment on passing
    if (!p.passed && p.x + heliGame.pipeWidth < heliGame.x) {
      p.passed = true;
      heliGame.currentRunScore += 1;
      heliGame.scoreScale = 1.35; // Trigger Score Pop Scale Animation
    }

    // AABB Box Collision with exact dimensions
    if (
      heliGame.x + heliGame.width - 6 > p.x &&
      heliGame.x + 6 < p.x + heliGame.pipeWidth &&
      (heliGame.y + 4 < p.top || heliGame.y + heliGame.height - 4 > canvas.height - groundHeight - p.bottom)
    ) {
      triggerCollisionEffects();
      return;
    }
  }

  // Clean old off-screen pipes
  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth) {
    heliGame.pipes.shift();
  }

  // Score scale recovery
  if (heliGame.scoreScale > 1.0) {
    heliGame.scoreScale -= 0.04;
    if (heliGame.scoreScale < 1.0) heliGame.scoreScale = 1.0;
  }

  // Parallax clouds & Dust update
  heliGame.clouds.forEach(c => {
    c.x -= c.speed;
    if (c.x < -100) c.x = canvas.width + 50;
  });

  heliGame.dustParticles.forEach(d => {
    d.x -= d.speedX;
    d.y += d.speedY;
    if (d.x < 0) d.x = canvas.width;
    if (d.y < 0 || d.y > canvas.height) d.y = Math.random() * canvas.height;
  });

  // Burst Particles update
  for (let i = heliGame.particles.length - 1; i >= 0; i--) {
    const pt = heliGame.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.alpha -= 0.03;
    if (pt.alpha <= 0) heliGame.particles.splice(i, 1);
  }
}

function renderHeliGameCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  ctx.save();

  // Screen Shake FX on Crash
  if (heliGame.shakeTime > 0) {
    heliGame.shakeTime -= 16;
    const dx = (Math.random() - 0.5) * 10;
    const dy = (Math.random() - 0.5) * 10;
    ctx.translate(dx, dy);
  }

  // Layer 0 & 1 & 2 Background
  renderBackground(ctx, canvas.width, canvas.height);

  // Layer 3: Render 3D Lime Green Pipes
  renderPipes(ctx, canvas.height);

  // Layer 4: Render Ground
  renderGround(ctx, canvas.width, canvas.height);

  // Layer 5: Render AAA Helicopter Sprite
  drawHelicopterSprite(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame);

  // Layer 6: Particle FX Burst
  renderParticles(ctx);

  // Layer 7: Top Left / Right Bold Attractive Score Counter
  renderTopLiveScore(ctx, canvas.width);

  ctx.restore();
}

function renderBackground(ctx, w, h) {
  // Layer 0: Sky Vertical Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#87CEEB");
  skyGrad.addColorStop(1, "#B0E7FF");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Layer 1: Parallax Puffy Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  heliGame.clouds.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 0.5, c.y - c.size * 0.2, c.size * 0.7, 0, Math.PI * 2);
    ctx.arc(c.x - c.size * 0.5, c.y - c.size * 0.1, c.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Layer 2: Distant City Skyline Silhouette (30% Opacity)
  ctx.fillStyle = "rgba(100, 160, 210, 0.3)";
  const cityY = h - 48;
  const buildingWidths = [40, 25, 50, 35, 60, 30, 45];
  let currentX = 0;
  let idx = 0;
  while (currentX < w) {
    const bw = buildingWidths[idx % buildingWidths.length];
    const bh = 50 + (idx * 17) % 60;
    ctx.fillRect(currentX, cityY - bh, bw - 2, bh);
    currentX += bw;
    idx++;
  }

  // Floating Dust Particles
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  heliGame.dustParticles.forEach(d => {
    ctx.fillRect(d.x, d.y, d.size, d.size);
  });
}

function renderPipes(ctx, canvasHeight) {
  const groundHeight = 48;
  const pWidth = heliGame.pipeWidth;

  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];

    // TOP PIPE
    drawSingle3DPipe(ctx, p.x, 0, pWidth, p.top, true);

    // BOTTOM PIPE
    const bottomY = canvasHeight - groundHeight - p.bottom;
    drawSingle3DPipe(ctx, p.x, bottomY, pWidth, p.bottom, false);
  }
}

function drawSingle3DPipe(ctx, x, y, width, height, isTop) {
  if (height <= 0) return;

  const bodyGradient = ctx.createLinearGradient(x, 0, x + width, 0);
  bodyGradient.addColorStop(0, "#7ED957");
  bodyGradient.addColorStop(0.3, "#A1F07E");
  bodyGradient.addColorStop(0.7, "#7ED957");
  bodyGradient.addColorStop(1, "#52A832");

  // Pipe Body
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#2E7D32";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, width, height);

  // Pipe Cap
  const capHeight = 26;
  const capOverhang = 6;
  const capX = x - capOverhang;
  const capWidth = width + (capOverhang * 2);
  const capY = isTop ? y + height - capHeight : y;

  const capGradient = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
  capGradient.addColorStop(0, "#7ED957");
  capGradient.addColorStop(0.2, "#B5F797");
  capGradient.addColorStop(0.6, "#7ED957");
  capGradient.addColorStop(1, "#4CAF50");

  ctx.fillStyle = capGradient;
  ctx.fillRect(capX, capY, capWidth, capHeight);
  ctx.strokeRect(capX, capY, capWidth, capHeight);

  // Cap Bevel Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillRect(capX + 4, capY + 3, capWidth - 8, 4);

  // Bolts on Cap
  ctx.fillStyle = "#1E5420";
  ctx.beginPath();
  ctx.arc(capX + 10, capY + capHeight / 2, 3, 0, Math.PI * 2);
  ctx.arc(capX + capWidth - 10, capY + capHeight / 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

function renderGround(ctx, width, height) {
  const groundY = height - 48;

  // Top 18px Grass Strip
  ctx.fillStyle = "#7ED957";
  ctx.fillRect(0, groundY, width, 18);

  // Grass Tufts Pattern Moving
  ctx.fillStyle = "#52A832";
  for (let x = -heliGame.groundOffset; x < width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, groundY + 18);
    ctx.lineTo(x + 6, groundY + 6);
    ctx.lineTo(x + 12, groundY + 18);
    ctx.fill();
  }

  // Bottom 30px Soil Strip
  ctx.fillStyle = "#E6D5A8";
  ctx.fillRect(0, groundY + 18, width, 30);

  // Soil Stone Dots Pattern Moving
  ctx.fillStyle = "#C4B282";
  for (let x = -heliGame.groundOffset; x < width; x += 28) {
    ctx.beginPath();
    ctx.arc(x + 8, groundY + 28, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 20, groundY + 38, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground Border Line
  ctx.strokeStyle = "#2E7D32";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();
}

function drawHelicopterSprite(ctx, x, y, angleDeg, rotorFrame) {
  ctx.save();
  ctx.translate(x + 27, y + 16);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Subtle Shadow below
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 22, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Black Skid Landing Gear
  ctx.strokeStyle = "#1d1d1f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 14); ctx.lineTo(-10, 10);
  ctx.moveTo(10, 14); ctx.lineTo(16, 10);
  ctx.moveTo(-22, 14); ctx.lineTo(20, 14);
  ctx.stroke();

  // 2. Glossy Yellow Body (#FFD93D)
  ctx.fillStyle = "#FFD93D";
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#B8860B";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 3. Tail & Small Red Tail Rotor
  ctx.fillStyle = "#FFD93D";
  ctx.fillRect(-32, -4, 14, 7);
  ctx.strokeRect(-32, -4, 14, 7);

  ctx.fillStyle = "#FF3B30";
  ctx.beginPath();
  ctx.arc(-32, -1, 5, 0, Math.PI * 2);
  ctx.fill();

  // 4. Sky Blue Cockpit Window (#5CE1E6)
  ctx.fillStyle = "#5CE1E6";
  ctx.beginPath();
  ctx.arc(10, -2, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#0071E3";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Window Highlight Reflection
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.beginPath();
  ctx.arc(12, -4, 3, 0, Math.PI * 2);
  ctx.fill();

  // 5. Top Main Rotor with Motion Blur Animation
  ctx.fillStyle = "#1d1d1f";
  ctx.fillRect(-2, -18, 5, 6);

  ctx.fillStyle = rotorFrame === 0 ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(-30, -20, 60, 3);

  ctx.restore();
}

function renderParticles(ctx) {
  heliGame.particles.forEach(pt => {
    ctx.fillStyle = `rgba(255, 217, 61, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Attractive Top Live Score (Top-Left and Top-Right Sync)
function renderTopLiveScore(ctx, canvasWidth) {
  ctx.save();

  // Top Left Score Widget
  ctx.translate(20, 24);
  ctx.scale(heliGame.scoreScale, heliGame.scoreScale);

  ctx.font = "900 28px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Black Stroke
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.strokeText(`SCORE: ${heliGame.currentRunScore}`, 0, 0);

  // Soft Drop Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillText(`SCORE: ${heliGame.currentRunScore}`, 2, 2);

  // Crisp White Text
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`SCORE: ${heliGame.currentRunScore}`, 0, 0);

  ctx.restore();
}

function triggerCollisionEffects() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  // Screen Shake (150ms)
  heliGame.shakeTime = 150;

  // Particle Burst of 12 Yellow Dots
  heliGame.particles = [];
  for (let i = 0; i < 12; i++) {
    heliGame.particles.push({
      x: heliGame.x + 27,
      y: heliGame.y + 16,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      radius: 3 + Math.random() * 4,
      alpha: 1.0
    });
  }

  // Render Crash Frame with Shake/Burst
  renderHeliGameCanvas();

  setTimeout(() => {
    handleHeliCrash();
  }, 200);
}

function handleHeliCrash() {
  appState.currentRunScore = heliGame.currentRunScore;
  appState.dailyScore += heliGame.currentRunScore;

  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  
  if (runScoreEl) runScoreEl.innerText = appState.currentRunScore;
  if (dailyTotalEl) dailyTotalEl.innerText = `${appState.dailyScore} pts`;

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

// Leaderboard Logic
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

// Alerts Renderer
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

// Wallet Profile
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

