/* ==========================================================================
   WIN2EARN - FULL PLATFORM ENGINE & OPTIMIZED HELI DASH GAME
   ========================================================================== */

// --- Global App State ---
const AppState = {
  currentUser: null,
  activeTab: 'home',
  activeLbType: 'daily', // 'daily' or 'weekly'
  generatedOtp: null,
  activeTournamentMode: 'daily', // 'daily' or 'monthly'
  tickerData: [
    { name: "Rahul S.", amount: "₹100" },
    { name: "Aman K.", amount: "₹100" },
    { name: "Priya M.", amount: "₹100" },
    { name: "Vikram R.", amount: "₹100" },
    { name: "Sneha P.", amount: "₹100" },
    { name: "Rohan V.", amount: "₹100" }
  ],
  dummyLeaderboard: [
    { rank: 1, name: "Arjun Verma", score: 4820 },
    { rank: 2, name: "Karan Sharma", score: 4210 },
    { rank: 3, name: "Neha Gupta", score: 3950 },
    { rank: 4, name: "Rohan Mehta", score: 3600 },
    { rank: 5, name: "Suresh Kumar", score: 3100 },
    { rank: 6, name: "Pooja Singh", score: 2850 },
    { rank: 7, name: "Amit Patel", score: 2400 },
    { rank: 8, name: "Divya Joshi", score: 2100 },
    { rank: 9, name: "Manish Kumar", score: 1850 },
    { rank: 10, name: "Sanjay Reddy", score: 1500 }
  ],
  userScores: {
    dailyTotal: 0,
    monthlyTotal: 0,
    dailyHigh: 0,
    monthlyHigh: 0
  }
};

// --- DOM Elements ---
let canvas, ctx;

// --- App Initialization ---
window.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  loadStoredUser();
  renderTicker();
  setupCanvas();
  setupEventListeners();
  renderLeaderboard();
  renderAlerts();
});

// Hide Splash Screen after initial load
function initSplashScreen() {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      document.body.classList.remove('no-scroll');
    }, 2000);
  }
}

// User Storage Management
function loadStoredUser() {
  const stored = localStorage.getItem('win2earn_user');
  if (stored) {
    try {
      AppState.currentUser = JSON.parse(stored);
      updateAuthUI();
    } catch (e) {
      console.error('Failed to parse stored user data', e);
    }
  }
  const scores = localStorage.getItem('win2earn_scores');
  if (scores) {
    try {
      AppState.userScores = JSON.parse(scores);
    } catch (e) {
      console.error('Failed to parse saved scores', e);
    }
  }
}

function saveScores() {
  localStorage.setItem('win2earn_scores', JSON.stringify(AppState.userScores));
}

// Update Nav & Profile UI upon auth status
function updateAuthUI() {
  const navAuth = document.getElementById('navAuthBtns');
  const megaBanner = document.getElementById('megaBannerCard');
  
  if (AppState.currentUser) {
    if (navAuth) {
      navAuth.innerHTML = `
        <button class="glass-btn secondary-btn" onclick="handleLogout()">Logout</button>
      `;
    }
    if (megaBanner) {
      megaBanner.classList.add('hidden');
    }
  } else {
    if (navAuth) {
      navAuth.innerHTML = `
        <button class="glass-btn secondary-btn" onclick="openAuthModal('login')">Log In</button>
        <button class="glass-btn primary-btn" onclick="openAuthModal('signup')">Sign Up</button>
      `;
    }
    if (megaBanner) {
      megaBanner.classList.remove('hidden');
    }
  }
  renderProfileWallet();
}

// Render Header Ticker
function renderTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  
  let html = '';
  AppState.tickerData.forEach(item => {
    html += `<div class="ticker-item">🏆 <strong>${item.name}</strong> won <span>${item.amount}</span></div>`;
  });
  // Duplicate items for infinite seamless scroll
  track.innerHTML = html + html;
}

