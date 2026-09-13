/* ==========================================================================
   WIN2EARN - ULTRA ARCADE & SKILL GAMING PLATFORM (ENGINE & SCRIPT)
   ========================================================================== */

// --- GLOBAL GAME & APP STATE ---
let currentUser = null;
let userWallet = { upiId: null, balance: 0, transactions: [] };
let activeTab = 'home';
let activeLeaderboard = 'daily';

// Helicopter Engine State
let heliState = {
  x: 60,
  y: 200,
  velocity: 0,
  gravity: 0.38,
  lift: -7.2,
  width: 42,
  height: 26,
  isAlive: false,
  score: 0,
  highScore: 0,
  dailyTotal: 0
};

let obstacles = [];
let obstacleTimer = 0;
let gameAnimationFrame = null;

// --- INITIALIZATION ON DOM LOAD ---
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initBackgroundCanvas();
  loadDummyWinnersTicker();
  loadLeaderboardData();
  loadActivityAlerts();
  setupInputListeners();
  
  // High-DPI Auto Screen Resize Fix
  window.addEventListener('resize', () => {
    if (heliState.isAlive) {
      setupHeliCanvas();
    }
    initBackgroundCanvas();
  });
});

/* ==========================================================================
   1. SPLASH SCREEN & HD BACKGROUND CANVAS
   ========================================================================== */
function initSplashScreen() {
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        splash.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 400);
    }
  }, 1200);
}

function initBackgroundCanvas() {
  const canvas = document.getElementById('liveHdBgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ==========================================================================
   2. COPTER CASH - ULTRA GAME ENGINE & FIXES
   ========================================================================== */

function setupHeliCanvas() {
  const canvas = document.getElementById('heliCanvas');
  if (!canvas) return null;
  const container = canvas.parentElement;
  
  const dpr = window.devicePixelRatio || 1;
  const rect = container.getBoundingClientRect();

  // Screen resolution calculation fix
  const width = rect.width > 0 ? rect.width : window.innerWidth;
  const height = rect.height > 0 ? rect.height : (window.innerHeight - 60);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, width, height };
}

function handleGameLaunch() {
  const gameModal = document.getElementById('gameScreenModal');
  const startOverlay = document.getElementById('gameStartOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');

  if (gameModal) gameModal.classList.remove('hidden');
  if (startOverlay) startOverlay.classList.remove('hidden');
  if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
  
  document.body.classList.add('no-scroll');
  setupHeliCanvas();
}

function closeGameScreen() {
  heliState.isAlive = false;
  if (gameAnimationFrame) {
    cancelAnimationFrame(gameAnimationFrame);
  }

  const gameModal = document.getElementById('gameScreenModal');
  if (gameModal) gameModal.classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

// Fixed Start Game Loop Function
function startHeliGame() {
  const startOverlay = document.getElementById('gameStartOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  
  if (startOverlay) startOverlay.classList.add('hidden');
  if (gameOverOverlay) gameOverOverlay.classList.add('hidden');

  const engine = setupHeliCanvas();
  if (!engine) return;

  // Clear previous frame loops
  if (gameAnimationFrame) {
    cancelAnimationFrame(gameAnimationFrame);
  }

  // Reseting Helicopter Position to Middle of Canvas
  heliState.y = engine.height / 2;
  heliState.velocity = 0;
  heliState.score = 0;
  heliState.isAlive = true;
  
  obstacles = [];
  obstacleTimer = 0;

  // Reset HUD Elements
  const hudScore = document.getElementById('hudScoreText');
  if (hudScore) hudScore.innerText = "0";

  // Start Fresh Loop
  gameAnimationFrame = requestAnimationFrame(runHeliGameLoop);
}

// Game Loop Rendering
function runHeliGameLoop() {
  const canvas = document.getElementById('heliCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const width = parseFloat(canvas.style.width);
  const height = parseFloat(canvas.style.height);

  if (!heliState.isAlive) return;

  // Clear Screen
  ctx.clearRect(0, 0, width, height);

  // 1. Helicopter Physics Update
  heliState.velocity += heliState.gravity;
  heliState.y += heliState.velocity;

  // Ceiling & Floor Collision Checks (Prevents instant crash)
  if (heliState.y <= 0) {
    heliState.y = 0;
    heliState.velocity = 0;
  }
  
  if (heliState.y + heliState.height >= height) {
    triggerGameOver();
    return;
  }

  // 2. Draw Helicopter (Neon Arcade Style)
  ctx.fillStyle = '#00F0FF';
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 10;
  ctx.fillRect(heliState.x, heliState.y, heliState.width, heliState.height);
  
  // Rotor Blade Details
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(heliState.x - 5, heliState.y - 4, heliState.width + 10, 3);
  ctx.shadowBlur = 0; // Reset Shadow

  // 3. Obstacle Generation & Logic
  obstacleTimer++;
  if (obstacleTimer % 90 === 0) {
    const gap = 130;
    const minHeight = 40;
    const maxHeight = height - gap - minHeight;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    obstacles.push({
      x: width,
      top: topHeight,
      bottom: height - (topHeight + gap),
      width: 45,
      passed: false
    });
  }

  // 4. Update & Draw Obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= 3.2; // Speed

    // Draw Top Pillar
    ctx.fillStyle = '#FF0055';
    ctx.fillRect(obs.x, 0, obs.width, obs.top);

    // Draw Bottom Pillar
    ctx.fillRect(obs.x, height - obs.bottom, obs.width, obs.bottom);

    // Collision Detection
    if (
      heliState.x + heliState.width > obs.x &&
      heliState.x < obs.x + obs.width &&
      (heliState.y < obs.top || heliState.y + heliState.height > height - obs.bottom)
    ) {
      triggerGameOver();
      return;
    }

    // Remove Off-screen Obstacles
    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
    }
  }

  // 5. Update Score
  heliState.score += 0.2;
  const currentScoreDisplay = Math.floor(heliState.score);
  const hudScore = document.getElementById('hudScoreText');
  if (hudScore) hudScore.innerText = currentScoreDisplay;

  gameAnimationFrame = requestAnimationFrame(runHeliGameLoop);
}

function triggerGameOver() {
  heliState.isAlive = false;
  if (gameAnimationFrame) {
    cancelAnimationFrame(gameAnimationFrame);
  }

  const finalRunScore = Math.floor(heliState.score);
  heliState.dailyTotal += finalRunScore;

  // Flash Effect
  const flashOverlay = document.getElementById('gameEffectOverlay');
  if (flashOverlay) {
    flashOverlay.style.background = 'rgba(255, 0, 85, 0.4)';
    setTimeout(() => { flashOverlay.style.background = 'transparent'; }, 150);
  }

  // Set Scores on Crash Modal
  const curScoreElem = document.getElementById('currentRunScore');
  const totalScoreElem = document.getElementById('dailyTotalScoreDisplay');
  
  if (curScoreElem) curScoreElem.innerText = finalRunScore;
  if (totalScoreElem) totalScoreElem.innerText = heliState.dailyTotal;

  // Show Game Over Overlay
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
}

// User Input Listeners for Boost
function triggerBoost() {
  if (heliState.isAlive) {
    heliState.velocity = heliState.lift;
  }
}

function setupInputListeners() {
  // Keypress Spacebar
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      triggerBoost();
    }
  });

  // Touch Screen Boost
  const gameArena = document.getElementById('gameScreenModal');
  if (gameArena) {
    gameArena.addEventListener('touchstart', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        triggerBoost();
      }
    }, { passive: false });
    
    gameArena.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        triggerBoost();
      }
    });
  }
}

