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
  activeGameType: 'daily' // 'daily' or 'monthly'
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
  { title: "👑 Quantum Rush Monthly Live", desc: "Premium Sci-Fi Championship is LIVE! Win up to ₹1,00,000 GTD!", time: "1 hour ago" },
  { title: "🚀 Fast Engine Loaded", desc: "Performance engine optimized for smooth gameplay.", time: "3 hours ago" }
];

// On Document Ready
document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initTicker();
  renderLeaderboard('daily');
  renderAlerts();
  initHeliGameListeners();
  initQuantumGameListeners();
  setupMonthlyButtons();
});

// Setup Monthly Buttons
function setupMonthlyButtons() {
  const monthlyCards = document.querySelectorAll('.monthly-premium-card .game-play-btn');
  monthlyCards.forEach(btn => {
    btn.setAttribute('onclick', 'handleMonthlyTournamentLaunch()');
  });
}

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
      <div class="user-pill-badge" style="background: rgba(0, 113, 227, 0.1); border: 1px solid #0071e3; padding: 6px 14px; border-radius: 20px; color: #0071e3; font-size: 0.8rem; font-weight: 700;">
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
  
  appState.activeGameType = 'daily';
  
  const headerTitle = document.querySelector(".game-header-title");
  if (headerTitle) headerTitle.innerHTML = "🚁 Copter Cash - Daily Tournament";

  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.innerHTML = "➔ Exit";
    backBtn.style.padding = "6px 14px";
    backBtn.style.fontSize = "0.8rem";
    backBtn.style.borderRadius = "20px";
  }

  showModal("gameScreenModal");
  resetHeliGameUI();
}

// Handler for Monthly Premium Tournament (Quantum Rush 3D)
function handleMonthlyTournamentLaunch() {
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }

  appState.activeGameType = 'monthly';

  const headerTitle = document.querySelector(".game-header-title");
  if (headerTitle) headerTitle.innerHTML = "⚡ QUANTUM RUSH - Monthly Championship";

  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.innerHTML = "➔ Exit";
    backBtn.style.padding = "6px 14px";
    backBtn.style.fontSize = "0.8rem";
    backBtn.style.borderRadius = "20px";
  }

  showModal("gameScreenModal");
  resetQuantumGameUI();
}

function closeGameScreen() {
  stopGameMusic();
  stopQuantumMusic();

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  if (quantumGame.loopId) cancelAnimationFrame(quantumGame.loopId);

  heliGame.active = false;
  quantumGame.active = false;

  hideModal("gameScreenModal");
}

function handleUniversalStart() {
  if (appState.activeGameType === 'daily') {
    startHeliGame();
  } else {
    startQuantumGame();
  }
}


// ==========================================================================
// AUDIO SYNTHESIZERS & SOUND EFFECTS
// ==========================================================================
let audioCtx = null;
let musicInterval = null;
let quantumMusicInterval = null;
let isMusicPlaying = false;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Copter Cash Music
function startGameMusic() {
  initAudioContext();
  if (isMusicPlaying) return;
  isMusicPlaying = true;

  let noteIndex = 0;
  const bassNotes = [110, 110, 130, 146, 110, 110, 164, 146];

  musicInterval = setInterval(() => {
    if (!heliGame.active || !isMusicPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      const freq = bassNotes[noteIndex % bassNotes.length];
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);

      noteIndex++;
    } catch (e) {}
  }, 180);
}

function stopGameMusic() {
  isMusicPlaying = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

function startQuantumMusic() {
  initAudioContext();
  if (isMusicPlaying) return;
  isMusicPlaying = true;

  let noteIndex = 0;
  const synthArp = [130.81, 164.81, 196.00, 246.94, 261.63, 329.63, 392.00, 493.88];

  quantumMusicInterval = setInterval(() => {
    if (!quantumGame.active || !isMusicPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      const freq = synthArp[noteIndex % synthArp.length];
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);

      noteIndex++;
    } catch (e) {}
  }, 120);
}

function stopQuantumMusic() {
  isMusicPlaying = false;
  if (quantumMusicInterval) {
    clearInterval(quantumMusicInterval);
    quantumMusicInterval = null;
  }
}

function playWooshSound() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch(e) {}
}

function playBonusPopupSound() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch(e) {}
}

function playQuantumPickupSound() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch(e) {}
}