// Global Nav & Tab Switcher
function handleNavClick(e, tabId) {
  if (e) e.preventDefault();
  AppState.activeTab = tabId;
  
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const activeEl = document.getElementById(`tab-${tabId}`);
  if (activeEl) activeEl.classList.remove('hidden');
  
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => btn.classList.remove('active'));
  const activeNavBtn = document.querySelector(`.bottom-nav .nav-item[onclick*="'${tabId}'"]`);
  if (activeNavBtn) activeNavBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Modals Controller ---
function showPopup(msg) {
  const popup = document.getElementById('errorPopup');
  const msgEl = document.getElementById('popupMessage');
  if (msgEl) msgEl.innerText = msg;
  if (popup) popup.classList.remove('hidden');
}

function closePopup() {
  const popup = document.getElementById('errorPopup');
  if (popup) popup.classList.add('hidden');
}

function openAuthModal(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('hidden');
    switchTab(tab);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
}

function switchTab(tab) {
  const loginF = document.getElementById('loginForm');
  const signupF = document.getElementById('signupForm');
  if (tab === 'login') {
    if (loginF) loginF.classList.remove('hidden');
    if (signupF) signupF.classList.add('hidden');
  } else {
    if (loginF) loginF.classList.add('hidden');
    if (signupF) signupF.classList.remove('hidden');
  }
}

function sendOtp() {
  const mob = document.getElementById('signupMobile')?.value;
  if (!mob || mob.length < 10) {
    showPopup('Please enter a valid 10-digit mobile number to receive OTP.');
    return;
  }
  AppState.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const msgEl = document.getElementById('otpPopupMessage');
  if (msgEl) msgEl.innerText = `Your Win2Earn Verification Code is: ${AppState.generatedOtp}`;
  const modal = document.getElementById('otpDisplayModal');
  if (modal) modal.classList.remove('hidden');
}

function closeOtpModal() {
  const modal = document.getElementById('otpDisplayModal');
  if (modal) modal.classList.add('hidden');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail')?.value;
  AppState.currentUser = {
    name: email.split('@')[0],
    email: email,
    upi: ''
  };
  localStorage.setItem('win2earn_user', JSON.stringify(AppState.currentUser));
  updateAuthUI();
  closeAuthModal();
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName')?.value;
  const email = document.getElementById('signupEmail')?.value;
  const otp = document.getElementById('signupOtp')?.value;
  const pass = document.getElementById('signupPassword')?.value;
  const confirm = document.getElementById('signupConfirmPassword')?.value;

  if (otp !== AppState.generatedOtp) {
    showPopup('Invalid OTP. Please check the code and try again.');
    return;
  }
  if (pass !== confirm) {
    showPopup('Passwords do not match.');
    return;
  }

  AppState.currentUser = { name, email, upi: '' };
  localStorage.setItem('win2earn_user', JSON.stringify(AppState.currentUser));
  updateAuthUI();
  closeAuthModal();

  const welcomeName = document.getElementById('welcomeUserName');
  if (welcomeName) welcomeName.innerText = `Welcome, ${name}!`;
  const welcomeM = document.getElementById('welcomeModal');
  if (welcomeM) welcomeM.classList.remove('hidden');
}

function handleLogout() {
  AppState.currentUser = null;
  localStorage.removeItem('win2earn_user');
  updateAuthUI();
  handleNavClick(null, 'home');
}

function handleWelcomePlay() {
  const welcomeM = document.getElementById('welcomeModal');
  if (welcomeM) welcomeM.classList.add('hidden');
  handleGameLaunch('daily');
}

// Payout Info Modal
function openPayoutInfoModal() {
  document.getElementById('payoutInfoModal')?.classList.remove('hidden');
}
function closePayoutInfoModal() {
  document.getElementById('payoutInfoModal')?.classList.add('hidden');
}

// Important Info Modal
function openInfoModal() {
  document.getElementById('infoModal')?.classList.remove('hidden');
}
function closeInfoModal() {
  document.getElementById('infoModal')?.classList.add('hidden');
}

