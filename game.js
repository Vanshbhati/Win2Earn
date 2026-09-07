const indianNames = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Verma", "Vihaan Gupta", "Arjun Singh",
  "Sai Kumar", "Reyansh Reddy", "Ayaan Joshi", "Krishna Mehta", "Ishaan Bhat",
  "Shaurya Yadava", "Atharva Kulkarni", "Gautam Rao", "Ananya Mishra", "Diya Choudhary",
  "Saanvi Agarwal", "Aadhya Jain", "Pari Saxena", "Kiara Nair", "Riya Das",
  "Anaya Pillai", "Kavya Menon", "Rohan Sethi", "Karan Malhotra", "Dhruv Kapoor"
];

let registeredUsers = [];
let currentUser = null;
let currentTab = 'home';
let currentLbType = 'daily';
let activePlayersCount = 4980;
let generatedOtp = null;
let activeTickerAnimationFrame = null;

const sampleAlerts = [
  {
    time: "2 Hours Ago",
    title: "⚡ Play Now & Claim Rank 1!",
    desc: "The Daily Tournament is live! Compete now to secure Rank 1 and grab your share of the ₹500 prize pool."
  },
  {
    time: "5 Hours Ago",
    title: "🏆 Tournament Victory Alert",
    desc: "Congratulations! You scored 2,450 points in Paper Glide arena. Check leaderboard for your rank update."
  },
  {
    time: "8 Hours Ago",
    title: "💸 Payout Processed Successfully",
    desc: "Your tournament winning reward of ₹50.00 has been transferred directly to your linked UPI ID."
  },
  {
    time: "11 Hours Ago",
    title: "⚔️ Match Outcome Notice",
    desc: "Paper Glide Arena match completed. Hard luck! Practice again to climb back to the top 10."
  }
];

// App Bootstrapper
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('no-scroll');
  
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }, 400);
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, 2200);

  initHardwareAcceleratedTicker();
});

// Counter Fluctuation
function startActivePlayersCounter() {
  setInterval(() => {
    const change = Math.floor(Math.random() * 11) - 5;
    activePlayersCount = Math.max(4800, activePlayersCount + change);
    const counterElem = document.getElementById('activePlayersCount');
    if (counterElem) {
      counterElem.innerText = activePlayersCount.toLocaleString();
    }
  }, 3000);
}

// Protected Route Handler
function handleNavClick(event, tabName) {
  if (event) event.preventDefault();

  if (tabName === 'home') {
    switchTabContent('home');
    if (event) updateActiveNav(event.currentTarget);
    return;
  }

  if (!currentUser) {
    showErrorPopup(`Please Log In or Sign Up first to view ${tabName.toUpperCase()} section.`);
    openAuthModal('signup');
    return;
  }

  switchTabContent(tabName);
  if (event) updateActiveNav(event.currentTarget);
}

function switchTabContent(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const targetTab = document.getElementById(`tab-${tabName}`);
  if (targetTab) targetTab.classList.remove('hidden');

  if (tabName === 'leaderboard') renderLeaderboard();
  if (tabName === 'wallet') renderWalletView();
  if (tabName === 'alerts') renderAlertsFeed();
}

function updateActiveNav(targetElement) {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  if (targetElement) {
    targetElement.classList.add('active');
  }
}

/* =========================================================
   GAME LAUNCHER & game.js INTEGRATION BRIDGE
   ========================================================= */
function handleGameLaunch() {
  if (!currentUser) {
    showErrorPopup('Please Log In or Sign Up first to enter gaming arenas.');
    openAuthModal('signup');
    return;
  }

  if (!currentUser.upiId) {
    showErrorPopup('Please link your UPI ID before entering paid tournament arenas.');
    openWalletModal();
    return;
  }

  openGameArenaView();
}

function openGameArenaView() {
  const gameOverlay = document.getElementById('gameContainerModal') || document.getElementById('fullGameView');
  if (gameOverlay) {
    gameOverlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    
    // Trigger game.js initialization
    if (typeof window.initGame === 'function') {
      window.initGame();
    } else if (typeof window.startGame === 'function') {
      window.startGame();
    }
  } else {
    showErrorPopup('Game Arena is initializing. Please try again in a moment.');
  }
}

function closeGameView() {
  const gameOverlay = document.getElementById('gameContainerModal') || document.getElementById('fullGameView');
  if (gameOverlay) {
    gameOverlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }

  // Safely stop game loops from game.js
  if (typeof window.stopGame === 'function') {
    window.stopGame();
  } else if (typeof window.resetGame === 'function') {
    window.resetGame();
  }

  if (currentTab === 'leaderboard') renderLeaderboard();
}

