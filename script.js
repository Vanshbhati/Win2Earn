/**
 * Paper Glide Arena - Main Logic Script
 * Apple-inspired sleek dark architecture with secure session management.
 */

const SESSION_KEY = 'pga_user_session';
const LOGIN_TIMESTAMP_KEY = 'pga_login_time';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

let registeredUsers = JSON.parse(localStorage.getItem('pga_registered_users') || '[]');
let currentUser = null;
let currentTab = 'home';
let currentLbType = 'daily';
let activePlayersCount = 4980;
let generatedOtp = null;

// Guaranteed Splash Screen Unlocking & Safe Unmounting
function dismissSplashScreen() {
  const splash = document.getElementById('splashScreen') || document.querySelector('.splash-screen');
  if (splash) {
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    setTimeout(() => {
      splash.classList.add('hidden');
      splash.style.setProperty('display', 'none', 'important');
      document.body.classList.remove('no-scroll');
    }, 500);
  } else {
    document.body.classList.remove('no-scroll');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('no-scroll');
  
  // Check 24-Hour Session Validity
  checkAndRestoreSession();

  // Splash Screen Duration set to match CSS 6.5s animation
  setTimeout(dismissSplashScreen, 6500);

  initHardwareAcceleratedTicker();
});

// Fail-safe load event handler
window.addEventListener('load', () => {
  setTimeout(dismissSplashScreen, 6800);
});

// Session Check (24-Hour Auto Logout)
function checkAndRestoreSession() {
  const savedUser = localStorage.getItem(SESSION_KEY);
  const loginTime = localStorage.getItem(LOGIN_TIMESTAMP_KEY);

  if (savedUser && loginTime) {
    const timeElapsed = Date.now() - parseInt(loginTime, 10);

    if (timeElapsed > TWENTY_FOUR_HOURS) {
      // Session Expired after 24 Hours
      logoutUser(true);
    } else {
      currentUser = JSON.parse(savedUser);
      setupUserSession();
    }
  }
}

function logoutUser(isAutoLogout = false) {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LOGIN_TIMESTAMP_KEY);

  // Reset Nav Header UI
  const navAuthBtns = document.getElementById('navAuthBtns');
  if (navAuthBtns) {
    navAuthBtns.innerHTML = `
      <button class="glass-btn secondary-btn" onclick="openAuthModal('login')">Log In</button>
      <button class="glass-btn primary-btn" onclick="openAuthModal('signup')">Sign Up</button>
    `;
  }

  switchTabContent('home');

  if (isAutoLogout) {
    showErrorPopup('Your session has expired after 24 hours. Please log in again.');
  }
}

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

// Direct Game Launch Flow
function handleGameLaunch() {
  if (!currentUser) {
    showErrorPopup('Please Log In or Sign Up first to enter gaming arenas.');
    openAuthModal('signup');
    return;
  }

  if (!currentUser.upiId) {
    openWalletModal();
    return;
  }

  const gameModal = document.getElementById('gameScreenModal');
  if (gameModal) {
    gameModal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  } else {
    alert('✈️ Paper Glide Arena is loading... Launching game environment!');
  }
}