// Telegram Modal
function openTelegramModal() {
  document.getElementById('telegramModal')?.classList.remove('hidden');
}
function closeTelegramModal() {
  document.getElementById('telegramModal')?.classList.add('hidden');
}

// Wallet Modal
function openWalletModal() {
  document.getElementById('walletActivationModal')?.classList.remove('hidden');
}
function closeWalletModal() {
  document.getElementById('walletActivationModal')?.classList.add('hidden');
}

function activateWallet(e) {
  e.preventDefault();
  const upi = document.getElementById('upiInput')?.value;
  if (!upi || !upi.includes('@')) {
    showPopup('Please enter a valid UPI ID (e.g. name@upi)');
    return;
  }
  if (AppState.currentUser) {
    AppState.currentUser.upi = upi;
    localStorage.setItem('win2earn_user', JSON.stringify(AppState.currentUser));
    renderProfileWallet();
    closeWalletModal();
  }
}

// Legal Information Modal
function openLegalModal(type) {
  const title = document.getElementById('legalModalTitle');
  const body = document.getElementById('legalModalBody');
  const modal = document.getElementById('legalModal');
  if (!modal || !title || !body) return;

  if (type === 'privacy') {
    title.innerText = "Privacy Policy";
    body.innerHTML = `
      <h4>1. Data Protection</h4>
      <p>We do not sell or leak user personal details. Your information is stored strictly for managing game accounts and prize distributions.</p>
      <h4>2. Safe & Secure</h4>
      <p>No financial information or passwords are held on public servers. UPI details are solely used for direct prize transfers.</p>
    `;
  } else if (type === 'terms') {
    title.innerText = "Terms & Conditions";
    body.innerHTML = `
      <h4>1. 100% Free Skill Gaming</h4>
      <p>Win2Earn does NOT charge entry fees or deposit money. It is completely free to participate.</p>
      <h4>2. Fair Play Policy</h4>
      <p>Any attempt to manipulate scores using bots or scripts will lead to instant account termination.</p>
    `;
  } else {
    title.innerText = "Community Guidelines";
    body.innerHTML = `
      <h4>1. Respect & Integrity</h4>
      <p>Maintain healthy sportsmanship across tournaments and public updates.</p>
      <h4>2. Zero Tolerance</h4>
      <p>Hate speech, abusive behaviour, or cheating will result in immediate permanent bans.</p>
    `;
  }
  modal.classList.remove('hidden');
}

function closeLegalModal() {
  document.getElementById('legalModal')?.classList.add('hidden');
}

// --- Wallet & Profile Renderer ---
function renderProfileWallet() {
  const profileBox = document.getElementById('profileDetailsContainer');
  const upiDisplay = document.getElementById('walletUpiDisplay');
  const txList = document.getElementById('txList');

  if (AppState.currentUser) {
    if (profileBox) {
      profileBox.innerHTML = `
        <div class="glass-card" style="padding:16px; margin-bottom:16px; text-align:left;">
          <h3 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin-bottom:4px;">${AppState.currentUser.name}</h3>
          <p style="font-size:0.8rem; color:var(--text-secondary);">${AppState.currentUser.email}</p>
        </div>
      `;
    }
    if (upiDisplay) {
      if (AppState.currentUser.upi) {
        upiDisplay.innerText = AppState.currentUser.upi;
        upiDisplay.style.color = "var(--accent-green)";
      } else {
        upiDisplay.innerHTML = `<button class="glass-btn primary-btn" onclick="openWalletModal()" style="font-size:0.8rem; padding:8px 16px;">+ Link UPI ID</button>`;
      }
    }
  } else {
    if (profileBox) {
      profileBox.innerHTML = `
        <div class="glass-card" style="padding:16px; margin-bottom:16px; text-align:center;">
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:10px;">Please log in to view wallet & link your UPI ID.</p>
          <button class="glass-btn primary-btn" onclick="openAuthModal('login')">Log In Now</button>
        </div>
      `;
    }
    if (upiDisplay) upiDisplay.innerText = "Not Activated";
  }

  if (txList) {
    txList.innerHTML = `
      <div class="tx-item">
        <div>
          <div class="tx-title">Daily Tournament Reward</div>
          <div class="tx-date">Yesterday, 10:00 PM</div>
        </div>
        <div class="tx-amount">+ ₹100.00</div>
      </div>
    `;
  }
}

