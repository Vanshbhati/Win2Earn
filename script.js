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
// COPTER CASH - DAILY TOURNAMENT ENGINE (UPDATED)
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  // Bigger Helicopter Dimensions
  x: 70,
  y: 200,
  targetY: 200,
  width: 52,
  height: 28,
  hitboxW: 40,
  hitboxH: 22,
  
  // Improved Physics
  gravity: 0.34,
  velocity: 0,
  jumpVelocity: -6.5,
  maxFallSpeed: 8.5,
  angle: 0,
  rotorFrame: 0,
  hoverTime: 0,
  
  // Speed & Slower Gameplay Tuning
  pipes: [],
  pipeWidth: 50,
  pipeGap: 175,
  basePipeSpeed: 2.8,       // Slower starting speed
  currentPipeSpeed: 2.8,
  pipeSpacing: 240,
  groundHeight: 85,
  groundOffset: 0,
  
  clouds: [
    { x: 20, y: 40, speed: 0.5, scale: 0.9 },
    { x: 180, y: 80, speed: 0.8, scale: 0.7 },
    { x: 320, y: 30, speed: 0.4, scale: 1.1 }
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
  const bobbing = Math.sin(heliGame.hoverTime * 3) * 4;

  renderBackground(ctx, canvas.width, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  drawAttractiveHelicopter(ctx, heliGame.x, heliGame.y + bobbing, 0, Math.floor(Date.now() / 50) % 3);
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

  if (heliGame.velocity < 0) {
    heliGame.angle = Math.max(-18, heliGame.angle - 3.5);
  } else {
    heliGame.angle = Math.min(22, heliGame.angle + 2.0);
  }

  heliGame.distanceMeters += 1;
  heliGame.rotorFrame = Math.floor(Date.now() / 40) % 3;

  // Speed increases every 2000 Meters
  const speedTier = Math.floor(heliGame.distanceMeters / 2000);
  heliGame.currentPipeSpeed = Math.min(6.5, heliGame.basePipeSpeed + (speedTier * 0.3));

  heliGame.groundOffset = (heliGame.groundOffset + heliGame.currentPipeSpeed) % 24;
  heliGame.clouds.forEach(cloud => {
    cloud.x -= cloud.speed;
    if (cloud.x < -100) cloud.x = canvas.width + 50;
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

    // Near Pass / Close-Call Bonus Check (+100 meters/score popup)
    if (!p.closeCallTriggered && (p.x + heliGame.pipeWidth < heliGame.x)) {
      p.closeCallTriggered = true;
      const topDist = Math.abs(heliHitbox.y - p.topHeight);
      const bottomDist = Math.abs((heliHitbox.y + heliHitbox.h) - p.bottomY);

      if (topDist < 30 || bottomDist < 30) {
        heliGame.bonusPoints += 100;
        playBonusPopupSound();
        spawnPopupText(heliGame.x + 20, heliGame.y - 10, "+100");
      }
    }
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth) {
    heliGame.pipes.shift();
  }

  // Update Particles
  for (let i = heliGame.particles.length - 1; i >= 0; i--) {
    const pt = heliGame.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vy += 0.15; // Gravity on particles
    pt.alpha -= 0.025;
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
  const minHeight = 60;
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

  renderBackground(ctx, canvas.width, canvas.height);
  renderPipes(ctx, canvas.height);
  renderGround(ctx, canvas.width, canvas.height);
  
  if (heliGame.active) {
    drawAttractiveHelicopter(ctx, heliGame.x, heliGame.y, -heliGame.angle, heliGame.rotorFrame);
  }

  renderParticles(ctx);
  renderPopups(ctx);
  renderSubwayStyleMeterUI(ctx, canvas.width);

  ctx.restore();
}

function renderBackground(ctx, w, h) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#e8f2fc");
  skyGrad.addColorStop(0.6, "#cbe3f9");
  skyGrad.addColorStop(1, "#a8d4ff");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  heliGame.clouds.forEach(c => {
    drawCloud(ctx, c.x, c.y, c.scale);
  });

  const groundY = h - heliGame.groundHeight;

  // Modern Minimal Buildings Sky
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  const buildingHeights = [70, 50, 90, 60, 100, 55, 80];
  let currentX = 0;
  let idx = 0;
  while (currentX < w) {
    const bw = 38;
    const bh = buildingHeights[idx % buildingHeights.length];
    ctx.fillRect(currentX, groundY - bh - 15, bw, bh + 15);
    currentX += bw + 6;
    idx++;
  }

  ctx.fillStyle = "#81c784";
  ctx.fillRect(0, groundY - 15, w, 15);
}

function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 18, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(18, -14, 20, Math.PI * 1, Math.PI * 1.85);
  ctx.arc(40, -8, 16, Math.PI * 1.37, Math.PI * 1.91);
  ctx.arc(52, 0, 16, Math.PI * 1.5, Math.PI * 0.5);
  ctx.moveTo(52, 18);
  ctx.lineTo(0, 18);
  ctx.fill();
  ctx.restore();
}

function renderPipes(ctx, canvasHeight) {
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawThinMetallicPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomHeight = (canvasHeight - heliGame.groundHeight) - p.bottomY;
    drawThinMetallicPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomHeight, false);
  }
}