/* ==========================================================================
   3. NAVIGATION & TAB SWITCHING
   ========================================================================== */
function handleNavClick(event, tabId) {
  event.preventDefault();
  activeTab = tabId;

  // Update Nav Active State
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Switch Viewports
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.add('hidden'));

  const activeTarget = document.getElementById(`tab-${tabId}`);
  if (activeTarget) activeTarget.classList.remove('hidden');
}

/* ==========================================================================
   4. MODALS & POPUPS MANAGERS
   ========================================================================== */
function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('hidden');
  switchTab(mode);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
}

function switchTab(mode) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (mode === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
  } else {
    if (loginForm) loginForm.classList.add('hidden');
    if (signupForm) signupForm.classList.remove('hidden');
  }
}

function openPayoutInfoModal() {
  document.getElementById('payoutInfoModal')?.classList.remove('hidden');
}
function closePayoutInfoModal() {
  document.getElementById('payoutInfoModal')?.classList.add('hidden');
}

function openComingSoonModal() {
  document.getElementById('comingSoonModal')?.classList.remove('hidden');
}
function closeComingSoonModal() {
  document.getElementById('comingSoonModal')?.classList.add('hidden');
}

function openInfoModal() {
  document.getElementById('infoModal')?.classList.remove('hidden');
}
function closeInfoModal() {
  document.getElementById('infoModal')?.classList.add('hidden');
}

function openTelegramModal() {
  document.getElementById('telegramModal')?.classList.remove('hidden');
}
function closeTelegramModal() {
  document.getElementById('telegramModal')?.classList.add('hidden');
}

function closeOtpModal() {
  document.getElementById('otpDisplayModal')?.classList.add('hidden');
}

function closePopup() {
  document.getElementById('errorPopup')?.classList.add('hidden');
}

function showErrorPopup(msg) {
  const pMsg = document.getElementById('popupMessage');
  if (pMsg) pMsg.innerText = msg;
  document.getElementById('errorPopup')?.classList.remove('hidden');
}