// --- Leaderboard & Alerts ---
function switchLeaderboard(type) {
  AppState.activeLbType = type;
  const btnD = document.getElementById('btnDailyLb');
  const btnW = document.getElementById('btnWeeklyLb');
  if (type === 'daily') {
    btnD?.classList.add('active');
    btnW?.classList.remove('active');
  } else {
    btnW?.classList.add('active');
    btnD?.classList.remove('active');
  }
  renderLeaderboard();
}

function renderLeaderboard() {
  const container = document.getElementById('lbList');
  const userRankBox = document.getElementById('userRankCard');
  if (!container) return;

  let html = '';
  AppState.dummyLeaderboard.forEach(item => {
    let rankClass = '';
    if (item.rank === 1) rankClass = 'top1';
    else if (item.rank === 2) rankClass = 'top2';
    else if (item.rank === 3) rankClass = 'top3';

    html += `
      <div class="lb-row">
        <span class="lb-rank ${rankClass}">#${item.rank}</span>
        <span class="lb-name">${item.name}</span>
        <span class="lb-score">${item.score} pts</span>
      </div>
    `;
  });
  container.innerHTML = html;

  if (userRankBox) {
    const currentScore = AppState.activeLbType === 'daily' ? AppState.userScores.dailyTotal : AppState.userScores.monthlyTotal;
    userRankBox.innerHTML = `
      <div style="text-align:left;">
        <span style="font-size:0.72rem; color:var(--text-muted); font-weight:800;">YOUR CURRENT STANDING</span>
        <div style="font-size:0.95rem; font-weight:800; color:var(--text-primary); margin-top:2px;">
          ${AppState.currentUser ? AppState.currentUser.name : 'Guest User'}
        </div>
      </div>
      <div style="text-align:right;">
        <span style="font-size:0.72rem; color:var(--text-muted); font-weight:800;">COMBINED SCORE</span>
        <div style="font-size:1.1rem; font-weight:900; color:var(--accent-cyan);">${currentScore} pts</div>
      </div>
    `;
  }
}

function renderAlerts() {
  const feed = document.getElementById('alertsFeed');
  if (!feed) return;
  feed.innerHTML = `
    <div class="alert-card glass-card">
      <div class="alert-time">5 MINS AGO</div>
      <div class="alert-title">🚀 Daily Tournament is LIVE!</div>
      <div class="alert-desc">Fly high in Heli Dash! Daily top 10 players will receive ₹100 rewards directly in their wallet.</div>
    </div>
    <div class="alert-card glass-card">
      <div class="alert-time">2 HOURS AGO</div>
      <div class="alert-title">👑 Monthly Grand Pool Active</div>
      <div class="alert-desc">50% of monthly platform revenue will be shared among top 100 leaderboard rankers.</div>
    </div>
  `;
}

// --- Dynamic Launching Handler ---
function handleGameLaunch(mode = 'daily') {
  if (!AppState.currentUser) {
    openAuthModal('login');
    return;
  }
  
  AppState.activeTournamentMode = mode;
  
  const headerTitle = document.querySelector('.game-header-title');
  if (headerTitle) {
    if (mode === 'monthly') {
      headerTitle.innerText = "👑 Monthly Grand Championship - Heli Dash";
    } else {
      headerTitle.innerText = "🚁 Heli Dash - Daily Tournament";
    }
  }

  const modal = document.getElementById('gameScreenModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    
    // Ensure geometry is settled before canvas setup
    requestAnimationFrame(() => {
      setupCanvas();
      resetHeliGameState();
    });
  }
}

