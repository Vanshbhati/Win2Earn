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

// Splash Screen Logic (6.5s smooth transition)
function initSplashScreen() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.visibility = "hidden";
    document.body.classList.remove("no-scroll");
  }, 6500);
}

// Highly Smooth GPU Animation Ticker
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

// OTP Generation Mock
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

// Handle Login Form Submit
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

// Handle Signup Form Submit
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

// Actions triggered after User Sign-in / Sign-up
function onUserLoggedIn() {
  const megaCard = document.getElementById("megaBannerCard");
  if (megaCard) megaCard.classList.add("hidden");

  const navAuth = document.getElementById("navAuthBtns");
  if (navAuth && appState.currentUser) {
    navAuth.innerHTML = `
      <div class="user-pill-badge" style="background: rgba(245, 197, 24, 0.15); border: 1px solid var(--accent-gold); padding: 6px 14px; border-radius: 12px; color: var(--accent-gold); font-size: 0.8rem; font-weight: 800;">
        👤 ${appState.currentUser.name}
      </div>
    `;
  }
}

function handleWelcomePlay() {
  hideModal("welcomeModal");
  handleNavClick(null, "games");
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

// ==========================================================================
// HELI DASH (FLAPPY HELICOPTER) GAME ENGINE
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  
  // Helicopter Stats
  x: 50,
  y: 150,
  width: 38,
  height: 24,
  gravity: 0.35,
  velocity: 0,
  lift: -6.5,
  
  // Obstacles & World Settings
  pipes: [],
  pipeWidth: 52,
  pipeGap: 130,
  pipeSpeed: 2.2,
  frameCounter: 0,
  currentRunScore: 0
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d");

  // Interaction Bindings (Touch / Click / Key)
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerHeliJump();
  }, { passive: false });

  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    triggerHeliJump();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !document.getElementById("gameScreenModal").classList.contains("hidden")) {
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

function resetHeliGameUI() {
  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  
  const canvas = heliGame.canvas;
  if (!canvas) return;
  canvas.width = canvas.parentElement.clientWidth || 360;
  canvas.height = canvas.parentElement.clientHeight || 540;

  heliGame.y = canvas.height / 2;
  heliGame.velocity = 0;
  heliGame.pipes = [];
  heliGame.frameCounter = 0;
  heliGame.currentRunScore = 0;
  
  drawHeliStaticPreview();
}

function drawHeliStaticPreview() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  if (!ctx || !canvas) return;

  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background Ground
  ctx.fillStyle = "#ded895";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 10);

  // Draw Helicopter
  drawHelicopterSprite(heliGame.x, heliGame.y);
}

function startHeliGame() {
  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  canvas.width = canvas.parentElement.clientWidth || 360;
  canvas.height = canvas.parentElement.clientHeight || 540;

  heliGame.y = canvas.height / 2;
  heliGame.velocity = 0;
  heliGame.pipes = [];
  heliGame.frameCounter = 0;
  heliGame.currentRunScore = 0;
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
  
  // Helicopter Physics
  heliGame.velocity += heliGame.gravity;
  heliGame.y += heliGame.velocity;

  // Floor Collision
  if (heliGame.y + heliGame.height >= canvas.height - 40) {
    heliGame.y = canvas.height - 40 - heliGame.height;
    handleHeliCrash();
    return;
  }

  // Ceiling Collision
  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  // Pipe Spawning
  heliGame.frameCounter++;
  if (heliGame.frameCounter % 100 === 0) {
    const minPipe = 40;
    const maxPipe = canvas.height - 40 - heliGame.pipeGap - minPipe;
    const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;

    heliGame.pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: canvas.height - 40 - (topHeight + heliGame.pipeGap),
      passed: false
    });
  }

  // Pipe Movement & Collision
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.pipeSpeed;

    // Check Score Increment
    if (!p.passed && p.x + heliGame.pipeWidth < heliGame.x) {
      p.passed = true;
      heliGame.currentRunScore += 10;
    }

    // AABB Box Collision
    if (
      heliGame.x + heliGame.width > p.x &&
      heliGame.x < p.x + heliGame.pipeWidth &&
      (heliGame.y < p.top || heliGame.y + heliGame.height > canvas.height - 40 - p.bottom)
    ) {
      handleHeliCrash();
      return;
    }
  }

  // Clean old off-screen pipes
  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth) {
    heliGame.pipes.shift();
  }
}

function renderHeliGameCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;

  // Sky BG
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render Obstacle Pipes
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];

    ctx.fillStyle = "#73bf2e";
    ctx.strokeStyle = "#538021";
    ctx.lineWidth = 3;

    // Top Pipe
    ctx.fillRect(p.x, 0, heliGame.pipeWidth, p.top);
    ctx.strokeRect(p.x, 0, heliGame.pipeWidth, p.top);

    // Bottom Pipe
    const bottomY = canvas.height - 40 - p.bottom;
    ctx.fillRect(p.x, bottomY, heliGame.pipeWidth, p.bottom);
    ctx.strokeRect(p.x, bottomY, heliGame.pipeWidth, p.bottom);
  }

  // Render Ground
  ctx.fillStyle = "#ded895";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 10);

  // Render Helicopter
  drawHelicopterSprite(heliGame.x, heliGame.y);

  // Render Run Score Text
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.font = "800 28px 'Plus Jakarta Sans', sans-serif";
  ctx.strokeText(heliGame.currentRunScore, canvas.width / 2 - 12, 50);
  ctx.fillText(heliGame.currentRunScore, canvas.width / 2 - 12, 50);
}

function drawHelicopterSprite(x, y) {
  const ctx = heliGame.ctx;

  // Helicopter Body
  ctx.fillStyle = "#f5c518";
  ctx.beginPath();
  ctx.ellipse(x + 18, y + 12, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#b38f00";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glass Window
  ctx.fillStyle = "#00d2ff";
  ctx.beginPath();
  ctx.arc(x + 26, y + 10, 6, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.fillStyle = "#f5c518";
  ctx.fillRect(x - 10, y + 9, 12, 5);

  // Rotor Top
  ctx.fillStyle = "#222222";
  ctx.fillRect(x + 6, y - 4, 24, 3);
  ctx.fillRect(x + 16, y - 1, 4, 3);
}

function handleHeliCrash() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  // Cumulative Daily Score Calculation
  appState.currentRunScore = heliGame.currentRunScore;
  appState.dailyScore += heliGame.currentRunScore;

  // Update UI Displays
  const runScoreEl = document.getElementById("currentRunScore");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  
  if (runScoreEl) runScoreEl.innerText = appState.currentRunScore;
  if (dailyTotalEl) dailyTotalEl.innerText = `${appState.dailyScore} pts`;

  // Dynamic Leaderboard Update for Current User
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

  // Sort Leaderboard high to low
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
      <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold);">
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

// Wallet Profile & Payout Handling
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

