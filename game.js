// Sample 50 Indian Names for Ticker
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

// Initialize Page Features
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('no-scroll');
  
  // Splash Screen Fadeout (2.5 Seconds)
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 600);
  }, 2500);

  renderTicker();
});

// Render Smooth Marquee Ticker with 50 names
function renderTicker() {
  const track = document.getElementById('tickerTrack');
  let content = '';
  
  indianNames.forEach(name => {
    content += `<div class="ticker-item">${name} <span class="gold-text">₹5000</span></div>`;
  });

  track.innerHTML = content + content;
}

// Custom Error Popup Controls
function showErrorPopup(message) {
  document.getElementById('popupMessage').innerText = message;
  document.getElementById('errorPopup').classList.remove('hidden');
  document.body.classList.add('no-scroll');
}

function closePopup() {
  document.getElementById('errorPopup').classList.add('hidden');
  
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

// Send OTP Simulation
function sendOtp() {
  const email = document.getElementById('signupEmail').value;
  if (!email || !email.includes('@')) {
    showErrorPopup('Please enter a valid email address!');
    return;
  }
  alert('OTP Sent! Temporary OTP is 1234');
}

// Registration Handler
function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const mobile = document.getElementById('signupMobile').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const otp = document.getElementById('signupOtp').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (!name) return showErrorPopup('Please enter your full name!');
  if (!mobile || mobile.length < 10) return showErrorPopup('Please enter a valid 10-digit mobile number!');
  if (!email || !email.includes('@')) return showErrorPopup('Please enter a valid email address!');
  if (otp !== '1234') return showErrorPopup('Invalid OTP! Temporary OTP is 1234');
  if (!password) return showErrorPopup('Password is required!');
  if (password !== confirmPassword) return showErrorPopup('Passwords do not match!');

  registeredUsers.push({ email, password, name });
  alert('Registration Successful! Please Log In.');
  switchTab('login');
}

// Login Handler
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const userExists = registeredUsers.find(u => u.email === email && u.password === password);

  if (!userExists) {
    showErrorPopup('Account not found! Please Sign Up first.');
    return;
  }

  alert(`Welcome, ${userExists.name}! You are logged in.`);
  closeAuthModal();
}