function closeGameScreen() {
  stopGameLoop();
  const modal = document.getElementById('gameScreenModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

/* ==========================================================================
   ROBUST & ACCURATE CANVAS ENGINE: HELI DASH HD
   ========================================================================== */

let gameLoopId = null;
let isGameRunning = false;
let score = 0;

// Game physics scaling constants
const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;

const heli = {
  x: 50,
  y: 300,
  width: 38,
  height: 24,
  gravity: 0.38,
  lift: -7.5,
  velocity: 0
};

let obstacles = [];
let obstacleTimer = 0;
let obstacleFrequency = 110; // frames between obstacles

function setupCanvas() {
  canvas = document.getElementById('heliCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();

  // Handle High DPI Screens cleanly
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', () => {
  if (document.getElementById('gameScreenModal') && !document.getElementById('gameScreenModal').classList.contains('hidden')) {
    setupCanvas();
  }
});

function setupEventListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (document.getElementById('gameScreenModal') && !document.getElementById('gameScreenModal').classList.contains('hidden')) {
        e.preventDefault();
        triggerHeliJump();
      }
    }
  });

  const canvasStage = document.getElementById('heliCanvas');
  if (canvasStage) {
    canvasStage.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerHeliJump();
    }, { passive: false });

    canvasStage.addEventListener('mousedown', (e) => {
      e.preventDefault();
      triggerHeliJump();
    });
  }
}

function triggerHeliJump() {
  if (isGameRunning) {
    heli.velocity = heli.lift;
  }
}

function resetHeliGameState() {
  stopGameLoop();
  score = 0;
  
  const container = canvas ? canvas.parentElement : null;
  const h = container ? container.getBoundingClientRect().height : GAME_HEIGHT;
  
  heli.x = 60;
  heli.y = h / 2;
  heli.velocity = 0;
  obstacles = [];
  obstacleTimer = 0;

  document.getElementById('gameHudContainer').style.display = 'none';
  document.getElementById('gameStartOverlay').classList.remove('hidden');
  document.getElementById('gameOverOverlay').classList.add('hidden');
  
  // Render clean initial state frame
  drawGameFrame();
}

function startHeliGame() {
  resetHeliGameState();
  document.getElementById('gameStartOverlay').classList.add('hidden');
  document.getElementById('gameOverOverlay').classList.add('hidden');
  document.getElementById('gameHudContainer').style.display = 'block';

  document.getElementById('liveScoreText').innerText = "0";

  isGameRunning = true;
  lastTime = performance.now();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
  isGameRunning = false;
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }
}

let lastTime = 0;
function gameLoop(time) {
  if (!isGameRunning) return;

  updateGameLogic();
  drawGameFrame();

  gameLoopId = requestAnimationFrame(gameLoop);
}

function updateGameLogic() {
  const container = canvas.parentElement;
  const stageWidth = container.getBoundingClientRect().width;
  const stageHeight = container.getBoundingClientRect().height;

  // Apply Physics
  heli.velocity += heli.gravity;
  heli.y += heli.velocity;

  // Check Boundary Collisions (Top & Bottom)
  if (heli.y + heli.height >= stageHeight || heli.y <= 0) {
    triggerGameOver();
    return;
  }

  // Handle Obstacles Spawning
  obstacleTimer++;
  if (obstacleTimer % obstacleFrequency === 0) {
    const gapHeight = 160; // Fair gap height for responsive devices
    const minPipe = 60;
    const maxPipe = stageHeight - gapHeight - minPipe;
    const topPipeHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;

    obstacles.push({
      x: stageWidth,
      topHeight: topPipeHeight,
      bottomY: topPipeHeight + gapHeight,
      width: 52,
      passed: false
    });
  }

  // Update Obstacles Movement
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= 2.6; // Smooth, precise speed

    // Check Score Increment
    if (!obs.passed && obs.x + obs.width < heli.x) {
      obs.passed = true;
      score += 10;
      document.getElementById('liveScoreText').innerText = score;
    }

    // Check AABB Box Collision
    if (
      heli.x < obs.x + obs.width &&
      heli.x + heli.width > obs.x &&
      (heli.y < obs.topHeight || heli.y + heli.height > obs.bottomY)
    ) {
      triggerGameOver();
      return;
    }

    // Remove Off-screen Obstacles
    if (obs.x + obs.width < -10) {
      obstacles.splice(i, 1);
    }
  }
}