// Callback invoked by game.js on game over
function onGameOverCallback(finalScore) {
  if (currentUser) {
    if (!currentUser.bestScore || finalScore > currentUser.bestScore) {
      currentUser.bestScore = finalScore;
    }
    
    // Auto-credit reward if milestone reached
    if (finalScore >= 1000) {
      const reward = Math.floor(finalScore / 100);
      currentUser.transactions = currentUser.transactions || [];
      currentUser.transactions.unshift({
        title: "Arena Match Cash Reward",
        date: "Just Now",
        amount: `+ ₹${reward}.00`
      });
    }
  }
}

/* =========================================================
   WALLET OPERATIONS & PROFILE DETAILS
   ========================================================= */
function openWalletModal() {
  const modal = document.getElementById('walletActivationModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closeWalletModal() {
  const modal = document.getElementById('walletActivationModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

function activateWallet(e) {
  if (e) e.preventDefault();
  const upiInput = document.getElementById('upiInput');
  const upiVal = upiInput ? upiInput.value.trim() : '';

  if (!upiVal || !upiVal.includes('@')) {
    showErrorPopup('Please enter a valid UPI ID (e.g. mobile@paytm or user@ybl)');
    return;
  }

  if (currentUser) {
    currentUser.upiId = upiVal;
    currentUser.transactions = currentUser.transactions || [
      { title: "Daily Tournament Win Reward", date: "Today, 10:15 PM", amount: "+ ₹50.00" }
    ];
  }

  closeWalletModal();
  showErrorPopup('✅ Wallet Activated Successfully! Your UPI ID is linked.');
  if (currentTab === 'wallet') renderWalletView();
}

function renderWalletView() {
  const upiDisp = document.getElementById('walletUpiDisplay');
  const txList = document.getElementById('txList');
  const profileContainer = document.getElementById('profileDetailsContainer');

  // Profile Section Render
  if (profileContainer && currentUser) {
    profileContainer.innerHTML = `
      <div class="glass-card profile-info-card">
        <div class="profile-card-title" style="font-size:0.9rem; font-weight:800; margin-bottom:12px; color:var(--accent-cyan);">👤 Account & Profile Info</div>
        <div class="profile-details-grid" style="display:flex; flex-direction:column; gap:8px; font-size:0.82rem; text-align:left;">
          <div class="profile-item" style="display:flex; justify-between; border-bottom:1px solid var(--glass-border); padding-bottom:6px;"><span style="color:var(--text-muted);">Full Name</span><span style="font-weight:700;">${currentUser.name}</span></div>
          <div class="profile-item" style="display:flex; justify-between; border-bottom:1px solid var(--glass-border); padding-bottom:6px;"><span style="color:var(--text-muted);">Mobile</span><span style="font-weight:700;">+91 ${currentUser.mobile}</span></div>
          <div class="profile-item" style="display:flex; justify-between; border-bottom:1px solid var(--glass-border); padding-bottom:6px;"><span style="color:var(--text-muted);">Email ID</span><span style="font-weight:700;">${currentUser.email}</span></div>
          <div class="profile-item" style="display:flex; justify-between;"><span style="color:var(--text-muted);">KYC / Status</span><span style="font-weight:800; color: ${currentUser.upiId ? 'var(--accent-green)' : 'var(--accent-red)'};">${currentUser.upiId ? 'Verified' : 'Pending Activation'}</span></div>
        </div>
      </div>
    `;
  }

  // Wallet Status Render
  if (currentUser && currentUser.upiId) {
    if (upiDisp) {
      upiDisp.innerText = currentUser.upiId;
      upiDisp.style.color = '#10b981';
    }
    
    let txHtml = '';
    const txs = currentUser.transactions || [];
    if (txs.length === 0) {
      txHtml = `<p style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:12px;">No winning payouts yet. Play games to earn!</p>`;
    } else {
      txs.forEach(tx => {
        txHtml += `
          <div class="tx-item">
            <div>
              <div class="tx-title">${tx.title}</div>
              <div class="tx-date">${tx.date}</div>
            </div>
            <div class="tx-amount">${tx.amount}</div>
          </div>
        `;
      });
    }
    if (txList) txList.innerHTML = txHtml;
  } else {
    if (upiDisp) {
      upiDisp.innerText = "Not Activated";
      upiDisp.style.color = '#ef4444';
    }
    if (txList) {
      txList.innerHTML = `
        <div style="text-align:center; padding:16px;">
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">Wallet is inactive. Link UPI ID to view payouts.</p>
          <button class="glass-btn primary-btn" onclick="openWalletModal()">Activate Wallet Now</button>
        </div>
      `;
    }
  }
}

/* =========================================================
   LEADERBOARD SYSTEM
   ========================================================= */
function switchLeaderboard(type) {
  currentLbType = type;
  const btnDaily = document.getElementById('btnDailyLb');
  const btnWeekly = document.getElementById('btnWeeklyLb');
  if (btnDaily) btnDaily.classList.toggle('active', type === 'daily');
  if (btnWeekly) btnWeekly.classList.toggle('active', type === 'weekly');
  renderLeaderboard();
}

function renderLeaderboard() {
  const container = document.getElementById('lbList');
  const userRankCard = document.getElementById('userRankCard');
  
  const multiplier = currentLbType === 'daily' ? 1 : 3.5;
  
  let listHtml = '';
  indianNames.slice(0, 10).forEach((name, idx) => {
    const rank = idx + 1;
    const score = Math.floor((3000 - idx * 210) * multiplier);
    const rankClass = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : '';
    
    listHtml += `
      <div class="lb-row">
        <span class="lb-rank ${rankClass}">#${rank}</span>
        <span class="lb-name">${name}</span>
        <span class="lb-score">${score.toLocaleString()} pts</span>
      </div>
    `;
  });

  if (container) container.innerHTML = listHtml;

  const userScore = currentUser && currentUser.bestScore ? currentUser.bestScore : (currentLbType === 'daily' ? 1420 : 4850);
  const userRank = currentUser && currentUser.bestScore ? 8 : (currentLbType === 'daily' ? 14 : 22);

  if (userRankCard) {
    userRankCard.innerHTML = `
      <div>
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">YOUR LIVE RANK</span>
        <div style="font-size:1rem; font-weight:800; color:var(--text-primary);">${currentUser ? currentUser.name : 'Guest User'}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.1rem; font-weight:900; color:var(--accent-gold);">#${userRank}</div>
        <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:800;">${userScore} pts</div>
      </div>
    `;
  }
}

/* =========================================================
   NOTIFICATIONS & ALERTS FEED
   ========================================================= */
function renderAlertsFeed() {
  const container = document.getElementById('alertsFeed');
  if (!container) return;
  let html = '';
  sampleAlerts.forEach(item => {
    html += `
      <div class="alert-card glass-card">
        <div class="alert-time">${item.time}</div>
        <div class="alert-title">${item.title}</div>
        <div class="alert-desc">${item.desc}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}

/* =========================================================
   AUTHENTICATION LOGIC
   ========================================================= */
function openAuthModal(tab) {
  switchTab(tab);
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  if (tab === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
  } else {
    if (signupForm) signupForm.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
  }
}

function sendOtp() {
  const emailInput = document.getElementById('signupEmail');
  const email = emailInput ? emailInput.value.trim() : '';
  if (!email || !email.includes('@')) {
    return showErrorPopup('Please enter a valid Email Address to receive OTP.');
  }
  generatedOtp = '1234';
  
  const otpMsg = document.getElementById('otpPopupMessage');
  const otpModal = document.getElementById('otpDisplayModal');
  if (otpMsg) otpMsg.innerText = `Verification OTP sent to ${email}.\nYour One-Time Password is: 1234`;
  if (otpModal) {
    otpModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closeOtpModal() {
  const otpModal = document.getElementById('otpDisplayModal');
  if (otpModal) {
    otpModal.classList.add('hidden');
    if (!document.getElementById('authModal') || document.getElementById('authModal').classList.contains('hidden')) {
      document.body.classList.remove('no-scroll');
    }
  }
}

function handleSignup(e) {
  if (e) e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const mobile = document.getElementById('signupMobile').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const otp = document.getElementById('signupOtp').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (!name || name.length < 2) return showErrorPopup('Please enter your full name.');
  if (!mobile || !/^\d{10}$/.test(mobile)) return showErrorPopup('Please enter a valid 10-digit mobile number.');
  if (!email || !email.includes('@') || !email.includes('.')) return showErrorPopup('Please enter a valid email address.');
  
  if (registeredUsers.some(u => u.email === email)) {
    return showErrorPopup('An account with this email already exists. Please Log In.');
  }

  if (!otp || otp !== '1234') return showErrorPopup('Invalid OTP! Please click "Get OTP" and enter 1234.');
  if (!password || password.length < 6) return showErrorPopup('Password must be at least 6 characters long.');
  if (password !== confirmPassword) return showErrorPopup('Passwords do not match. Please verify and try again.');

  const newUser = { name, mobile, email, password, upiId: null, bestScore: 0, transactions: [] };
  registeredUsers.push(newUser);
  currentUser = newUser;

  closeAuthModal();
  setupUserSession();

  const welcomeNameElem = document.getElementById('welcomeUserName');
  if (welcomeNameElem) welcomeNameElem.innerText = `Welcome, ${currentUser.name}!`;
  
  const welcomeModal = document.getElementById('welcomeModal');
  if (welcomeModal) {
    welcomeModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closeWelcomeModal() {
  const welcomeModal = document.getElementById('welcomeModal');
  if (welcomeModal) {
    welcomeModal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

function handleLogin(e) {
  if (e) e.preventDefault();
  
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!email || !password) return showErrorPopup('Please fill in both Email and Password fields.');

  const found = registeredUsers.find(u => u.email === email && u.password === password);
  
  if (!found) return showErrorPopup('Invalid Email or Password. Please check your credentials or Sign Up.');

  currentUser = found;
  closeAuthModal();
  setupUserSession();
}

function setupUserSession() {
  const navAuthBtns = document.getElementById('navAuthBtns');
  if (navAuthBtns) {
    navAuthBtns.innerHTML = `
      <div class="active-players-badge" style="display:flex; align-items:center; gap:6px; font-size:0.75rem; background:rgba(16,185,129,0.12); color:#10b981; padding:6px 12px; border-radius:20px; font-weight:800; border:1px solid rgba(16,185,129,0.3);">
        <span class="active-dot" style="width:6px; height:6px; background:#10b981; border-radius:50%;"></span>
        <span id="activePlayersCount">${activePlayersCount.toLocaleString()}</span> Active
      </div>
    `;
  }

  startActivePlayersCounter();
  switchTabContent('home');
}

/* =========================================================
   INFORMATIONAL & LEGAL MODALS
   ========================================================= */
function openInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closeInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

function openLegalModal(type) {
  const modal = document.getElementById('legalModal');
  const title = document.getElementById('legalModalTitle');
  const body = document.getElementById('legalModalBody');

  if (!modal || !title || !body) return;

  if (type === 'privacy') {
    title.innerText = 'Privacy Policy';
    body.innerHTML = `
      <p>We respect your privacy. Your personal information (Name, Email, Mobile, and UPI ID) is securely stored and processed strictly for authentication and prize distribution.</p>
      <p>We do not share or sell your data to third parties. All financial transactions are protected with industry-standard encryption.</p>
    `;
  } else if (type === 'terms') {
    title.innerText = 'Terms & Conditions';
    body.innerHTML = `
      <p>By using Paper Glide Arena, you agree to comply with game rules and fair competition standards. Any use of bots, exploits, or fraudulent activity will result in immediate ban.</p>
      <p>Tournament rewards are calculated based on verified leaderboard scores at the end of each daily/weekly cycle.</p>
    `;
  } else if (type === 'community') {
    title.innerText = 'Community Guidelines';
    body.innerHTML = `
      <p>Maintain sportsmanship and respect across all platform channels. Harassment, spamming, or fraudulent behavior toward fellow players will lead to permanent account suspension.</p>
    `;
  }

  modal.classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

function openTelegramModal() {
  const modal = document.getElementById('telegramModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closeTelegramModal() {
  const modal = document.getElementById('telegramModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

function showErrorPopup(msg) {
  const msgElem = document.getElementById('popupMessage');
  const popup = document.getElementById('errorPopup');
  if (msgElem) msgElem.innerText = msg;
  if (popup) {
    popup.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closePopup() {
  const popup = document.getElementById('errorPopup');
  if (popup) {
    popup.classList.add('hidden');
    if (!document.getElementById('authModal') || document.getElementById('authModal').classList.contains('hidden')) {
      document.body.classList.remove('no-scroll');
    }
  }
}

/* =========================================================
   TICKER ANIMATION (GPU ACCELERATED)
   ========================================================= */
function initHardwareAcceleratedTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  
  if (activeTickerAnimationFrame) {
    cancelAnimationFrame(activeTickerAnimationFrame);
  }

  let content = '';
  indianNames.forEach(name => {
    content += `<div class="ticker-item">${name} <span class="gold-text">₹5000</span></div>`;
  });
  track.innerHTML = content + content;

  let currentX = 0;
  let lastTime = performance.now();
  
  function step(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    currentX -= 80 * delta;
    if (Math.abs(currentX) >= track.scrollWidth / 2) currentX = 0;
    track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
    activeTickerAnimationFrame = requestAnimationFrame(step);
  }
  
  activeTickerAnimationFrame = requestAnimationFrame(step);
}