function closeGameScreen() {
  const gameModal = document.getElementById('gameScreenModal');
  if (gameModal) {
    gameModal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

// Compact Prize Pool Info Modal
function openPayoutInfoModal() {
  const modal = document.getElementById('payoutInfoModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

function closePayoutInfoModal() {
  const modal = document.getElementById('payoutInfoModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }
}

// Wallet Operations & Profile Details
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
    
    // Save updated state to LocalStorage
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    
    // Sync across registered users array
    const idx = registeredUsers.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
      registeredUsers[idx] = currentUser;
      localStorage.setItem('pga_registered_users', JSON.stringify(registeredUsers));
    }
  }

  closeWalletModal();
  if (currentTab === 'wallet') renderWalletView();
}

function renderWalletView() {
  const upiDisp = document.getElementById('walletUpiDisplay');
  const txList = document.getElementById('txList');
  const profileContainer = document.getElementById('profileDetailsContainer');

  if (profileContainer && currentUser) {
    profileContainer.innerHTML = `
      <div class="glass-card profile-info-card" style="padding:16px; margin-bottom:14px;">
        <div class="profile-card-title" style="font-size:0.9rem; font-weight:800; color:var(--accent-cyan); margin-bottom:10px;">👤 Profile Account Details</div>
        <div class="profile-details-grid" style="font-size:0.8rem; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Full Name:</span> <strong>${currentUser.name}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Mobile:</span> <strong>+91 ${currentUser.mobile}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Email ID:</span> <strong>${currentUser.email}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Status:</span> <strong style="color: ${currentUser.upiId ? '#30d158' : '#ff453a'};">${currentUser.upiId ? 'UPI Verified' : 'Pending Activation'}</strong></div>
        </div>
      </div>
    `;
  }

  if (currentUser && currentUser.upiId) {
    if (upiDisp) {
      upiDisp.innerText = currentUser.upiId;
      upiDisp.style.color = '#30d158';
    }
    
    let txHtml = '';
    const txs = currentUser.transactions || [];
    if (txs.length === 0) {
      txHtml = `<p style="font-size:0.8rem; color:#6e6e73; text-align:center; padding:12px;">No tournament payouts yet. Participate in arenas to start winning!</p>`;
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
      upiDisp.style.color = '#ff453a';
    }
    if (txList) {
      txList.innerHTML = `
        <div style="text-align:center; padding:16px;">
          <p style="font-size:0.8rem; color:#a1a1a6; margin-bottom:10px;">Wallet inactive. Link your UPI ID to receive automatic rewards.</p>
          <button class="glass-btn primary-btn" onclick="openWalletModal()">Link UPI ID Now</button>
        </div>
      `;
    }
  }
}

// Leaderboards
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
  
  if (container) {
    container.innerHTML = `
      <div style="text-align:center; padding:24px;">
        <p style="font-size:0.82rem; color:var(--text-secondary);">Tournament matches are currently under live calculation. Complete matches to see active rankings!</p>
      </div>
    `;
  }

  if (userRankCard) {
    userRankCard.innerHTML = `
      <div>
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">YOUR ACTIVE STATUS</span>
        <div style="font-size:0.95rem; font-weight:800; color:var(--text-primary);">${currentUser ? currentUser.name : 'Guest Player'}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.9rem; font-weight:800; color:var(--accent-gold);">Unranked</div>
        <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:800;">0 pts</div>
      </div>
    `;
  }
}

// Notifications Feed
function renderAlertsFeed() {
  const container = document.getElementById('alertsFeed');
  if (!container) return;
  
  container.innerHTML = `
    <div class="glass-card" style="padding:20px; text-align:center;">
      <p style="font-size:0.82rem; color:var(--text-secondary);">You have no unread notifications at this time.</p>
    </div>
  `;
}

// Authentication Modal Controls
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
    return showErrorPopup('Please enter a valid Email Address to receive your OTP.');
  }
  generatedOtp = '1234';
  
  const otpMsg = document.getElementById('otpPopupMessage');
  const otpModal = document.getElementById('otpDisplayModal');
  
  if (otpMsg) otpMsg.innerText = `Verification code sent to ${email}.\nYour One-Time Password is: 1234`;
  if (otpModal) {
    otpModal.classList.add('super-high-priority-z'); // Ensures OTP pops above auth modal
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

  if (!otp || otp !== '1234') return showErrorPopup('Invalid OTP! Click "Get OTP" and enter 1234.');
  if (!password || password.length < 6) return showErrorPopup('Password must be at least 6 characters long.');
  if (password !== confirmPassword) return showErrorPopup('Passwords do not match. Please verify and try again.');

  const newUser = { name, mobile, email, password, upiId: null, transactions: [] };
  registeredUsers.push(newUser);
  localStorage.setItem('pga_registered_users', JSON.stringify(registeredUsers));

  currentUser = newUser;
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());

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

  if (!email || !password) return showErrorPopup('Please enter both Email and Password.');

  const found = registeredUsers.find(u => u.email === email && u.password === password);
  
  if (!found) return showErrorPopup('Invalid credentials. Please verify your details or Sign Up.');

  currentUser = found;
  localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
  localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());

  closeAuthModal();
  setupUserSession();
}

function setupUserSession() {
  const navAuthBtns = document.getElementById('navAuthBtns');
  if (navAuthBtns) {
    navAuthBtns.innerHTML = `
      <div class="active-players-badge" style="display:flex; align-items:center; gap:6px; font-size:0.75rem; background:rgba(48,209,88,0.12); color:#30d158; padding:6px 12px; border-radius:20px; font-weight:800;">
        <span class="active-dot" style="width:6px; height:6px; background:#30d158; border-radius:50%;"></span>
        <span id="activePlayersCount">${activePlayersCount.toLocaleString()}</span> Live
      </div>
    `;
  }

  startActivePlayersCounter();
  switchTabContent('home');
}

// Modals Setup
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
      <p>Your privacy is important to us. Account details (Name, Email, Mobile, and UPI ID) are stored securely for account verification and tournament prize distribution.</p>
      <p>Data is handled strictly in compliance with privacy guidelines and is never shared with third parties.</p>
    `;
  } else if (type === 'terms') {
    title.innerText = 'Terms & Conditions';
    body.innerHTML = `
      <p>By participating in Paper Glide Arena, players agree to compete fairly. Unfair exploits, unauthorized automation, or multi-accounting will lead to immediate account suspension.</p>
      <p>All tournament prize payouts are subject to score verification upon match completion.</p>
    `;
  } else if (type === 'community') {
    title.innerText = 'Community Guidelines';
    body.innerHTML = `
      <p>Respect fellow competitors across platform channels. Fraudulent behavior or abusive conduct will result in account termination.</p>
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
    popup.classList.add('high-priority-z');
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

// Ticker Animation
function initHardwareAcceleratedTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  const announcements = [
    "⚡ Daily Arena Tournament Live!",
    "🏆 Top Players Compete for Prize Pools",
    "✈️ Master Paper Glide & Rise to Rank 1",
    "💸 Direct Instant UPI Rewards"
  ];

  let content = '';
  announcements.forEach(item => {
    content += `<div class="ticker-item">${item}</div>`;
  });
  track.innerHTML = content + content;

  let currentX = 0;
  let lastTime = performance.now();
  
  function step(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    currentX -= 60 * delta;
    if (Math.abs(currentX) >= track.scrollWidth / 2) currentX = 0;
    track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

