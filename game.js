const indianNames = [
  "Aarav Sharma", "Vivaan Patel", "Aditya Verma", "Vihaan Gupta", "Arjun Singh",
  "Sai Kumar", "Reyansh Reddy", "Ayaan Joshi", "Krishna Mehta", "Ishaan Bhat",
  "Shaurya Yadava", "Atharva Kulkarni", "Gautam Rao", "Ananya Mishra", "Diya Choudhary",
  "Saanvi Agarwal", "Aadhya Jain", "Pari Saxena", "Kiara Nair", "Riya Das",
  "Anaya Pillai", "Kavya Menon", "Rohan Sethi", "Karan Malhotra", "Dhruv Kapoor",
  "Kabir Chawla", "Devansh Gill", "Pranav Bansal", "Rishabh Roy", "Tanishq Pandey",
  "Manish Saini", "Rahul Tiwari", "Amit Thakur", "Vikas Tiwari", "Siddharth Goel",
  "Deepak Chopra", "Alok Sengupta", "Sanjay Nambiar", "Pankaj Solanki", "Varun Hegde",
  "Neha Dubey", "Pooja Deshmukh", "Sneha Bhattacharya", "Priya Mahajan", "Meera Nanda",
  "Shruti Ghosh", "Swati Bhasin", "Kriti Shrivastava", "Divya Rastogi", "Simran Dutta"
];

let registeredUsers = [];
let currentUser = null; // Session tracking
let tickerAnimId = null;

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('no-scroll');
  
  // Splash Screen Timeout
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 400);
  }, 3500);

  initHardwareAcceleratedTicker();
});

// Protected Route Handler for Bottom Nav Tabs
function handleNavClick(event, tabName) {
  event.preventDefault();

  if (tabName === 'home') {
    updateActiveNav(event.currentTarget);
    return;
  }

  // Lock feature for unauthenticated visitors
  if (!currentUser) {
    showErrorPopup(`Please Log In or Sign Up to access the ${tabName.toUpperCase()} section.`);
    openAuthModal('signup');
    return;
  }

  updateActiveNav(event.currentTarget);
  alert(`Navigating to ${tabName.toUpperCase()} section...`);
}

function updateActiveNav(targetElement) {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  targetElement.classList.add('active');
}

// Telegram Modal Controls
function openTelegramModal() {
  document.getElementById('telegramModal').classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeTelegramModal() {
  document.getElementById('telegramModal').classList.add('hidden');
  document.body.classList.remove('no-scroll');
}

// Smooth Winner Ticker Loop
function initHardwareAcceleratedTicker() {
  const track = document.getElementById('tickerTrack');
  let content = '';
  
  indianNames.forEach(name => {
    content += `<div class="ticker-item">${name} <span class="gold-text">₹5000</span></div>`;
  });

  track.innerHTML = content + content;

  let currentX = 0;
  let lastTime = performance.now();
  const pixelsPerSecond = 90;

  function step(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    currentX -= pixelsPerSecond * deltaTime;
    
    const halfWidth = track.scrollWidth / 2;
    if (Math.abs(currentX) >= halfWidth) {
      currentX += halfWidth;
    }

    track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
    tickerAnimId = requestAnimationFrame(step);
  }

  if (tickerAnimId) cancelAnimationFrame(tickerAnimId);
  tickerAnimId = requestAnimationFrame(step);
}

// Priority Error Popup
function showErrorPopup(message) {
  document.getElementById('popupMessage').innerText = message;
  document.getElementById('errorPopup').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('errorPopup').classList.add('hidden');
}

// Notice Modal Controls
function openNoticeModal() {
  document.getElementById('noticeModal').classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closeNoticeModal() {
  document.getElementById('noticeModal').classList.add('hidden');
  const isAuthOpen = !document.getElementById('authModal').classList.contains('hidden');
  if (!isAuthOpen) {
    document.body.classList.remove('no-scroll');
  }
}

// Auth Modal Controls
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
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function sendOtp() {
  const email = document.getElementById('signupEmail').value.trim();
  if (!email || !email.includes('@')) {
    showErrorPopup('Please enter a valid email address first to receive OTP.');
    return;
  }
  alert('OTP Sent successfully! Use temporary OTP: 1234');
}

// Strict Sign Up Validation
function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const mobile = document.getElementById('signupMobile').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const otp = document.getElementById('signupOtp').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (!name) return showErrorPopup('Full Name is required. Please enter your name.');
  if (!mobile || mobile.length < 10) return showErrorPopup('A valid 10-digit Mobile Number is required.');
  if (!email || !email.includes('@')) return showErrorPopup('Please enter a valid Email Address.');
  if (!otp) return showErrorPopup('OTP is required. Click "Get OTP" to receive it.');
  if (otp !== '1234') return showErrorPopup('Invalid OTP. Temporary OTP is 1234.');
  if (!password) return showErrorPopup('Password field cannot be empty.');
  if (!confirmPassword) return showErrorPopup('Please confirm your password.');
  if (password !== confirmPassword) return showErrorPopup('Passwords do not match. Please check again.');

  const newUser = { email, password, name, mobile };
  registeredUsers.push(newUser);
  alert('Registration Successful! Please Log In with your credentials.');
  switchTab('login');
}

// Strict Login Validation
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email) return showErrorPopup('Please enter your registered Email Address.');
  if (!password) return showErrorPopup('Please enter your password.');

  const userExists = registeredUsers.find(u => u.email === email && u.password === password);

  if (!userExists) {
    showErrorPopup('Account not found or password incorrect. Please Sign Up first.');
    return;
  }

  currentUser = userExists;
  alert(`Welcome back, ${userExists.name}! Logged in successfully.`);
  
  // Update header UI
  document.getElementById('navAuthBtns').innerHTML = `<span style="color:#facc15; font-size:0.85rem; font-weight:800;">👤 ${userExists.name}</span>`;
  
  closeAuthModal();
}