function drawThinMetallicPipe(ctx, x, y, width, height, isTop) {
  if (height <= 0) return;

  const bodyGrad = ctx.createLinearGradient(x, 0, x + width, 0);
  bodyGrad.addColorStop(0, "#34c759");
  bodyGrad.addColorStop(0.4, "#30d158");
  bodyGrad.addColorStop(0.7, "#a3f7b5");
  bodyGrad.addColorStop(1, "#248a3d");

  ctx.fillStyle = bodyGrad;
  ctx.fillRect(x, y, width, height);
  
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  const capH = 20;
  const overhang = 4;
  const capX = x - overhang;
  const capW = width + (overhang * 2);
  const capY = isTop ? y + height - capH : y;

  const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
  capGrad.addColorStop(0, "#30d158");
  capGrad.addColorStop(0.5, "#d1fada");
  capGrad.addColorStop(1, "#1c6b2e");

  ctx.fillStyle = capGrad;
  ctx.fillRect(capX, capY, capW, capH);
  ctx.strokeRect(capX, capY, capW, capH);
}

function renderGround(ctx, width, height) {
  const groundY = height - heliGame.groundHeight;

  ctx.fillStyle = "#34c759";
  ctx.fillRect(0, groundY, width, 14);
  
  ctx.fillStyle = "#28a745";
  for (let gx = -heliGame.groundOffset; gx < width + 24; gx += 16) {
    ctx.beginPath();
    ctx.arc(gx, groundY + 14, 6, 0, Math.PI);
    ctx.fill();
  }

  const woodY = groundY + 14;
  const woodH = heliGame.groundHeight - 14;
  ctx.fillStyle = "#8e6e53";
  ctx.fillRect(0, woodY, width, woodH);

  ctx.strokeStyle = "#725339";
  ctx.lineWidth = 2;
  for (let lx = -heliGame.groundOffset; lx < width + 40; lx += 32) {
    ctx.beginPath();
    ctx.moveTo(lx, woodY);
    ctx.lineTo(lx + 12, woodY + woodH);
    ctx.stroke();
  }
}

