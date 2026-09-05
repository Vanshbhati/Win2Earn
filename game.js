const indianNames = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Verma", "Vihaan Gupta", "Arjun Singh",
  "Sai Kumar", "Reyansh Reddy", "Ayaan Joshi", "Krishna Mehta", "Ishaan Bhat",
  "Shaurya Yadava", "Atharva Kulkarni", "Gautam Rao", "Ananya Mishra", "Diya Choudhary",
  "Saanvi Agarwal", "Aadhya Jain", "Pari Saxena", "Kiara Nair", "Riya Das",
  "Anaya Pillai", "Kavya Menon", "Rohan Sethi", "Karan Malhotra", "Dhruv Kapoor"
];

let registeredUsers = [];
let currentUser = null; // Stores logged-in user object
let currentTab = 'home';
let currentLbType = 'daily';
let activePlayersCount = 4980;

// Dynamic Mock Feed Data for Scheduled Alerts (Every 2-3 Hrs Format)
const sampleAlerts = [
  {
    time: "2 Hours Ago",
    title: "⚡ Play Now & Claim Rank 1!",
    desc: "The Daily Tournament is live! Compete now to secure Rank 1 and grab your share of the ₹500 prize pool."
  },
  {
    time: "5 Hours Ago",
    title: "🏆 Tournament Victory Alert",
    desc: "Congratulations! You scored 2,450 points in Speed Runner arena. Check leaderboard for your rank update."
  },
  {
    time: "8 Hours Ago",
    title: "💸 Payout Processed Successfully",
    desc: "Your tournament winning reward of ₹50.00 has been transferred directly to your linked UPI ID."
  },
  {
    time: "11 Hours Ago",
    title: "⚔️ Match Outcome Notice",
    desc: "Target Master Arena match completed. Hard luck! Practice again to climb back to the top 10."
  }
];

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('no-scroll');
  
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 400);
  }, 2500);

  initHardwareAcceleratedTicker();
});

// Live Active Players Counter Fluctuation
function startActivePlayersCounter() {
  setInterval(() => {
    const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
    activePlayersCount = Math.max(4800, activePlayersCount + change);
    const counterElem = document.getElementById('activePlayersCount');
    if (counterElem) {
      counterElem.innerText = activePlayersCount.toLocaleString();
    }
  }, 3000);
}

// Protected Route Handler for Bottom Nav Tabs
function handleNavClick(event, tabName) {
  if (event) event.preventDefault();

  if (tabName === 'home') {
    switchTabContent('home');
    if (event) updateActiveNav(event.currentTarget);
    return;
  }

  // Enforce Guest Lock
  if (!currentUser) {
    showErrorPopup(`Please Log In or Sign Up to access the ${tabName.toUpperCase()} section.`);
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

  // Tab specific renders
  if (tabName === 'leaderboard') renderLeaderboard();
  if (tabName === 'wallet') renderWalletView();
  if (tabName === 'alerts') renderAlertsFeed();
}

function updateActiveNav(targetElement) {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  targetElement.classList.add('active');
}

// Game Play Trigger - Enforces UPI Activation First
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

  alert('🎮 Arena loading... Get ready to score high!');
}