// ==========================================================================
// COPTER CASH - REBUILT HD & ANIMATED TOURNAMENT ENGINE
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // 2X Bigger Helicopter Dimensions (Toy Style)
  x: 70,
  y: 200,
  targetY: 200,
  width: 104, // 2x Bigger Size
  height: 56, // 2x Bigger Size
  hitboxW: 80,
  hitboxH: 42,
  
  // Improved Smooth Tilt Physics (-15 deg to +15 deg)
  gravity: 0.35,
  velocity: 0,
  jumpVelocity: -7.0,
  maxFallSpeed: 9.0,
  angle: 0,
  rotorFrame: 0,
  hoverTime: 0,
  
  // Pillars & Spacing
  pipes: [],
  pipeWidth: 64,
  pipeGap: 210, // Increased gap for 2x Helicopter scale balance
  basePipeSpeed: 2.8,
  currentPipeSpeed: 2.8,
  pipeSpacing: 280,
  groundHeight: 90,
  groundOffset: 0,
  
  // Parallax Slow Moving Clouds
  clouds: [
    { x: 30, y: 45, speed: 0.3, scale: 1.1 },
    { x: 220, y: 85, speed: 0.5, scale: 0.8 },
    { x: 420, y: 35, speed: 0.2, scale: 1.3 },
    { x: 620, y: 95, speed: 0.4, scale: 0.9 }
  ],
  
  distanceMeters: 0,
  bonusPoints: 0,
  bestScore: 0,
  shakeTime: 0,
  particles: [],
  popups: []
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  const handleInteraction = (e) => {
    e.preventDefault();
    if (appState.activeGameType === 'daily') triggerHeliJump();
  };

  canvas.addEventListener("touchstart", handleInteraction, { passive: false });
  canvas.addEventListener("mousedown", handleInteraction);

  window.addEventListener("keydown", (e) => {
    const gameModal = document.getElementById("gameScreenModal");
    if (e.code === "Space" && gameModal && !gameModal.classList.contains("hidden")) {
      e.preventDefault();
      if (appState.activeGameType === 'daily') triggerHeliJump();
    }
  });
}

function triggerHeliJump() {
  if (!heliGame.active) return;
  heliGame.velocity = heliGame.jumpVelocity;
  playWooshSound();

  // Spawn Dust Particles at tail engine when tapping/moving
  spawnDustParticles(heliGame.x + 10, heliGame.y + 35, 6);
}