function drawGameFrame() {
  if (!ctx || !canvas) return;

  const container = canvas.parentElement;
  const stageWidth = container.getBoundingClientRect().width;
  const stageHeight = container.getBoundingClientRect().height;

  // 1. Draw Vibrant Sky Background
  ctx.fillStyle = '#2ec1cc';
  ctx.fillRect(0, 0, stageWidth, stageHeight);

  // Background Cloud Details
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();
  ctx.arc(80, 100, 30, 0, Math.PI * 2);
  ctx.arc(110, 90, 40, 0, Math.PI * 2);
  ctx.arc(140, 100, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(260, 220, 25, 0, Math.PI * 2);
  ctx.arc(285, 210, 35, 0, Math.PI * 2);
  ctx.arc(310, 220, 25, 0, Math.PI * 2);
  ctx.fill();

  // 2. Draw Metallic Pipe Obstacles
  obstacles.forEach(obs => {
    ctx.fillStyle = '#1e293b'; // Main Metallic Body
    
    // Top Pipe
    ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
    ctx.fillStyle = '#0f172a'; // Pipe Cap Highlight
    ctx.fillRect(obs.x - 4, obs.topHeight - 18, obs.width + 8, 18);

    // Bottom Pipe
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(obs.x, obs.bottomY, obs.width, stageHeight - obs.bottomY);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(obs.x - 4, obs.bottomY, obs.width + 8, 18);
  });

  // 3. Draw Helicopter (Vector Style)
  ctx.save();
  ctx.translate(heli.x + heli.width / 2, heli.y + heli.height / 2);
  
  // Dynamic rotation based on velocity
  let rotation = Math.min(Math.max(heli.velocity * 0.05, -0.4), 0.5);
  ctx.rotate(rotation);

  // Fuselage (Body)
  ctx.fillStyle = '#0071e3';
  ctx.beginPath();
  ctx.roundRect(-heli.width / 2, -heli.height / 2, heli.width, heli.height, 8);
  ctx.fill();

  // Glass Window
  ctx.fillStyle = '#bae6fd';
  ctx.beginPath();
  ctx.roundRect(4, -heli.height / 2 + 3, 11, 10, 3);
  ctx.fill();

  // Main Rotor Propeller Blade
  ctx.fillStyle = '#334155';
  ctx.fillRect(-heli.width / 2 - 4, -heli.height / 2 - 4, heli.width + 8, 3);
  ctx.fillRect(-2, -heli.height / 2 - 2, 4, 3);

  // Tail Rotor
  ctx.fillRect(-heli.width / 2 - 8, -4, 8, 4);

  ctx.restore();
}

function triggerGameOver() {
  stopGameLoop();

  // Update Scores State based on current Mode
  if (AppState.activeTournamentMode === 'monthly') {
    AppState.userScores.monthlyTotal += score;
    if (score > AppState.userScores.monthlyHigh) AppState.userScores.monthlyHigh = score;
  } else {
    AppState.userScores.dailyTotal += score;
    if (score > AppState.userScores.dailyHigh) AppState.userScores.dailyHigh = score;
  }
  saveScores();
  renderLeaderboard();

  // Display Scores in Modal Overlays
  document.getElementById('currentRunScore').innerText = score;
  const currentTotal = AppState.activeTournamentMode === 'monthly' ? AppState.userScores.monthlyTotal : AppState.userScores.dailyTotal;
  document.getElementById('dailyTotalScoreDisplay').innerText = `${currentTotal} pts`;

  document.getElementById('gameHudContainer').style.display = 'none';
  document.getElementById('gameOverOverlay').classList.remove('hidden');
}