// Wallet Activation & Lock Logic
function openWalletModal() {
  document.getElementById('walletActivationModal').classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeWalletModal() {
  document.getElementById('walletActivationModal').classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

function activateWallet(e) {
  e.preventDefault();
  const upiVal = document.getElementById('upiInput').value.trim();

  if (!upiVal || !upiVal.includes('@')) {
    showErrorPopup('Please enter a valid official UPI ID (e.g. mobile@paytm or user@ybl)');
    return;
  }

  currentUser.upiId = upiVal;
  currentUser.transactions = currentUser.transactions || [
    { title: "Daily Tournament Win Reward", date: "Today, 10:15 PM", amount: "+ ₹50.00" }
  ];

  alert('✅ Wallet Activated Successfully! Your UPI ID is now linked.');
  closeWalletModal();
  if (currentTab === 'wallet') renderWalletView();
}

function renderWalletView() {
  const upiDisp = document.getElementById('walletUpiDisplay');
  const txList = document.getElementById('txList');

  if (currentUser && currentUser.upiId) {
    upiDisp.innerText = currentUser.upiId;
    upiDisp.style.color = '#34d399';
    
    let txHtml = '';
    const txs = currentUser.transactions || [];
    if (txs.length === 0) {
      txHtml = `<p style="font-size:0.8rem; color:#64748b; text-align:center; padding:12px;">No winning payouts yet. Play games to earn!</p>`;
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
    txList.innerHTML = txHtml;
  } else {
    upiDisp.innerText = "Not Activated";
    upiDisp.style.color = '#ef4444';
    txList.innerHTML = `
      <div style="text-align:center; padding:16px;">
        <p style="font-size:0.8rem; color:#94a3b8; margin-bottom:10px;">Wallet is inactive. Link UPI ID to view payouts.</p>
        <button class="stake-btn primary-btn" onclick="openWalletModal()">Activate Wallet Now</button>
      </div>
    `;
  }
}

// Leaderboard Renders
function switchLeaderboard(type) {
  currentLbType = type;
  document.getElementById('btnDailyLb').classList.toggle('active', type === 'daily');
  document.getElementById('btnWeeklyLb').classList.toggle('active', type === 'weekly');
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

  container.innerHTML = listHtml;

  // Render User Personal Rank
  const userScore = currentLbType === 'daily' ? 1420 : 4850;
  const userRank = currentLbType === 'daily' ? 14 : 22;

  userRankCard.innerHTML = `
    <div>
      <span style="font-size:0.7rem; color:#94a3b8; font-weight:700;">YOUR LIVE RANK</span>
      <div style="font-size:1rem; font-weight:800; color:#ffffff;">${currentUser ? currentUser.name : 'Guest User'}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:1.1rem; font-weight:900; color:#facc15;">#${userRank}</div>
      <div style="font-size:0.75rem; color:#38bdf8; font-weight:800;">${userScore} pts</div>
    </div>
  `;
}

// Render Notifications Feed
function renderAlertsFeed() {
  const container = document.getElementById('alertsFeed');
  let html = '';
  sampleAlerts.forEach(item => {
    html += `
      <div class="alert-card stake-card">
        <div class="alert-time">${item.time}</div>
        <div class="alert-title">${item.title}</div>
        <div class="alert-desc">${item.desc}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// Auth Handlers
function openAuthModal(tab) {
  switchTab(tab);
  document.getElementById('authModal').classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

function switchTab(tab) {
  if (tab === 'login') {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
  } else {
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
  }
}

function sendOtp() {
  const email = document.getElementById('signupEmail').value.trim();
  if (!email || !email.includes('@')) return showErrorPopup('Enter a valid Email Address first.');
  alert('OTP Sent! Temporary OTP is 1234');
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const mobile = document.getElementById('signupMobile').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const otp = document.getElementById('signupOtp').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!name || mobile.length < 10 || !email.includes('@') || otp !== '1234' || !password) {
    return showErrorPopup('Please fill all signup details correctly (OTP: 1234).');
  }

  const user = { name, mobile, email, password, upiId: null, transactions: [] };
  registeredUsers.push(user);
  alert('Registration Successful! Please Log In now.');
  switchTab('login');
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const found = registeredUsers.find(u => u.email === email && u.password === password);
  if (!found) {
    return showErrorPopup('User not found. Please Sign Up first.');
  }

  currentUser = found;
  
  // Replace Nav Auth Buttons with Live Active Players Counter
  document.getElementById('navAuthBtns').innerHTML = `
    <div class="active-players-badge">
      <span class="active-dot"></span>
      <span id="activePlayersCount">${activePlayersCount.toLocaleString()}</span> Active
    </div>
  `;

  startActivePlayersCounter();
  closeAuthModal();
  alert(`Welcome ${currentUser.name}!`);
}

// Telegram Modal
function openTelegramModal() {
  document.getElementById('telegramModal').classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeTelegramModal() {
  document.getElementById('telegramModal').classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

// Global Error Popup
function showErrorPopup(msg) {
  document.getElementById('popupMessage').innerText = msg;
  document.getElementById('errorPopup').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('errorPopup').classList.add('hidden');
}

// Smooth Winner Ticker
function initHardwareAcceleratedTicker() {
  const track = document.getElementById('tickerTrack');
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
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