// Bada and Attractive Helicopter Renderer
function drawAttractiveHelicopter(ctx, x, y, angleDeg, rotorFrame) {
  ctx.save();
  ctx.translate(x + 26, y + 14);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Skids (Landing Gear)
  ctx.strokeStyle = "#1c1c1e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-12, 14); ctx.lineTo(-6, 8);
  ctx.moveTo(10, 14); ctx.lineTo(14, 8);
  ctx.moveTo(-18, 14); ctx.lineTo(22, 14);
  ctx.stroke();

  // Tail Rotor Pole & Fins
  const tailGrad = ctx.createLinearGradient(-32, -4, -12, 4);
  tailGrad.addColorStop(0, "#ff9500");
  tailGrad.addColorStop(1, "#ffcc00");
  ctx.fillStyle = tailGrad;
  ctx.fillRect(-32, -4, 20, 8);

  ctx.fillStyle = "#ff3b30";
  ctx.beginPath();
  ctx.moveTo(-32, -4);
  ctx.lineTo(-38, -12);
  ctx.lineTo(-30, -4);
  ctx.fill();

  // Main Helicopter Body Body
  const bodyGrad = ctx.createRadialGradient(6, -2, 3, 0, 0, 22);
  bodyGrad.addColorStop(0, "#ffe600");
  bodyGrad.addColorStop(0.6, "#ff9500");
  bodyGrad.addColorStop(1, "#e65100");

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(3, 0, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3a2500";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glass Cockpit Window
  const glassGrad = ctx.createLinearGradient(8, -8, 20, 6);
  glassGrad.addColorStop(0, "#e0f7fa");
  glassGrad.addColorStop(0.5, "#00e5ff");
  glassGrad.addColorStop(1, "#00838f");

  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.arc(11, -1, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(13, -3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Rotor Shaft
  ctx.fillStyle = "#2c2c2e";
  ctx.fillRect(0, -18, 5, 6);

  // Double Blade Animation
  ctx.fillStyle = "rgba(28, 28, 30, 0.85)";
  if (rotorFrame === 0) {
    ctx.fillRect(-24, -19, 50, 3);
  } else if (rotorFrame === 1) {
    ctx.fillRect(-16, -19, 34, 3);
  } else {
    ctx.fillRect(-26, -19, 54, 2);
  }

  ctx.restore();
}

function renderParticles(ctx) {
  heliGame.particles.forEach(pt => {
    ctx.fillStyle = pt.color || `rgba(255, 149, 0, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderPopups(ctx) {
  heliGame.popups.forEach(pop => {
    ctx.save();
    ctx.font = "900 20px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
    ctx.fillStyle = `rgba(52, 199, 89, ${pop.alpha})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  });
}

// Display ONLY Meters in top right
function renderSubwayStyleMeterUI(ctx, canvasWidth) {
  ctx.save();
  const rightX = canvasWidth - 18;
  const topY = 16;
  const meterText = `${heliGame.distanceMeters}m`;

  ctx.font = "900 26px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  const textMetrics = ctx.measureText(meterText);
  const pillW = Math.max(110, textMetrics.width + 36);
  const pillH = 44;
  const pillX = rightX - pillW;

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeStyle = "rgba(0, 113, 227, 0.4)";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(pillX, topY, pillW, pillH, 22);
  } else {
    ctx.rect(pillX, topY, pillW, pillH);
  }
  ctx.fill();
  ctx.stroke();

  ctx.font = "900 22px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#0071e3";
  ctx.fillText(meterText, pillX + (pillW / 2), topY + (pillH / 2));

  ctx.restore();
}

// Particle Explosion Animation on Crash
function triggerCollisionEffects() {
  heliGame.active = false;
  stopGameMusic();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  heliGame.shakeTime = 150;
  heliGame.particles = [];

  const crashColors = ["#ff3b30", "#ff9500", "#ffcc00", "#00e5ff", "#2c2c2e", "#ffffff"];

  for (let i = 0; i < 35; i++) {
    heliGame.particles.push({
      x: heliGame.x + 26,
      y: heliGame.y + 14,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.6) * 12,
      radius: 2 + Math.random() * 5,
      color: crashColors[Math.floor(Math.random() * crashColors.length)],
      alpha: 1.0
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
  renderQuantumHUD(ctx, canvas.width);

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

function renderQuantumHUD(ctx, canvasWidth) {
  ctx.save();
  const rightX = canvasWidth - 18;
  const topY = 16;
  const scoreText = `SCORE: ${quantumGame.score}`;

  ctx.font = "900 22px 'Plus Jakarta Sans', sans-serif";
  const pillW = 200;
  const pillH = 42;
  const pillX = rightX - pillW;

  ctx.fillStyle = "rgba(15, 0, 38, 0.85)";
  ctx.strokeStyle = "#ff007f";
  ctx.lineWidth = 2;

  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(pillX, topY, pillW, pillH, 12);
  else ctx.rect(pillX, topY, pillW, pillH);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#00f0ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(scoreText, pillX + (pillW / 2), topY + (pillH / 2));

  if (quantumGame.scoreMultiplier > 1) {
    ctx.fillStyle = "#ffea00";
    ctx.font = "900 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("2X MULTIPLIER", pillX + (pillW / 2), topY + pillH + 16);
  }

  ctx.restore();
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