function openLegalModal(type) {
  const title = document.getElementById('legalModalTitle');
  const body = document.getElementById('legalModalBody');
  const modal = document.getElementById('legalModal');

  if (type === 'privacy') {
    title.innerText = "Privacy Policy";
    body.innerHTML = "<p>We respect your privacy. Win2Earn strictly safeguards your contact mobile details and payout UPI handles. Data is never shared with third parties.</p>";
  } else if (type === 'terms') {
    title.innerText = "Terms & Conditions";
    body.innerHTML = "<p>Win2Earn is 100% Free Skill Gaming Platform. No entry fee is required. Malpractices, cheating or multiple accounts will result in permanent ban.</p>";
  } else {
    title.innerText = "Community Guidelines";
    body.innerHTML = "<p>Maintain fair play and sportsmanship. Scores are strictly monitored via our anti-cheat engine.</p>";
  }
  if (modal) modal.classList.remove('hidden');
}

function closeLegalModal() {
  document.getElementById('legalModal')?.classList.add('hidden');
}

/* ==========================================================================
   5. DUMMY DATA & LEADERBOARD RENDERING
   ========================================================================== */
function loadDummyWinnersTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const dummyWinners = [
    "Rahul M. won ₹350 in Daily Tournament",
    "Priya S. won ₹500 in Copter Cash",
    "Amit K. won ₹200 via UPI",
    "Vikram R. won ₹150 in Daily Tournament",
    "Sneha P. won ₹400 via Paytm"
  ];
  
  let html = '';
  dummyWinners.forEach(w => {
    html += `<span class="ticker-item">🎉 ${w}</span>`;
  });
  track.innerHTML = html + html; // Duplicate for smooth continuous scroll
}

function switchLeaderboard(type) {
  activeLeaderboard = type;
  document.getElementById('btnDailyLb')?.classList.toggle('active', type === 'daily');
  document.getElementById('btnWeeklyLb')?.classList.toggle('active', type === 'weekly');
  loadLeaderboardData();
}

function loadLeaderboardData() {
  const lbContainer = document.getElementById('lbList');
  if (!lbContainer) return;

  const dummyData = [
    { rank: 1, name: "Aarav Sharma", score: 8450, reward: "50% Share" },
    { rank: 2, name: "Rohan Verma", score: 7920, reward: "Ad Pool" },
    { rank: 3, name: "Kabir Mehta", score: 7100, reward: "Ad Pool" },
    { rank: 4, name: "Ananya Roy", score: 6850, reward: "Ad Pool" },
    { rank: 5, name: "Siddharth", score: 6200, reward: "Ad Pool" }
  ];

  let html = '';
  dummyData.forEach(item => {
    const isTop3 = item.rank <= 3 ? 'gold-text' : '';
    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-weight:900; font-size:1.1rem;" class="${isTop3}">#${item.rank}</span>
          <div>
            <div style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${item.score} pts</div>
          </div>
        </div>
        <span style="font-size:0.75rem; font-weight:800; color:var(--accent-cyan);">${item.reward}</span>
      </div>
    `;
  });
  lbContainer.innerHTML = html;
}

function loadActivityAlerts() {
  const feed = document.getElementById('alertsFeed');
  if (!feed) return;
  feed.innerHTML = `
    <div class="glass-card" style="padding:12px; font-size:0.82rem; color:var(--text-secondary);">
      🔔 <strong>Tournament Live:</strong> Today's Daily Tournament is now active! Play Copter Cash now.
    </div>
    <div class="glass-card" style="padding:12px; font-size:0.82rem; color:var(--text-secondary);">
      💎 <strong>Daily Payouts:</strong> Winners payout gets calculated tonight at 10:00 PM.
    </div>
  `;
}

/* ==========================================================================
   6. AUTHENTICATION & WALLET HANDLERS
   ========================================================================== */
function sendOtp() {
  const otpMsg = document.getElementById('otpPopupMessage');
  if (otpMsg) otpMsg.innerText = "Your 4-Digit verification OTP code is: 4829";
  document.getElementById('otpDisplayModal')?.classList.remove('hidden');
}

function handleLogin(e) {
  e.preventDefault();
  closeAuthModal();
  currentUser = { name: "Player", email: document.getElementById('loginEmail')?.value };
  updateUserUI();
}

function handleSignup(e) {
  e.preventDefault();
  closeAuthModal();
  currentUser = { name: document.getElementById('signupName')?.value || "Player" };
  updateUserUI();
  document.getElementById('welcomeModal')?.classList.remove('hidden');
}

function handleWelcomePlay() {
  document.getElementById('welcomeModal')?.classList.add('hidden');
  handleGameLaunch();
}

function updateUserUI() {
  const navAuth = document.getElementById('navAuthBtns');
  if (navAuth && currentUser) {
    navAuth.innerHTML = `<span style="font-weight:800; font-size:0.85rem; color:var(--accent-cyan);">👤 ${currentUser.name}</span>`;
  }
}

function activateWallet(e) {
  e.preventDefault();
  const upi = document.getElementById('upiInput')?.value;
  if (upi) {
    userWallet.upiId = upi;
    const upiDisp = document.getElementById('walletUpiDisplay');
    if (upiDisp) upiDisp.innerText = upi;
    document.getElementById('walletActivationModal')?.classList.add('hidden');
    handleGameLaunch();
  }
}

