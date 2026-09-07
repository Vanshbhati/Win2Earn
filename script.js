// State Management
const appState = {
  currentUser: null,
  activeTab: 'home',
  leaderboardType: 'daily',
  generatedOtp: null
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
const lbDailyData = [
  { rank: 1, name: "Aarav Sharma", score: "9,850" },
  { rank: 2, name: "Rohan Verma", score: "9,420" },
  { rank: 3, name: "Priya Patel", score: "9,100" },
  { rank: 4, name: "Kabir Singh", score: "8,750" },
  { rank: 5, name: "Ananya Iyer", score: "8,300" },
  { rank: 6, name: "Siddharth Rao", score: "8,120" },
  { rank: 7, name: "Neha Gupta", score: "7,900" },
  { rank: 8, name: "Karan Mehta", score: "7,650" },
  { rank: 9, name: "Diya Deshmukh", score: "7,400" },
  { rank: 10, name: "Vikram Joshi", score: "7,150" }
];

const lbWeeklyData = [
  { rank: 1, name: "Vikram Joshi", score: "48,200" },
  { rank: 2, name: "Aarav Sharma", score: "46,100" },
  { rank: 3, name: "Ananya Iyer", score: "44,500" },
  { rank: 4, name: "Rohan Verma", score: "42,800" },
  { rank: 5, name: "Priya Patel", score: "40,100" },
  { rank: 6, name: "Kabir Singh", score: "38,900" },
  { rank: 7, name: "Siddharth Rao", score: "36,400" },
  { rank: 8, name: "Neha Gupta", score: "34,200" },
  { rank: 9, name: "Karan Mehta", score: "32,800" },
  { rank: 10, name: "Diya Deshmukh", score: "31,000" }
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
});

// Splash Screen Logic (6.5s smooth transition)
function initSplashScreen() {
  const splash = document.getElementById("splashScreen");
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

  // Double array for continuous seamless infinite loop
  const fullWinners = [...recentWinnersData, ...recentWinnersData];
  track.innerHTML = fullWinners.map(item => `
    <div class="ticker-item">🎉 <strong>${item.name}</strong> won <span>${item.amount}</span></div>
  `).join("");

  let pos = 0;
  const speed = 0.6; // Ultra smooth pixel increment per frame

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
  
  // Update Tab States
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) selectedTab.classList.remove("hidden");

  // Highlight bottom nav active icon
  const activeNavItem = Array.from(document.querySelectorAll(".nav-item")).find(item => 
    item.getAttribute("onclick") && item.getAttribute("onclick").includes(`'${tabName}'`)
  );
  if (activeNavItem) activeNavItem.classList.add("active");

  appState.activeTab = tabName;

  // Load Tab Specifics
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
  document.getElementById("popupMessage").innerText = msg;
  showModal("errorPopup");
}
function closePopup() { hideModal("errorPopup"); }

function closeOtpModal() { hideModal("otpDisplayModal"); }

// Auth Tab Switching
function switchTab(type) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  
  if (type === 'login') {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  } else {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  }
}

// OTP Generation Mock
function sendOtp() {
  const mobile = document.getElementById("signupMobile").value;
  if (!mobile || mobile.length < 10) {
    openPopup("Please enter a valid 10-digit mobile number.");
    return;
  }
  
  const generated = Math.floor(1000 + Math.random() * 9000);
  appState.generatedOtp = generated.toString();
  
  document.getElementById("otpPopupMessage").innerText = `Your Win2Earn OTP Code is: ${generated}`;
  showModal("otpDisplayModal");
}

// Handle Login Form Submit
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  
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
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const otpInput = document.getElementById("signupOtp").value;
  const pass = document.getElementById("signupPassword").value;
  const confirmPass = document.getElementById("signupConfirmPassword").value;

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
  document.getElementById("welcomeUserName").innerText = `Welcome, ${name}!`;
  showModal("welcomeModal");

  onUserLoggedIn();
}

// Actions triggered after User Sign-in / Sign-up
function onUserLoggedIn() {
  // 1. Hide Mega 10 Lakh Banner Card
  const megaCard = document.getElementById("megaBannerCard");
  if (megaCard) megaCard.classList.add("hidden");

  // 2. Hide Navbar Login/Signup Buttons and replace with User Avatar
  const navAuth = document.getElementById("navAuthBtns");
  if (navAuth && appState.currentUser) {
    navAuth.innerHTML = `
      <div class="user-pill-badge" style="background: rgba(245, 197, 24, 0.15); border: 1px solid var(--accent-gold); padding: 6px 14px; border-radius: 12px; color: var(--accent-gold); font-size: 0.8rem; font-weight: 800;">
        👤 ${appState.currentUser.name}
      </div>
    `;
  }
}

// Welcome Play Button Direct Handler (Takes user to Games Tab directly)
function handleWelcomePlay() {
  hideModal("welcomeModal");
  handleNavClick(null, "games");
}

// Direct Game Launch (Auto check authentication)
function handleGameLaunch() {
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }
  showModal("gameScreenModal");
}

function closeGameScreen() {
  hideModal("gameScreenModal");
}

// Leaderboard Logic
function switchLeaderboard(type) {
  appState.leaderboardType = type;
  document.getElementById("btnDailyLb").classList.toggle("active", type === 'daily');
  document.getElementById("btnWeeklyLb").classList.toggle("active", type === 'weekly');
  renderLeaderboard(type);
}

function renderLeaderboard(type) {
  const container = document.getElementById("lbList");
  const data = type === 'daily' ? lbDailyData : lbWeeklyData;

  container.innerHTML = data.map(item => `
    <div class="lb-row">
      <span class="lb-rank ${item.rank <= 3 ? 'top' + item.rank : ''}">#${item.rank}</span>
      <span class="lb-name">${item.name}</span>
      <span class="lb-score">${item.score} pts</span>
    </div>
  `).join("");

  const rankCard = document.getElementById("userRankCard");
  if (rankCard) {
    rankCard.innerHTML = `
      <div>
        <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 800;">YOUR CURRENT STANDING</div>
        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${appState.currentUser ? appState.currentUser.name : 'Guest User'}</div>
      </div>
      <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold);">
        ${appState.currentUser ? '#142 Rank' : 'Unranked'}
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
  const upiInput = document.getElementById("upiInput").value;
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
    document.getElementById("legalModalTitle").innerText = content.title;
    document.getElementById("legalModalBody").innerHTML = content.body;
    showModal("legalModal");
  }
}

function closeLegalModal() { hideModal("legalModal"); }