function spawnDustParticles(x, y, count) {
  for (let i = 0; i < count; i++) {
    heliGame.particles.push({
      x: x,
      y: y,
      vx: -Math.random() * 3.5 - 1.5,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 4 + 2,
      color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.4})`,
      alpha: 1.0,
      isDust: true
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

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2;
  heliGame.targetY = heliGame.y;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.particles = [];
  heliGame.popups = [];
  heliGame.distanceMeters = 0;
  heliGame.bonusPoints = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.shakeTime = 0;
  heliGame.hoverTime = 0;
  
  drawHeliStaticPreview();
}

function drawHeliStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  heliGame.hoverTime += 0.05;
  const bobbing = Math.sin(heliGame.hoverTime * 3) * 5;

  renderRebuiltBackground(ctx, canvas.width, canvas.height);
  render3DGround(ctx, canvas.width, canvas.height);
  draw3DToyHelicopter(ctx, heliGame.x, heliGame.y + bobbing, 0, Math.floor(Date.now() / 40) % 3);
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2;
  heliGame.targetY = heliGame.y;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.particles = [];
  heliGame.popups = [];
  heliGame.distanceMeters = 0;
  heliGame.bonusPoints = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.shakeTime = 0;
  heliGame.active = true;
  heliGame.lastTime = performance.now();

  startGameMusic();

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

  // Helicopter Physics Tuning
  heliGame.velocity += heliGame.gravity;
  if (heliGame.velocity > heliGame.maxFallSpeed) {
    heliGame.velocity = heliGame.maxFallSpeed;
  }
  
  heliGame.y += heliGame.velocity;

  // Smooth Tilt (-15 deg to +15 deg limit)
  if (heliGame.velocity < 0) {
    heliGame.angle = Math.max(-15, heliGame.angle - 4.5);
  } else {
    heliGame.angle = Math.min(15, heliGame.angle + 2.5);
  }

  heliGame.distanceMeters += 1;
  heliGame.rotorFrame = Math.floor(Date.now() / 30) % 3;

  // Ambient slight exhaust dust while moving
  if (Math.random() < 0.35) {
    spawnDustParticles(heliGame.x + 8, heliGame.y + 32, 1);
  }

  // Speed increases slightly over distance
  const speedTier = Math.floor(heliGame.distanceMeters / 2000);
  heliGame.currentPipeSpeed = Math.min(6.5, heliGame.basePipeSpeed + (speedTier * 0.3));

  heliGame.groundOffset = (heliGame.groundOffset + heliGame.currentPipeSpeed) % 24;
  
  // Parallax Moving Clouds
  heliGame.clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
    if (cloud.x < -160) cloud.x = canvas.width + 100;
  });

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

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

  if (heliGame.pipes.length === 0) {
    spawnPipe(canvas.width + 100);
  } else {
    const lastPipe = heliGame.pipes[heliGame.pipes.length - 1];
    if (canvas.width - lastPipe.x >= heliGame.pipeSpacing) {
      spawnPipe(canvas.width);
    }
  }

  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.currentPipeSpeed;

    const topPipeBox = { x: p.x, y: 0, w: heliGame.pipeWidth, h: p.topHeight };
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY };

    // Check collision
    if (checkAABBCollision(heliHitbox, topPipeBox) || checkAABBCollision(heliHitbox, bottomPipeBox)) {
      triggerCollisionEffects();
      return;
    }

    // Close-Call Bonus Check
    if (!p.closeCallTriggered && (p.x + heliGame.pipeWidth < heliGame.x)) {
      p.closeCallTriggered = true;
      const topDist = Math.abs(heliHitbox.y - p.topHeight);
      const bottomDist = Math.abs((heliHitbox.y + heliHitbox.h) - p.bottomY);

      if (topDist < 35 || bottomDist < 35) {
        heliGame.bonusPoints += 100;
        playBonusPopupSound();
        spawnPopupText(heliGame.x + 30, heliGame.y - 15, "+100");
      }
    }
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth) {
    heliGame.pipes.shift();
  }

  // Update Particles (Dust & Explosion)
  for (let i = heliGame.particles.length - 1; i >= 0; i--) {
    const pt = heliGame.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    if (pt.isDust) {
      pt.radius += 0.15; // Dust expands slightly
      pt.alpha -= 0.035;
    } else {
      pt.vy += 0.15;
      pt.alpha -= 0.025;
    }
    if (pt.alpha <= 0) heliGame.particles.splice(i, 1);
  }

  // Update Floating Popups
  for (let i = heliGame.popups.length - 1; i >= 0; i--) {
    const pop = heliGame.popups[i];
    pop.y -= 1.2;
    pop.alpha -= 0.02;
    if (pop.alpha <= 0) heliGame.popups.splice(i, 1);
  }
}

function spawnPipe(startX) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;
  const minHeight = 70;
  const maxHeight = playableHeight - heliGame.pipeGap - minHeight;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

  heliGame.pipes.push({
    x: startX,
    topHeight: topHeight,
    bottomY: topHeight + heliGame.pipeGap,
    closeCallTriggered: false
  });
}

function spawnPopupText(x, y, text) {
  heliGame.popups.push({
    x: x,
    y: y,
    text: text,
    alpha: 1.0
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
    const dx = (Math.random() - 0.5) * 10;
    const dy = (Math.random() - 0.5) * 10;
    ctx.translate(dx, dy);
  }

  renderRebuiltBackground(ctx, canvas.width, canvas.height);
  render3DGlossyPipes(ctx, canvas.height);
  render3DGround(ctx, canvas.width, canvas.height);
  renderParticles(ctx);

  if (heliGame.active) {
    draw3DToyHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame);
  }

  renderPopups(ctx);
  updateLiveScoreHUD();

  ctx.restore();
}

function updateLiveScoreHUD() {
  const scoreText = document.getElementById("liveScoreText");
  if (scoreText) {
    scoreText.innerText = `${heliGame.distanceMeters + heliGame.bonusPoints}m`;
  }
}

// 1. REBUILD: Gradient Background + Parallax 3D Clouds + Detailed City Skyline
function renderRebuiltBackground(ctx, w, h) {
  // Vibrant Vertical Gradient #2A9DFF top to #A8DDFF bottom
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#2A9DFF");
  skyGrad.addColorStop(1, "#A8DDFF");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // 4. City Skyline: Detailed Faded Blue Skyline #B0D4F1 at bottom (40% opacity)
  ctx.save();
  ctx.fillStyle = "#B0D4F1";
  ctx.globalAlpha = 0.40;
  
  const groundY = h - heliGame.groundHeight;
  const cityBuildingHeights = [120, 80, 160, 110, 180, 95, 140, 70, 150];
  let currentX = 0;
  let idx = 0;
  
  while (currentX < w) {
    const bw = 46;
    const bh = cityBuildingHeights[idx % cityBuildingHeights.length];
    
    // Draw Building Silhouette
    ctx.fillRect(currentX, groundY - bh, bw, bh);
    
    // Architectural Windows Details on skyline
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let wy = groundY - bh + 12; wy < groundY - 15; wy += 20) {
      for (let wx = currentX + 6; wx < currentX + bw - 10; wx += 12) {
        ctx.fillRect(wx, wy, 6, 10);
      }
    }
    ctx.fillStyle = "#B0D4F1";

    currentX += bw + 8;
    idx++;
  }
  ctx.restore();

  // 1. Add 4 Big 3D Fluffy Clouds with Drop Shadow
  heliGame.clouds.forEach(c => {
    draw3DFluffyCloud(ctx, c.x, c.y, c.scale);
  });
}

function draw3DFluffyCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Soft Cloud Drop Shadow
  ctx.shadowColor = "rgba(10, 40, 90, 0.25)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(0, 0, 24, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(24, -18, 28, Math.PI * 0.9, Math.PI * 1.85);
  ctx.arc(56, -10, 22, Math.PI * 1.3, Math.PI * 1.95);
  ctx.arc(72, 0, 22, Math.PI * 1.5, Math.PI * 0.5);
  ctx.moveTo(72, 24);
  ctx.lineTo(0, 24);
  ctx.closePath();
  ctx.fill();

  // Inner 3D Gradient Overlay
  ctx.shadowColor = "transparent";
  const cloudShade = ctx.createLinearGradient(0, -20, 0, 24);
  cloudShade.addColorStop(0, "rgba(255, 255, 255, 1)");
  cloudShade.addColorStop(1, "rgba(215, 235, 255, 0.85)");
  ctx.fillStyle = cloudShade;
  ctx.fill();

  ctx.restore();
}

// 2. REBUILD: Pipes Glossy 3D #5AC25A with White Shine Line (8px) & Double Cap Rings
function render3DGlossyPipes(ctx, canvasHeight) {
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawGlossyPipePillar(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomHeight = (canvasHeight - heliGame.groundHeight) - p.bottomY;
    drawGlossyPipePillar(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomHeight, false);
  }
}

function drawGlossyPipePillar(ctx, x, y, width, height, isTop) {
  if (height <= 0) return;

  // Glossy Base Body Gradient #5AC25A
  const bodyGrad = ctx.createLinearGradient(x, 0, x + width, 0);
  bodyGrad.addColorStop(0, "#388E3C");
  bodyGrad.addColorStop(0.25, "#5AC25A");
  bodyGrad.addColorStop(0.7, "#A1EEA1");
  bodyGrad.addColorStop(1, "#2E7D32");

  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x, y, width, height);

  // Left Side 8px Glossy White Shine Line
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillRect(x + 6, y, 8, height);

  // Inner Shadow for Depth
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(x + width - 8, y, 8, height);

  // Double Cap Rings
  const capH1 = 18;
  const capH2 = 10;
  const overhang = 5;
  const capX = x - overhang;
  const capW = width + (overhang * 2);

  const capY1 = isTop ? y + height - capH1 : y;
  const capY2 = isTop ? y + height - capH1 - capH2 - 2 : y + capH1 + 2;

  // Render Primary Cap Ring
  drawSingleCapRing(ctx, capX, capY1, capW, capH1);
  // Render Secondary Double Cap Ring
  drawSingleCapRing(ctx, capX + 2, capY2, capW - 4, capH2);
}

function drawSingleCapRing(ctx, capX, capY, capW, capH) {
  const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
  capGrad.addColorStop(0, "#2E7D32");
  capGrad.addColorStop(0.3, "#5AC25A");
  capGrad.addColorStop(0.75, "#FFFFFF");
  capGrad.addColorStop(1, "#1B5E20");

  ctx.fillStyle = capGrad;
  ctx.fillRect(capX, capY, capW, capH);

  // Cap Rim Highlights
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(capX + 6, capY, 6, capH);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(capX, capY, capW, capH);
}

// 5. REBUILD: Ground - Grass #6BCB4B with 3D Blades + Brown Wood Planks #8B5A2B Grain
function render3DGround(ctx, width, height) {
  const groundY = height - heliGame.groundHeight;

  // Grass Layer #6BCB4B
  ctx.fillStyle = "#6BCB4B";
  ctx.fillRect(0, groundY, width, 18);

  // 3D Grass Blades Texture
  ctx.fillStyle = "#4CAF50";
  for (let gx = -heliGame.groundOffset; gx < width + 20; gx += 10) {
    ctx.beginPath();
    ctx.moveTo(gx, groundY + 18);
    ctx.lineTo(gx + 4, groundY - 4);
    ctx.lineTo(gx + 8, groundY + 18);
    ctx.fill();
  }

  // Brown Wood Planks #8B5A2B Base
  const woodY = groundY + 18;
  const woodH = heliGame.groundHeight - 18;
  
  const woodGrad = ctx.createLinearGradient(0, woodY, 0, woodY + woodH);
  woodGrad.addColorStop(0, "#8B5A2B");
  woodGrad.addColorStop(1, "#5D3A1A");
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, woodY, width, woodH);

  // Wooden Grain Lines Texture
  ctx.strokeStyle = "rgba(60, 30, 10, 0.4)";
  ctx.lineWidth = 2;
  for (let wy = woodY + 10; wy < height; wy += 14) {
    ctx.beginPath();
    ctx.moveTo(0, wy);
    ctx.lineTo(width, wy);
    ctx.stroke();
  }

  // Plank Seams
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  ctx.lineWidth = 3;
  for (let lx = -heliGame.groundOffset; lx < width + 60; lx += 48) {
    ctx.beginPath();
    ctx.moveTo(lx, woodY);
    ctx.lineTo(lx, woodY + woodH);
    ctx.stroke();
  }
}

// 3. REBUILD: 2x Bigger 3D Toy Style Yellow-Orange Helicopter (#FFA726), Reflective Glass (#4FC3F7), Rotor Blur
function draw3DToyHelicopter(ctx, x, y, angleDeg, rotorFrame) {
  ctx.save();
  // Anchor Point Centered for 2x Helicopter (104x56)
  ctx.translate(x + 52, y + 28);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Landing Gear / Skids
  ctx.strokeStyle = "#212121";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-24, 26); ctx.lineTo(-12, 16);
  ctx.moveTo(20, 26); ctx.lineTo(28, 16);
  ctx.moveTo(-36, 26); ctx.lineTo(44, 26);
  ctx.stroke();

  // Tail Boom & Rear Rotor
  const tailGrad = ctx.createLinearGradient(-64, -8, -24, 8);
  tailGrad.addColorStop(0, "#FF9800");
  tailGrad.addColorStop(1, "#FFA726");
  ctx.fillStyle = tailGrad;
  ctx.fillRect(-64, -8, 40, 16);

  ctx.fillStyle = "#E65100";
  ctx.beginPath();
  ctx.moveTo(-64, -8);
  ctx.lineTo(-76, -24);
  ctx.lineTo(-60, -8);
  ctx.fill();

  // Tail Spin Disc
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.ellipse(-70, -16, 12, 4, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Main 3D Toy Yellow-Orange Body #FFA726
  const bodyGrad = ctx.createRadialGradient(12, -4, 6, 0, 0, 44);
  bodyGrad.addColorStop(0, "#FFE082");
  bodyGrad.addColorStop(0.5, "#FFA726");
  bodyGrad.addColorStop(1, "#FB8C00");

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(6, 0, 44, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#E65100";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Blue Glass Window #4FC3F7 Reflective
  const glassGrad = ctx.createLinearGradient(16, -16, 40, 12);
  glassGrad.addColorStop(0, "#E0F7FA");
  glassGrad.addColorStop(0.4, "#4FC3F7");
  glassGrad.addColorStop(1, "#0288D1");

  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.arc(22, -2, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Reflective Glass Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(26, -6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Top Rotor Shaft
  ctx.fillStyle = "#37474F";
  ctx.fillRect(0, -36, 10, 10);

  // Spinning Blur Disc on Top Rotor (Opacity 0.3)
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.beginPath();
  ctx.ellipse(5, -38, 65, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Blade Motion Effect Lines
  ctx.fillStyle = "rgba(33, 33, 33, 0.8)";
  if (rotorFrame === 0) {
    ctx.fillRect(-55, -39, 120, 5);
  } else if (rotorFrame === 1) {
    ctx.fillRect(-35, -39, 80, 5);
  } else {
    ctx.fillRect(-60, -39, 130, 4);
  }

  ctx.restore();
}

function renderParticles(ctx) {
  heliGame.particles.forEach(pt => {
    ctx.fillStyle = pt.color || `rgba(255, 167, 38, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderPopups(ctx) {
  heliGame.popups.forEach(pop => {
    ctx.save();
    ctx.font = "900 22px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
    ctx.fillStyle = `rgba(52, 199, 89, ${pop.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  });
}

// Particle Explosion Animation on Crash
function triggerCollisionEffects() {
  heliGame.active = false;
  stopGameMusic();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  heliGame.shakeTime = 180;
  heliGame.particles = [];

  const crashColors = ["#ff3b30", "#ffa726", "#ffcc00", "#4fc3f7", "#212121", "#ffffff"];

  for (let i = 0; i < 45; i++) {
    heliGame.particles.push({
      x: heliGame.x + 52,
      y: heliGame.y + 28,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.6) * 14,
      radius: 3 + Math.random() * 6,
      color: crashColors[Math.floor(Math.random() * crashColors.length)],
      alpha: 1.0,
      isDust: false
    });
  }

  renderHeliGameCanvas();

  setTimeout(() => {
    handleHeliCrash();
  }, 250);
}

function handleHeliCrash() {
  const finalDistanceScore = heliGame.distanceMeters + heliGame.bonusPoints;
  appState.currentRunScore = finalDistanceScore;
  appState.dailyScore += finalDistanceScore;

  if (finalDistanceScore > heliGame.bestScore) {
    heliGame.bestScore = finalDistanceScore;
  }

  const modalTitleEl = document.querySelector("#gameOverOverlay h2");
  if (modalTitleEl) modalTitleEl.innerText = "🚁 COPTER CRASHED!";

  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  
  if (runScoreEl) runScoreEl.innerText = `${finalDistanceScore}m`;
  if (dailyTotalEl) dailyTotalEl.innerText = `Daily Total: ${appState.dailyScore}m (Best: ${heliGame.bestScore}m)`;

  updateLeaderboardWithUserScore();
  document.getElementById("gameOverOverlay")?.classList.remove("hidden");
}


// ==========================================================================
// QUANTUM RUSH 3D - MONTHLY PREMIUM CHAMPIONSHIP ENGINE
// ==========================================================================
const quantumGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,

  x: 80,
  y: 200,
  targetY: 200,
  width: 50,
  height: 24,
  speedY: 0.15,
  tilt: 0,
  
  shieldActive: false,
  shieldTime: 0,
  nitroActive: false,
  nitroTime: 0,
  scoreMultiplier: 1,
  multiplierTime: 0,

  distance: 0,
  score: 0,
  bestScore: 0,
  speed: 6.0,
  baseSpeed: 6.0,
  
  cyberGates: [],
  gems: [],
  particles: [],
  stars: [],
  shakeTime: 0,
  gridOffset: 0
};

function initQuantumGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;

  const handleInteraction = (e) => {
    if (!quantumGame.active || appState.activeGameType !== 'monthly') return;
    const rect = canvas.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    quantumGame.targetY = clientY - rect.top;
  };

  canvas.addEventListener("mousemove", handleInteraction);
  canvas.addEventListener("mousedown", handleInteraction);
  canvas.addEventListener("touchmove", handleInteraction, { passive: true });
  canvas.addEventListener("touchstart", handleInteraction, { passive: true });
}

function resetQuantumGameUI() {
  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  if (!canvas) return;

  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  quantumGame.x = 80;
  quantumGame.y = canvas.height / 2;
  quantumGame.targetY = quantumGame.y;
  quantumGame.distance = 0;
  quantumGame.score = 0;
  quantumGame.speed = quantumGame.baseSpeed;
  quantumGame.cyberGates = [];
  quantumGame.gems = [];
  quantumGame.particles = [];
  quantumGame.stars = [];
  quantumGame.shieldActive = false;
  quantumGame.nitroActive = false;
  quantumGame.scoreMultiplier = 1;
  quantumGame.shakeTime = 0;

  for (let i = 0; i < 60; i++) {
    quantumGame.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1
    });
  }

  drawQuantumStaticPreview();
}

function drawQuantumStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  renderCyberpunkBackground(ctx, canvas.width, canvas.height);
  drawQuantumJet(ctx, quantumGame.x, canvas.height / 2, 0);
}

function startQuantumGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  quantumGame.x = 80;
  quantumGame.y = canvas.height / 2;
  quantumGame.targetY = quantumGame.y;
  quantumGame.distance = 0;
  quantumGame.score = 0;
  quantumGame.speed = quantumGame.baseSpeed;
  quantumGame.cyberGates = [];
  quantumGame.gems = [];
  quantumGame.particles = [];
  quantumGame.shieldActive = false;
  quantumGame.nitroActive = false;
  quantumGame.scoreMultiplier = 1;
  quantumGame.shakeTime = 0;
  quantumGame.active = true;
  quantumGame.lastTime = performance.now();

  startQuantumMusic();

  if (quantumGame.loopId) cancelAnimationFrame(quantumGame.loopId);
  quantumGameLoop(performance.now());
}

function quantumGameLoop(now) {
  if (!quantumGame.active) return;

  const dt = Math.min((now - quantumGame.lastTime) / 1000, 0.033);
  quantumGame.lastTime = now;

  updateQuantumPhysics(dt);
  renderQuantumCanvas();

  quantumGame.loopId = requestAnimationFrame(quantumGameLoop);
}

function updateQuantumPhysics(dt) {
  const canvas = heliGame.canvas;

  const dy = quantumGame.targetY - quantumGame.y;
  quantumGame.y += dy * 0.12;
  quantumGame.tilt = Math.max(-25, Math.min(25, dy * 0.8));

  quantumGame.y = Math.max(30, Math.min(canvas.height - 30, quantumGame.y));

  if (quantumGame.shieldTime > 0) {
    quantumGame.shieldTime -= dt;
    if (quantumGame.shieldTime <= 0) quantumGame.shieldActive = false;
  }

  if (quantumGame.nitroTime > 0) {
    quantumGame.nitroTime -= dt;
    quantumGame.speed = quantumGame.baseSpeed * 1.8;
    if (quantumGame.nitroTime <= 0) {
      quantumGame.nitroActive = false;
      quantumGame.speed = quantumGame.baseSpeed;
    }
  }

  if (quantumGame.multiplierTime > 0) {
    quantumGame.multiplierTime -= dt;
    if (quantumGame.multiplierTime <= 0) quantumGame.scoreMultiplier = 1;
  }

  quantumGame.distance += Math.round(quantumGame.speed * 0.5);
  quantumGame.score += Math.round(quantumGame.speed * 0.2 * quantumGame.scoreMultiplier);

  quantumGame.baseSpeed = Math.min(12.0, 6.0 + (quantumGame.distance / 2000));

  quantumGame.gridOffset = (quantumGame.gridOffset + quantumGame.speed) % 40;
  quantumGame.stars.forEach(s => {
    s.x -= s.speed * (quantumGame.speed / 4);
    if (s.x < 0) s.x = canvas.width;
  });

  if (quantumGame.cyberGates.length === 0) {
    spawnCyberGate(canvas.width + 250, canvas.height);
  } else if (canvas.width - quantumGame.cyberGates[quantumGame.cyberGates.length - 1].x >= 280) {
    spawnCyberGate(canvas.width, canvas.height);
  }

  const jetBox = { x: quantumGame.x, y: quantumGame.y - 10, w: quantumGame.width, h: quantumGame.height };

  for (let i = quantumGame.cyberGates.length - 1; i >= 0; i--) {
    const gate = quantumGame.cyberGates[i];
    gate.x -= quantumGame.speed;

    if (gate.isMoving) {
      gate.gapY += Math.sin(Date.now() / 200) * 2;
    }

    const topGateBox = { x: gate.x, y: 0, w: gate.width, h: gate.gapY };
    const bottomGateBox = { x: gate.x, y: gate.gapY + gate.gapH, w: gate.width, h: canvas.height - (gate.gapY + gate.gapH) };

    if (!quantumGame.nitroActive && (checkAABBCollision(jetBox, topGateBox) || checkAABBCollision(jetBox, bottomGateBox))) {
      if (quantumGame.shieldActive) {
        quantumGame.shieldActive = false;
        quantumGame.shieldTime = 0;
        quantumGame.shakeTime = 150;
        quantumGame.cyberGates.splice(i, 1);
        playQuantumPickupSound();
      } else {
        triggerQuantumCrash();
        return;
      }
    }

    if (gate.x < -gate.width) quantumGame.cyberGates.splice(i, 1);
  }

  if (Math.random() < 0.02) {
    spawnQuantumGem(canvas.width, canvas.height);
  }

  for (let i = quantumGame.gems.length - 1; i >= 0; i--) {
    const gem = quantumGame.gems[i];
    gem.x -= quantumGame.speed;

    const gemBox = { x: gem.x - 12, y: gem.y - 12, w: 24, h: 24 };
    if (checkAABBCollision(jetBox, gemBox)) {
      applyQuantumPowerup(gem.type);
      quantumGame.gems.splice(i, 1);
      playQuantumPickupSound();
    } else if (gem.x < -30) {
      quantumGame.gems.splice(i, 1);
    }
  }

  for (let i = quantumGame.particles.length - 1; i >= 0; i--) {
    const pt = quantumGame.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.alpha -= 0.03;
    if (pt.alpha <= 0) quantumGame.particles.splice(i, 1);
  }
}

function spawnCyberGate(w, h) {
  const gapH = 140;
  const minTop = 50;
  const maxTop = h - gapH - 50;
  const gapY = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  quantumGame.cyberGates.push({
    x: w,
    width: 36,
    gapY: gapY,
    gapH: gapH,
    isMoving: Math.random() > 0.6
  });
}

function spawnQuantumGem(w, h) {
  const types = ['shield', 'nitro', 'multiplier'];
  const type = types[Math.floor(Math.random() * types.length)];
  quantumGame.gems.push({
    x: w,
    y: Math.random() * (h - 100) + 50,
    type: type
  });
}

function applyQuantumPowerup(type) {
  if (type === 'shield') {
    quantumGame.shieldActive = true;
    quantumGame.shieldTime = 6.0;
  } else if (type === 'nitro') {
    quantumGame.nitroActive = true;
    quantumGame.nitroTime = 4.0;
    quantumGame.shakeTime = 80;
  } else if (type === 'multiplier') {
    quantumGame.scoreMultiplier = 2;
    quantumGame.multiplierTime = 8.0;
  }
}

function renderQuantumCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  ctx.save();

  if (quantumGame.shakeTime > 0) {
    quantumGame.shakeTime -= 16;
    ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  }

  renderCyberpunkBackground(ctx, canvas.width, canvas.height);
  renderCyberGates(ctx, canvas.height);
  renderGems(ctx);
  drawQuantumJet(ctx, quantumGame.x, quantumGame.y, quantumGame.tilt);
  renderQuantumParticles(ctx);
  
  // Quantum Live Score Update
  const scoreText = document.getElementById("liveScoreText");
  if (scoreText) scoreText.innerText = `${quantumGame.score} PTS`;

  ctx.restore();
}

function renderCyberpunkBackground(ctx, w, h) {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#080014");
  bgGrad.addColorStop(0.5, "#0f0026");
  bgGrad.addColorStop(1, "#1d0047");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  quantumGame.stars.forEach(s => {
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  ctx.strokeStyle = "rgba(255, 0, 128, 0.35)";
  ctx.lineWidth = 1.5;
  const floorY = h - 40;

  for (let x = -quantumGame.gridOffset; x < w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, floorY);
    ctx.lineTo(x - 20, h);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(w, floorY);
  ctx.stroke();
}

function renderCyberGates(ctx, canvasHeight) {
  quantumGame.cyberGates.forEach(gate => {
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f0ff";
    ctx.fillStyle = "#00f0ff";

    ctx.fillRect(gate.x, 0, gate.width, gate.gapY);
    ctx.fillRect(gate.x, gate.gapY + gate.gapH, gate.width, canvasHeight - (gate.gapY + gate.gapH));

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(gate.x - 2, gate.gapY - 6, gate.width + 4, 6);
    ctx.fillRect(gate.x - 2, gate.gapY + gate.gapH, gate.width + 4, 6);

    ctx.shadowBlur = 0;
  });
}

function renderGems(ctx) {
  quantumGame.gems.forEach(gem => {
    ctx.save();
    ctx.translate(gem.x, gem.y);

    ctx.shadowBlur = 12;
    if (gem.type === 'shield') {
      ctx.shadowColor = '#00ffcc';
      ctx.fillStyle = '#00ffcc';
    } else if (gem.type === 'nitro') {
      ctx.shadowColor = '#ffea00';
      ctx.fillStyle = '#ffea00';
    } else {
      ctx.shadowColor = '#ff007f';
      ctx.fillStyle = '#ff007f';
    }

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

function drawQuantumJet(ctx, x, y, tilt) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((tilt * Math.PI) / 180);

  ctx.shadowBlur = 20;
  ctx.shadowColor = "#ff007f";

  ctx.fillStyle = quantumGame.nitroActive ? "#ffea00" : "#ff007f";
  ctx.beginPath();
  ctx.moveTo(-25, 0);
  ctx.lineTo(-45 - Math.random() * 10, -6);
  ctx.lineTo(-45 - Math.random() * 10, 6);
  ctx.closePath();
  ctx.fill();

  const jetGrad = ctx.createLinearGradient(-20, -10, 25, 10);
  jetGrad.addColorStop(0, "#2b0054");
  jetGrad.addColorStop(0.5, "#00f0ff");
  jetGrad.addColorStop(1, "#ffffff");

  ctx.fillStyle = jetGrad;
  ctx.beginPath();
  ctx.moveTo(25, 0);
  ctx.lineTo(-15, -12);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-15, 12);
  ctx.closePath();
  ctx.fill();

  if (quantumGame.shieldActive) {
    ctx.strokeStyle = "rgba(0, 255, 204, 0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(2, 0, 28, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function renderQuantumParticles(ctx) {
  quantumGame.particles.forEach(pt => {
    ctx.fillStyle = `rgba(255, 0, 128, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function triggerQuantumCrash() {
  quantumGame.active = false;
  stopQuantumMusic();
  if (quantumGame.loopId) cancelAnimationFrame(quantumGame.loopId);

  quantumGame.shakeTime = 150;

  for (let i = 0; i < 20; i++) {
    quantumGame.particles.push({
      x: quantumGame.x,
      y: quantumGame.y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius: Math.random() * 5 + 2,
      alpha: 1.0
    });
  }

  renderQuantumCanvas();

  setTimeout(() => {
    handleQuantumCrash();
  }, 200);
}

function handleQuantumCrash() {
  appState.currentRunScore = quantumGame.score;
  appState.monthlyScore += quantumGame.score;

  if (quantumGame.score > quantumGame.bestScore) {
    quantumGame.bestScore = quantumGame.score;
  }

  const modalTitleEl = document.querySelector("#gameOverOverlay h2");
  if (modalTitleEl) modalTitleEl.innerText = "⚡ QUANTUM RUSH CRASHED!";

  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");

  if (runScoreEl) runScoreEl.innerText = `${appState.currentRunScore} PTS`;
  if (dailyTotalEl) dailyTotalEl.innerText = `Monthly Total: ${appState.monthlyScore} PTS (Best: ${quantumGame.bestScore} PTS)`;

  updateLeaderboardWithUserScore();
  document.getElementById("gameOverOverlay")?.classList.remove("hidden");
}

function updateLeaderboardWithUserScore() {
  if (!appState.currentUser) return;

  const scoreToAdd = appState.activeGameType === 'daily' ? appState.dailyScore : appState.monthlyScore;
  
  const isDaily = appState.activeGameType === 'daily';
  const targetData = isDaily ? lbDailyData : lbWeeklyData;

  const existingIdx = targetData.findIndex(item => item.name === appState.currentUser.name);
  if (existingIdx !== -1) {
    targetData[existingIdx].score = scoreToAdd;
  } else {
    targetData.push({
      rank: targetData.length + 1,
      name: appState.currentUser.name,
      score: scoreToAdd
    });
  }

  targetData.sort((a, b) => b.score - a.score);
  targetData.forEach((item, index) => item.rank = index + 1);

  switchLeaderboard(isDaily ? 'daily' : 'weekly');
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
        <div style="font-size: 0.72rem; color: #8e8e93; font-weight: 800;">YOUR CURRENT STANDING (${type.toUpperCase()})</div>
        <div style="font-size: 0.95rem; font-weight: 800; color: #1c1c1e;">${appState.currentUser ? appState.currentUser.name : 'Guest User'}</div>
      </div>
      <div style="font-size: 1.1rem; font-weight: 800; color: #0071e3;">
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
          <p style="font-size: 0.82rem; color: #6e6e73; margin-bottom: 10px;">Log in to access your Payout Wallet and Link UPI.</p>
          <button class="glass-btn primary-btn" onclick="openAuthModal('login')">LOG IN NOW</button>
        </div>
      `;
    }
    return;
  }

  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="glass-card" style="padding: 16px; margin-bottom: 16px; text-align: left;">
        <div style="font-size: 0.72rem; color: #8e8e93; font-weight: 800;">ACCOUNT HOLDER</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #1c1c1e; margin-bottom: 4px;">${appState.currentUser.name}</div>
        <div style="font-size: 0.8rem; color: #6e6e73;">${appState.currentUser.email}</div>
      </div>
    `;
  }

  if (upiDisplay) {
    if (appState.currentUser.upi) {
      upiDisplay.innerHTML = `<span style="color: #34c759">🟢 ${appState.currentUser.upi}</span>`;
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

