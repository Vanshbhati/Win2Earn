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
  activeGameType: 'daily',
  hasRevivedThisGame: false,
  isRevivingState: false,
  revivePreDistance: 0,
  revivePreBonus: 0,
  revivePostDistance: 0,
  revivePostBonus: 0
};

const recentWinnersData = [
  { name: "Rahul Sharma", amount: "₹5000" },
  { name: "Priya Verma", amount: "₹5000" },
  { name: "Amit Patel", amount: "₹5000" }
];

let lbDailyData = [
  { rank: 1, name: "Aarav Sharma", score: 9850 },
  { rank: 2, name: "Rohan Verma", score: 9420 }
];

const lbWeeklyData = [
  { rank: 1, name: "Vikram Joshi", score: 48200 }
];

const alertsData = [
  { title: "🔥 Daily Tournament Active", desc: "Top 10 daily players get rewards!", time: "2 mins ago" }
];

// ==========================================================================
// PREMIUM SYNTHESIZED SOUND SYSTEM
// ==========================================================================
const gameSounds = {
  audioCtx: null,
  chopperNode: null,
  chopperGain: null,
  chopperFilter: null,
  chopperLfo: null,
  rainNode: null,
  rainGain: null,

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  startChopper() {
    this.init();
    if (!this.audioCtx) return;
    this.stopChopper();

    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.chopperNode = this.audioCtx.createBufferSource();
      this.chopperNode.buffer = buffer;
      this.chopperNode.loop = true;

      this.chopperFilter = this.audioCtx.createBiquadFilter();
      this.chopperFilter.type = 'lowpass';
      this.chopperFilter.frequency.setValueAtTime(550, this.audioCtx.currentTime);

      this.chopperGain = this.audioCtx.createGain();
      this.chopperGain.gain.setValueAtTime(0.38, this.audioCtx.currentTime);

      this.chopperLfo = this.audioCtx.createOscillator();
      this.chopperLfo.frequency.setValueAtTime(16, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.chopperLfo.connect(lfoGain);
      lfoGain.connect(this.chopperGain.gain);
      this.chopperLfo.start();

      this.chopperNode.connect(this.chopperFilter);
      this.chopperFilter.connect(this.chopperGain);
      this.chopperGain.connect(this.audioCtx.destination);

      this.chopperNode.start();
    } catch (e) {
      console.error("Chopper audio init error:", e);
    }
  },

  stopChopper() {
    if (this.chopperLfo) {
      try { this.chopperLfo.stop(); this.chopperLfo.disconnect(); } catch (e) {}
      this.chopperLfo = null;
    }
    if (this.chopperNode) {
      try {
        this.chopperNode.stop();
        this.chopperNode.disconnect();
      } catch (e) {}
      this.chopperNode = null;
    }
  },

  playMilestone() {
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(987.77, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {
      console.error("Milestone audio error:", e);
    }
  },

  playBonus() {
    this.init();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, this.audioCtx.currentTime + 0.16);
      
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch (e) {
      console.error("Bonus audio error:", e);
    }
  },

  playRain() {
    this.init();
    if (!this.audioCtx) return;
    this.stopRain();

    try {
      const bufferSize = this.audioCtx.sampleRate * 15;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.rainNode = this.audioCtx.createBufferSource();
      this.rainNode.buffer = buffer;

      const rainFilter = this.audioCtx.createBiquadFilter();
      rainFilter.type = 'bandpass';
      rainFilter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      rainFilter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      this.rainGain = this.audioCtx.createGain();
      this.rainGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.rainGain.gain.linearRampToValueAtTime(0.32, this.audioCtx.currentTime + 1.5);
      this.rainGain.gain.setValueAtTime(0.32, this.audioCtx.currentTime + 13.5);
      this.rainGain.gain.linearRampToValueAtTime(0.0, this.audioCtx.currentTime + 15.0);

      this.rainNode.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.audioCtx.destination);

      this.rainNode.start();
      setTimeout(() => this.stopRain(), 15000);
    } catch (e) {
      console.error("Rain audio error:", e);
    }
  },

  stopRain() {
    if (this.rainNode) {
      try {
        this.rainNode.stop();
        this.rainNode.disconnect();
      } catch (e) {}
      this.rainNode = null;
    }
  },

  playCrash() {
    this.init();
    if (!this.audioCtx) return;
    this.stopChopper();
    this.stopRain();

    try {
      const bufferSize = this.audioCtx.sampleRate * 0.6;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.6);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(15, this.audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start();
      osc.start();
      noise.stop(this.audioCtx.currentTime + 0.6);
      osc.stop(this.audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error("Crash audio error:", e);
    }
  }
};

function unlockMobileAudio() {
  gameSounds.init();
}

document.addEventListener("touchstart", unlockMobileAudio, { passive: true });
document.addEventListener("click", unlockMobileAudio, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  initSplashScreen();
  initTicker();
  renderLeaderboard('daily');
  renderAlerts();
  initHeliGameListeners();
  setupMonthlyButtons();
  setupPauseModalHTML();
  setupGameStartModalCartoonTheme();
  setupGameOverModalCartoonTheme();
});

function setupMonthlyButtons() {
  const monthlyCards = document.querySelectorAll('.monthly-premium-card .game-play-btn');
  monthlyCards.forEach(btn => {
    btn.setAttribute('onclick', 'handleGameLaunch()');
  });
}

function setupGameStartModalCartoonTheme() {
  const modalContainer = document.getElementById("gameScreenModal");
  if (!modalContainer) return;

  let startOverlay = document.getElementById("gameStartOverlay");
  if (!startOverlay) {
    startOverlay = document.createElement("div");
    startOverlay.id = "gameStartOverlay";
    modalContainer.appendChild(startOverlay);
  }

  startOverlay.className = "game-overlay";
  startOverlay.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(15,23,42,0.85) 100%); backdrop-filter: blur(14px); display:flex; align-items:center; justify-content:center; z-index:55; padding: 16px; overflow-y: auto;";
  startOverlay.innerHTML = `
    <div style="text-align:center; padding:26px 20px; max-width:360px; width:100%; background:linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 4px solid #38bdf8; border-radius:32px; box-shadow: 0 20px 45px rgba(56,189,248,0.35); margin: auto; position: relative;">
      
      <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #facc15, #f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: -55px auto 12px auto; box-shadow: 0 8px 20px rgba(245,158,11,0.4); border: 4px solid #ffffff;">
        <span style="font-size: 2rem;">🏆</span>
      </div>

      <h1 style="font-size:1.6rem; font-weight:900; color:#1e293b; margin-bottom:6px; letter-spacing:0.5px; text-transform:uppercase;">COPTER CASH</h1>
      
      <div style="display: inline-block; background: #e0f2fe; border: 2px dashed #0284c7; padding: 4px 12px; border-radius: 20px; margin-bottom: 14px;">
        <span style="font-size: 0.72rem; font-weight: 900; color: #0369a1; text-transform: uppercase;">🚀 Daily Tournament Edition</span>
      </div>

      <p style="font-size:0.82rem; color:#475569; margin-bottom:16px; font-weight:600; line-height: 1.4;">
        Tap anywhere to bounce higher! Dodge wacky obstacles & collect maximum bonuses to rule the leaderboard!
      </p>

      <div style="background:#fef9c3; border: 2px solid #fde047; border-radius:20px; padding:12px 14px; margin-bottom:18px; text-align:left;">
        <div style="font-size:0.75rem; font-weight:900; color:#854d0e; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
          <span>💡</span> PRO GAMING TIPS
        </div>
        <ul style="margin:0; padding-left:16px; font-size:0.75rem; color:#713f12; font-weight:700; display:flex; flex-direction:column; gap:4px;">
          <li>Watch ads to double your final score!</li>
          <li>Fly close to pipes for hidden streak bonuses!</li>
        </ul>
      </div>

      <button onclick="startHeliGame()" style="width:100%; padding:14px; font-weight:900; background:linear-gradient(135deg, #22c55e, #16a34a); color:#fff; border:3px solid #86efac; border-radius:22px; font-size:1rem; box-shadow:0 8px 22px rgba(34,197,94,0.4); cursor:pointer; text-transform:uppercase; letter-spacing:0.5px;">
        🎮 TAP TO START 🚁
      </button>

    </div>
  `;
}

function setupGameOverModalCartoonTheme() {
  const modalContainer = document.getElementById("gameScreenModal");
  if (!modalContainer) return;

  let overOverlay = document.getElementById("gameOverOverlay");
  if (!overOverlay) {
    overOverlay = document.createElement("div");
    overOverlay.id = "gameOverOverlay";
    modalContainer.appendChild(overOverlay);
  }

  overOverlay.className = "game-overlay hidden";
  overOverlay.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(15,23,42,0.85) 100%); backdrop-filter: blur(14px); display:flex; align-items:center; justify-content:center; z-index:55; padding: 16px; overflow-y: auto;";
  overOverlay.innerHTML = `
    <div style="text-align:center; padding:24px 18px; max-width:360px; width:100%; background:linear-gradient(135deg, #ffffff 0%, #fff1f2 100%); border: 4px solid #fb7185; border-radius:32px; box-shadow: 0 20px 45px rgba(244,63,94,0.35); margin: auto; position: relative;">
      
      <div id="crashRankBadge" style="position: absolute; top: 14px; right: 16px; background: linear-gradient(135deg, #f59e0b, #d97706); border: 2px solid #fef08a; border-radius: 20px; padding: 4px 10px; box-shadow: 0 4px 10px rgba(245,158,11,0.4); display: flex; align-items: center; gap: 4px;">
        <span style="font-size: 0.85rem;">👑</span>
        <span id="crashRankText" style="font-size: 0.75rem; font-weight: 900; color: #ffffff; text-transform: uppercase;">RANK #--</span>
      </div>

      <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #ef4444, #f97316); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: -48px auto 10px auto; box-shadow: 0 8px 20px rgba(239,68,68,0.4); border: 4px solid #ffffff;">
        <span style="font-size: 1.8rem;">💥</span>
      </div>

      <h2 style="font-size:1.4rem; font-weight:900; color:#be123c; margin-bottom:12px; letter-spacing:-0.5px; text-transform:uppercase;">OOPS! CRASHED!</h2>

      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <div style="flex: 1; background:#fff5f5; border: 2px solid #fecdd3; border-radius:18px; padding:12px 8px; text-align:center;">
          <div style="font-size:0.65rem; font-weight:900; color:#9f1239; text-transform:uppercase; margin-bottom:4px;">CURRENT RUN</div>
          <div id="currentRunScoreDisplay" style="font-size:1.3rem; font-weight:900; color:#e11d48;">0</div>
        </div>
        <div style="flex: 1; background:#f0fdf4; border: 2px solid #bbf7d0; border-radius:18px; padding:12px 8px; text-align:center;">
          <div style="font-size:0.65rem; font-weight:900; color:#166534; text-transform:uppercase; margin-bottom:4px;">TOTAL SCORE</div>
          <div id="dailyTotalScoreDisplay" style="font-size:1.5rem; font-weight:900; color:#16a34a;">0</div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <button id="reviveActionBtn" onclick="handleReviveAndDouble()" style="width:100%; padding:12px; font-weight:900; background:linear-gradient(135deg, #10b981, #059669); color:#fff; border:3px solid #6ee7b7; border-radius:18px; font-size:0.85rem; box-shadow:0 6px 16px rgba(16,185,129,0.35); cursor:pointer; text-transform: uppercase;">
          ⚡ REVIVE & DOUBLE SCORE ⚡
        </button>

        <button onclick="startHeliGame()" style="width:100%; padding:12px; font-weight:900; background:linear-gradient(135deg, #3b82f6, #1d4ed8); color:#fff; border:3px solid #93c5fd; border-radius:18px; font-size:0.85rem; box-shadow:0 6px 16px rgba(59,130,246,0.35); cursor:pointer;">
          TRY AGAIN 🔄
        </button>

        <button onclick="closeGameScreen()" style="width:100%; padding:10px; font-weight:800; background:#f1f5f9; color:#475569; border:2px solid #cbd5e1; border-radius:16px; font-size:0.8rem; cursor:pointer;">
          EXIT
        </button>
      </div>

    </div>
  `;
}

function setupPauseModalHTML() {
  const modalContainer = document.getElementById("gameScreenModal");
  if (!modalContainer) return;

  if (!document.getElementById("gamePauseOverlay")) {
    const pauseDiv = document.createElement("div");
    pauseDiv.id = "gamePauseOverlay";
    pauseDiv.className = "game-overlay hidden";
    pauseDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.85); backdrop-filter: blur(12px); display:flex; align-items:center; justify-content:center; z-index:50;";
    pauseDiv.innerHTML = `
      <div style="text-align:center; padding:32px 24px; max-width:330px; width:90%; background:#ffffff; border: 4px solid #38bdf8; border-radius:28px; box-shadow: 0 25px 50px rgba(0,0,0,0.2);">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 1.8rem; color: #fff; border: 3px solid #93c5fd;">⏸️</div>
        <h2 style="font-size:1.5rem; font-weight:900; color:#1e293b; margin-bottom:8px;">GAME PAUSED</h2>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px; font-weight:600;">Take a breather! Tap below to resume your flight.</p>
        <button id="resumeBtnInternal" style="width:100%; padding:12px; font-weight:900; background:linear-gradient(135deg, #22c55e, #16a34a); color:#fff; border:3px solid #86efac; border-radius:18px; font-size:0.95rem; cursor:pointer;">RESUME GAME</button>
      </div>
    `;
    modalContainer.appendChild(pauseDiv);
    
    document.getElementById("resumeBtnInternal").addEventListener("click", (e) => {
      e.stopPropagation();
      resumeGameWithCountdown();
    });
  }

  if (!document.getElementById("gameCountdownOverlay")) {
    const countDiv = document.createElement("div");
    countDiv.id = "gameCountdownOverlay";
    countDiv.className = "game-overlay hidden";
    countDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); backdrop-filter: blur(8px); display:flex; align-items:center; justify-content:center; z-index:50; text-align:center; padding: 20px;";
    countDiv.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; background: #ffffff; border: 3px solid #38bdf8; padding: 28px 36px; border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.25); max-width: 260px; width: 100%;">
        <div id="reviveLoadingText" style="font-size: 0.95rem; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
          GET READY...
        </div>
        <div id="reviveCountdownNumber" style="font-size: 2.8rem; font-weight: 900; color: #1e293b; display: none;">
          3
        </div>
      </div>
    `;
    modalContainer.appendChild(countDiv);
  }

  if (!document.getElementById("confirmExitOverlay")) {
    const confirmDiv = document.createElement("div");
    confirmDiv.id = "confirmExitOverlay";
    confirmDiv.className = "game-overlay hidden";
    confirmDiv.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.85); backdrop-filter: blur(12px); display:flex; align-items:center; justify-content:center; z-index:60;";
    confirmDiv.innerHTML = `
      <div style="text-align:center; padding:32px 24px; max-width:330px; width:90%; background:#ffffff; border: 4px solid #f59e0b; border-radius:28px; box-shadow: 0 25px 50px rgba(0,0,0,0.2);">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 1.8rem; color: #fff; border: 3px solid #fde047;">⚠️</div>
        <h2 style="font-size:1.5rem; font-weight:900; color:#1e293b; margin-bottom:8px;">QUIT GAME?</h2>
        <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px; font-weight:600;">Are you sure? Your current score progress will be lost!</p>
        <div style="display:flex; gap:10px;">
          <button id="cancelExitBtn" style="flex:1; padding:12px; font-weight:800; background:#f1f5f9; color:#475569; border:2px solid #cbd5e1; border-radius:16px; cursor:pointer;">STAY</button>
          <button id="confirmExitBtn" style="flex:1; padding:12px; font-weight:800; background:linear-gradient(135deg, #ef4444, #dc2626); color:#fff; border:3px solid #fca5a5; border-radius:16px; cursor:pointer;">QUIT</button>
        </div>
      </div>
    `;
    modalContainer.appendChild(confirmDiv);

    document.getElementById("cancelExitBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("confirmExitOverlay").classList.add("hidden");
    });

    document.getElementById("confirmExitBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("confirmExitOverlay").classList.add("hidden");
      closeGameScreen();
    });
  }
}

function initSplashScreen() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.visibility = "hidden";
    document.body.classList.remove("no-scroll");
  }, 2000);
}

let tickerAnimationId = null;
function initTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;

  const fullWinners = [...recentWinnersData, ...recentWinnersData];
  track.innerHTML = fullWinners.map(item => `
    <div class="ticker-item">🎉 <strong>${item.name}</strong> won <span>${item.amount}</span></div>
  `).join("");

  let pos = 0;
  function step() {
    pos -= 0.6;
    if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
    track.style.transform = `translate3d(${pos}px, 0, 0)`;
    tickerAnimationId = requestAnimationFrame(step);
  }
  if (tickerAnimationId) cancelAnimationFrame(tickerAnimationId);
  tickerAnimationId = requestAnimationFrame(step);
}

function handleNavClick(e, tabName) {
  unlockMobileAudio();
  if (e) e.preventDefault();

  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));

  const selectedTab = document.getElementById(`tab-${tabName}`);
  if (selectedTab) selectedTab.classList.remove("hidden");
  appState.activeTab = tabName;

  if (tabName === 'wallet') renderProfileWallet();
}

function showModal(modalId) { 
  unlockMobileAudio();
  document.getElementById(modalId)?.classList.remove("hidden"); 
}

function hideModal(modalId) { 
  unlockMobileAudio();
  document.getElementById(modalId)?.classList.add("hidden"); 
}

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

function switchTab(type) {
  unlockMobileAudio();
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (type === 'login') {
    loginForm?.classList.remove("hidden");
    signupForm?.classList.add("hidden");
  } else {
    loginForm?.classList.add("hidden");
    signupForm?.classList.remove("hidden");
  }
}

function handleLogin(e) {
  e.preventDefault();
  unlockMobileAudio();
  const email = document.getElementById("loginEmail")?.value || "user@example.com";
  appState.currentUser = { name: email.split("@")[0].toUpperCase(), email, upi: null };
  closeAuthModal();
  onUserLoggedIn();
}

function handleSignup(e) {
  e.preventDefault();
  unlockMobileAudio();
  const name = document.getElementById("signupName")?.value || "Player";
  const email = document.getElementById("signupEmail")?.value || "";
  appState.currentUser = { name, email, upi: null };
  closeAuthModal();
  onUserLoggedIn();
}

function onUserLoggedIn() {
  document.getElementById("megaBannerCard")?.classList.add("hidden");
}

function handleGameLaunch() {
  unlockMobileAudio();
  if (!appState.currentUser) {
    openAuthModal('login');
    return;
  }
  showModal("gameScreenModal");
  setupPauseModalHTML();
  setupGameStartModalCartoonTheme();
  setupGameOverModalCartoonTheme();
  resetHeliGameUI();
}

function closeGameScreen() {
  unlockMobileAudio();
  gameSounds.stopChopper();
  gameSounds.stopRain();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.active = false;
  document.getElementById("gamePauseOverlay")?.classList.add("hidden");
  document.getElementById("gameCountdownOverlay")?.classList.add("hidden");
  document.getElementById("confirmExitOverlay")?.classList.add("hidden");
  hideModal("gameScreenModal");
}

function pauseGame() {
  if (!heliGame.active) return;
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  gameSounds.stopChopper();
  gameSounds.stopRain();
  
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) {
    pauseOverlay.classList.remove("hidden");
  }
}

function promptExitGame() {
  if (heliGame.active) {
    pauseGame();
  }
  const confirmOverlay = document.getElementById("confirmExitOverlay");
  if (confirmOverlay) {
    confirmOverlay.classList.remove("hidden");
  }
}

function resumeGameWithCountdown() {
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) {
    pauseOverlay.classList.add("hidden");
  }

  const countOverlay = document.getElementById("gameCountdownOverlay");
  const reviveText = document.getElementById("reviveLoadingText");
  const countNum = document.getElementById("reviveCountdownNumber");
  
  if (reviveText) reviveText.style.display = "block";
  if (reviveText) reviveText.innerText = "RESUMING...";
  if (countNum) countNum.style.display = "none";

  if (countOverlay) {
    countOverlay.classList.remove("hidden");
  }

  setTimeout(() => {
    if (reviveText) reviveText.style.display = "none";
    if (countNum) countNum.style.display = "block";
    if (countNum) countNum.innerText = "3";

    let count = 3;
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        if (countNum) countNum.innerText = count;
      } else {
        clearInterval(countInterval);
        if (countOverlay) {
          countOverlay.classList.add("hidden");
        }
        startHeliGameResumed();
      }
    }, 1000);
  }, 1000);
}

function startHeliGameResumed() {
  unlockMobileAudio();
  gameSounds.startChopper();
  if (heliGame.isRaining) gameSounds.playRain();

  heliGame.active = true;
  heliGame.lastTime = performance.now();
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

// ==========================================================================
// GAME ENGINE
// ==========================================================================
const heliGame = {
  canvas: null,
  ctx: null,
  active: false,
  loopId: null,
  lastTime: 0,
  
  x: 50,
  y: 200,
  width: 48,
  height: 28,
  
  gravity: 1200,
  velocity: 0,
  jumpVelocity: -380,
  angle: 0,
  rotorFrame: 0,
  
  pipes: [],
  pipeWidth: 50,
  basePipeSpeed: 170, 
  currentPipeSpeed: 170,
  pipeSpacing: 230,
  groundHeight: 60,
  groundOffset: 0,

  rawScoreAcc: 0,
  distanceMeters: 0,
  bonusScore: 0,
  bestScore: 0,
  bgScroll: 0,
  cloudScroll: 0,

  lastMilestoneScore: 0,
  scoreBlinkTimer: 0,
  isRaining: false,
  rainTimer: 0,
  lastRainMilestone: 0,
  raindrops: [],
  stars: [],
  floatingTexts: []
};

function initHeliGameListeners() {
  const canvas = document.getElementById("heliCanvas");
  if (!canvas) return;
  heliGame.canvas = canvas;
  heliGame.ctx = canvas.getContext("2d", { alpha: false });

  const handlePointer = (e) => {
    if (!heliGame.active) return;
    if (e.type === 'touchstart') e.preventDefault();
    unlockMobileAudio();
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      
      if (clickX >= 12 && clickX <= 92 && clickY >= 12 && clickY <= 44) {
        promptExitGame();
        return;
      }
      if (clickX >= 12 && clickX <= 92 && clickY >= 48 && clickY <= 80) {
        pauseGame();
        return;
      }
    }
    triggerHeliJump();
  };

  canvas.addEventListener("touchstart", handlePointer, { passive: false });
  canvas.addEventListener("mousedown", handlePointer);

  window.addEventListener("keydown", (e) => {
    const gameModal = document.getElementById("gameScreenModal");
    if (e.code === "Space" && gameModal && !gameModal.classList.contains("hidden")) {
      e.preventDefault();
      triggerHeliJump();
    }
  });
}

function triggerHeliJump() {
  if (!heliGame.active) return;
  unlockMobileAudio();
  heliGame.velocity = heliGame.jumpVelocity;
}

function resetHeliGameUI() {
  appState.hasRevivedThisGame = false;
  appState.isRevivingState = false;
  appState.revivePreDistance = 0;
  appState.revivePreBonus = 0;
  appState.revivePostDistance = 0;
  appState.revivePostBonus = 0;
  appState.dailyScore = 0;
  appState.currentRunScore = 0;

  document.getElementById("gameStartOverlay")?.classList.remove("hidden");
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) { pauseOverlay.classList.add("hidden"); }
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  document.getElementById("gameCountdownOverlay")?.classList.add("hidden");
  document.getElementById("confirmExitOverlay")?.classList.add("hidden");
  
  const canvas = heliGame.canvas;
  if (!canvas) return;
  
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
  heliGame.velocity = 0;
  heliGame.angle = 0;
  heliGame.pipes = [];
  heliGame.rawScoreAcc = 0;
  heliGame.distanceMeters = 0;
  heliGame.bonusScore = 0;
  heliGame.bgScroll = 0;
  heliGame.cloudScroll = 0;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
  heliGame.lastMilestoneScore = 0;
  heliGame.scoreBlinkTimer = 0;
  heliGame.isRaining = false;
  heliGame.rainTimer = 0;
  heliGame.lastRainMilestone = 0;
  heliGame.raindrops = [];
  heliGame.floatingTexts = [];
  
  heliGame.stars = [];
  for (let i = 0; i < 40; i++) {
    heliGame.stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.6),
      size: Math.random() * 2.2 + 1,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1
    });
  }
  
  renderCanvas();
}

function startHeliGame() {
  unlockMobileAudio();

  document.getElementById("gameStartOverlay")?.classList.add("hidden");
  document.getElementById("gameOverOverlay")?.classList.add("hidden");
  const pauseOverlay = document.getElementById("gamePauseOverlay");
  if (pauseOverlay) { pauseOverlay.classList.add("hidden"); }
  document.getElementById("gameCountdownOverlay")?.classList.add("hidden");
  document.getElementById("confirmExitOverlay")?.classList.add("hidden");

  const canvas = heliGame.canvas;
  const container = canvas.parentElement;
  canvas.width = container ? container.clientWidth : window.innerWidth;
  canvas.height = container ? container.clientHeight : window.innerHeight;

  if (!appState.isRevivingState) {
    appState.hasRevivedThisGame = false;
    appState.revivePreDistance = 0;
    appState.revivePreBonus = 0;
    appState.revivePostDistance = 0;
    appState.revivePostBonus = 0;
    appState.dailyScore = 0;
    appState.currentRunScore = 0;

    heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 20;
    heliGame.velocity = 0;
    heliGame.angle = 0;
    heliGame.pipes = [];
    heliGame.rawScoreAcc = 0;
    heliGame.distanceMeters = 0;
    heliGame.bonusScore = 0;
    heliGame.bgScroll = 0;
    heliGame.cloudScroll = 0;
    heliGame.currentPipeSpeed = heliGame.basePipeSpeed;
    heliGame.lastMilestoneScore = 0;
    heliGame.scoreBlinkTimer = 0;
    heliGame.isRaining = false;
    heliGame.rainTimer = 0;
    heliGame.lastRainMilestone = 0;
    heliGame.raindrops = [];
    heliGame.floatingTexts = [];
  } else {
    heliGame.y = (canvas.height - heliGame.groundHeight) / 2 - 40;
    heliGame.velocity = 0;
    heliGame.angle = 0;
    heliGame.pipes = heliGame.pipes.filter(p => p.x > heliGame.x + 150);
    appState.isRevivingState = false;
  }

  heliGame.active = true;
  heliGame.lastTime = performance.now();

  gameSounds.startChopper();

  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);
  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function handleReviveAndDouble() {
  if (appState.hasRevivedThisGame) return;
  unlockMobileAudio();
  appState.hasRevivedThisGame = true;

  document.getElementById("gameOverOverlay")?.classList.add("hidden");

  appState.revivePreDistance = heliGame.distanceMeters;
  appState.revivePreBonus = heliGame.bonusScore;

  appState.revivePostDistance = appState.revivePreDistance * 2;
  appState.revivePostBonus = appState.revivePreBonus * 2;

  heliGame.distanceMeters = appState.revivePostDistance;
  heliGame.rawScoreAcc = appState.revivePostDistance;
  heliGame.bonusScore = appState.revivePostBonus;

  const preTotalRun = appState.revivePreDistance + appState.revivePreBonus;
  const postTotalRun = appState.revivePostDistance + appState.revivePostBonus;
  const addedDifference = postTotalRun - preTotalRun;
  appState.dailyScore += addedDifference;
  appState.currentRunScore = postTotalRun;
  updateLeaderboardWithUserScore();

  const countOverlay = document.getElementById("gameCountdownOverlay");
  const reviveText = document.getElementById("reviveLoadingText");
  const countNum = document.getElementById("reviveCountdownNumber");

  if (reviveText) reviveText.style.display = "block";
  if (reviveText) reviveText.innerText = "DOUBLING SCORE...";
  if (countNum) countNum.style.display = "none";

  if (countOverlay) {
    countOverlay.classList.remove("hidden");
  }

  setTimeout(() => {
    if (reviveText) reviveText.style.display = "none";
    if (countNum) countNum.style.display = "block";
    if (countNum) countNum.innerText = "3";

    let count = 3;
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        if (countNum) countNum.innerText = count;
      } else {
        clearInterval(countInterval);
        if (countOverlay) {
          countOverlay.classList.add("hidden");
        }
        appState.isRevivingState = true;
        startHeliGame();
      }
    }, 1000);
  }, 1000);
}

function heliGameLoop(timestamp) {
  if (!heliGame.active) return;

  let dt = (timestamp - heliGame.lastTime) / 1000;
  if (dt > 0.05) dt = 0.05;
  heliGame.lastTime = timestamp;

  updatePhysics(dt);
  renderCanvas();

  heliGame.loopId = requestAnimationFrame(heliGameLoop);
}

function updatePhysics(dt) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;

  const oldRunTotal = heliGame.distanceMeters + heliGame.bonusScore;

  heliGame.rawScoreAcc += dt * 12;
  heliGame.distanceMeters = Math.floor(heliGame.rawScoreAcc);

  const newRunTotal = heliGame.distanceMeters + heliGame.bonusScore;
  const diff = newRunTotal - oldRunTotal;
  if (diff > 0) {
    appState.dailyScore += diff;
    appState.currentRunScore = newRunTotal;
  }

  if (heliGame.distanceMeters > 0 && heliGame.distanceMeters % 100 === 0 && heliGame.distanceMeters !== heliGame.lastMilestoneScore) {
    heliGame.lastMilestoneScore = heliGame.distanceMeters;
    heliGame.scoreBlinkTimer = 0.6;
    gameSounds.playMilestone();
  }

  if (heliGame.scoreBlinkTimer > 0) {
    heliGame.scoreBlinkTimer -= dt;
  }

  const currentRainMilestone = Math.floor(heliGame.distanceMeters / 750);
  if (currentRainMilestone > 0 && currentRainMilestone !== heliGame.lastRainMilestone) {
    heliGame.lastRainMilestone = currentRainMilestone;
    heliGame.isRaining = true;
    heliGame.rainTimer = 15.0;
    gameSounds.playRain();
  }

  if (heliGame.isRaining) {
    heliGame.rainTimer -= dt;
    if (heliGame.rainTimer <= 0) {
      heliGame.isRaining = false;
    }
  }

  const speedIncrement = Math.floor(heliGame.distanceMeters / 1000) * 15;
  heliGame.currentPipeSpeed = heliGame.basePipeSpeed + speedIncrement;

  heliGame.velocity += heliGame.gravity * dt;
  heliGame.y += heliGame.velocity * dt;
  heliGame.angle = Math.min(25, Math.max(-20, heliGame.velocity * 0.06));
  heliGame.rotorFrame += dt * 35;
  heliGame.groundOffset = (heliGame.groundOffset + (heliGame.currentPipeSpeed * dt)) % 30;
  heliGame.bgScroll += (heliGame.currentPipeSpeed * dt);
  heliGame.cloudScroll += (heliGame.currentPipeSpeed * dt * 0.4);

  if (heliGame.y <= 0) {
    heliGame.y = 0;
    heliGame.velocity = 0;
  }

  const heliBox = { 
    x: heliGame.x + 6, 
    y: heliGame.y + 6, 
    w: heliGame.width - 12, 
    h: heliGame.height - 10 
  };

  if (heliGame.y + heliGame.height >= playableHeight) {
    handleCrash();
    return;
  }

  if (heliGame.pipes.length === 0) {
    spawnPipe(canvas.width + 20);
  } else {
    const lastPipe = heliGame.pipes[heliGame.pipes.length - 1];
    if (canvas.width - lastPipe.x >= heliGame.pipeSpacing) {
      spawnPipe(canvas.width);
    }
  }

  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    p.x -= heliGame.currentPipeSpeed * dt;

    const topPipeBox = { x: p.x, y: 0, w: heliGame.pipeWidth, h: p.topHeight };
    const bottomPipeBox = { x: p.x, y: p.bottomY, w: heliGame.pipeWidth, h: playableHeight - p.bottomY + 10 };

    if (checkAABBCollision(heliBox, topPipeBox) || checkAABBCollision(heliBox, bottomPipeBox)) {
      handleCrash();
      return;
    }

    if (!p.bonusAwarded && heliGame.x > p.x + heliGame.pipeWidth) {
      p.bonusAwarded = true;
      
      const distToTopEdge = Math.abs(heliGame.y - p.topHeight);
      const distToBottomEdge = Math.abs((heliGame.y + heliGame.height) - p.bottomY);
      const strictThreshold = 18;

      if (distToTopEdge <= strictThreshold || distToBottomEdge <= strictThreshold) {
        heliGame.bonusScore += 50;
        appState.dailyScore += 50;
        gameSounds.playBonus();

        heliGame.floatingTexts.push({
          text: "+50",
          x: p.x + heliGame.pipeWidth / 2,
          y: distToTopEdge <= strictThreshold ? p.topHeight + 15 : p.bottomY - 15,
          alpha: 1.0,
          vy: -40
        });
      }
    }
  }

  for (let f = heliGame.floatingTexts.length - 1; f >= 0; f--) {
    let ft = heliGame.floatingTexts[f];
    ft.y += ft.vy * dt;
    ft.alpha -= dt * 1.2;
    if (ft.alpha <= 0) {
      heliGame.floatingTexts.splice(f, 1);
    }
  }

  if (heliGame.pipes.length > 0 && heliGame.pipes[0].x < -heliGame.pipeWidth - 10) {
    heliGame.pipes.shift();
  }

  if (heliGame.isRaining) {
    if (heliGame.raindrops.length < 120) {
      heliGame.raindrops.push({
        x: Math.random() * canvas.width,
        y: -10,
        length: Math.random() * 15 + 10,
        speed: Math.random() * 400 + 600
      });
    }
    for (let drop of heliGame.raindrops) {
      drop.y += drop.speed * dt;
      drop.x -= 120 * dt;
      if (drop.y > canvas.height) {
        drop.y = -10;
        drop.x = Math.random() * canvas.width;
      }
    }
  } else {
    heliGame.raindrops = [];
  }
}

function spawnPipe(startX) {
  const canvas = heliGame.canvas;
  const playableHeight = canvas.height - heliGame.groundHeight;
  
  const currentGap = 165;
  const minH = 40;
  const maxH = playableHeight - currentGap - minH;
  const topHeight = Math.floor(Math.random() * (maxH - minH + 1)) + minH;

  heliGame.pipes.push({
    x: startX,
    topHeight: topHeight,
    bottomY: topHeight + currentGap,
    gapSize: currentGap,
    bonusAwarded: false
  });
}

function checkAABBCollision(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function renderCanvas() {
  const ctx = heliGame.ctx;
  const canvas = heliGame.canvas;
  const score = heliGame.distanceMeters;

  const cycleScore = score % 1500;
  
  let skyTop, skyMid, skyBottom, showSun = false, showStars = false;

  if (cycleScore >= 1000 && cycleScore < 1500) {
    skyTop = "#1e1b4b";
    skyMid = "#312e81";
    skyBottom = "#4338ca";
    showStars = true;
  } else if (cycleScore >= 500 && cycleScore < 1000) {
    skyTop = "#fed7aa";
    skyMid = "#f472b6";
    skyBottom = "#fb923c";
    showSun = true;
  } else {
    skyTop = heliGame.isRaining ? "#2c3e50" : "#38bdf8";
    skyMid = heliGame.isRaining ? "#34495e" : "#7dd3fc";
    skyBottom = heliGame.isRaining ? "#475569" : "#e0f2fe";
  }

  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, skyTop);
  skyGrad.addColorStop(0.5, skyMid);
  skyGrad.addColorStop(1, skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (showStars && heliGame.stars) {
    ctx.save();
    for (let star of heliGame.stars) {
      star.alpha += (Math.random() * 0.04 - 0.02) * star.twinkleSpeed;
      if (star.alpha > 1) star.alpha = 1;
      if (star.alpha < 0.2) star.alpha = 0.2;

      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (showSun) {
    ctx.save();
    const sunX = canvas.width * 0.75;
    const sunY = canvas.height * 0.35;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
    sunGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    sunGrad.addColorStop(0.5, "rgba(254, 240, 138, 0.7)");
    sunGrad.addColorStop(1, "rgba(251, 146, 60, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (!(cycleScore >= 500 && cycleScore < 1000) && !(cycleScore >= 1000 && cycleScore < 1500)) {
    drawMovingClouds(ctx, canvas.width, canvas.height, heliGame.cloudScroll, heliGame.isRaining);
  }

  drawBackgroundCity(ctx, canvas.width, canvas.height, heliGame.bgScroll, (cycleScore >= 500 && cycleScore < 1000), (cycleScore >= 1000 && cycleScore < 1500));

  const playableHeight = canvas.height - heliGame.groundHeight;
  for (let i = 0; i < heliGame.pipes.length; i++) {
    const p = heliGame.pipes[i];
    drawCleanPipe(ctx, p.x, 0, heliGame.pipeWidth, p.topHeight, true);
    const bottomH = playableHeight - p.bottomY + 12;
    drawCleanPipe(ctx, p.x, p.bottomY, heliGame.pipeWidth, bottomH, false);
  }

  if (heliGame.floatingTexts && heliGame.floatingTexts.length > 0) {
    ctx.save();
    ctx.font = "900 16px sans-serif";
    ctx.textAlign = "center";
    for (let ft of heliGame.floatingTexts) {
      ctx.fillStyle = `rgba(250, 204, 21, ${ft.alpha})`;
      ctx.strokeStyle = `rgba(15, 23, 42, ${ft.alpha})`;
      ctx.lineWidth = 3.5;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  drawCartoonThemeGround(ctx, canvas.width, canvas.height, heliGame.groundHeight, heliGame.groundOffset);
  drawVectorHelicopter(ctx, heliGame.x, heliGame.y, heliGame.angle, heliGame.rotorFrame, (cycleScore >= 1000 && cycleScore < 1500));

  if (heliGame.isRaining && heliGame.raindrops.length > 0) {
    ctx.strokeStyle = "rgba(174, 219, 238, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let drop of heliGame.raindrops) {
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 4, drop.y + drop.length);
    }
    ctx.stroke();
  }

  renderTopHeaderUI(ctx, canvas.width);
}

function drawMovingClouds(ctx, w, h, cloudScroll, isRaining) {
  ctx.save();
  ctx.fillStyle = isRaining ? "rgba(71, 85, 105, 0.85)" : "rgba(255, 255, 255, 0.65)";
  const loopW = 400;
  const offsetX = (cloudScroll * 0.3) % loopW;

  const clouds = [
    { x: 50, y: 60, w: 70, h: 24 },
    { x: 220, y: 110, w: 90, h: 30 },
    { x: 340, y: 50, w: 60, h: 20 }
  ];

  for (let i = -1; i < Math.ceil(w / loopW) + 1; i++) {
    const baseX = i * loopW - offsetX;
    clouds.forEach(c => {
      const cx = baseX + c.x;
      const cy = c.y;
      ctx.beginPath();
      ctx.arc(cx, cy, c.h, 0, Math.PI * 2);
      ctx.arc(cx + c.w * 0.4, cy - c.h * 0.3, c.h * 0.8, 0, Math.PI * 2);
      ctx.arc(cx + c.w, cy, c.h * 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawBackgroundCity(ctx, w, h, bgScroll, isSunset, isNight) {
  const baseLineY = h - heliGame.groundHeight + 10;
  
  const buildings = [
    { x: 0, w: 48, h: 95, wallColor: isNight ? "#1e293b" : (isSunset ? "#c2410c" : "#3b82f6") },
    { x: 52, w: 40, h: 125, wallColor: isNight ? "#1e293b" : (isSunset ? "#db2777" : "#8b5cf6") },
    { x: 96, w: 54, h: 80, wallColor: isNight ? "#1e293b" : (isSunset ? "#ea580c" : "#10b981") },
    { x: 154, w: 44, h: 140, wallColor: isNight ? "#1e293b" : (isSunset ? "#9333ea" : "#f59e0b") },
    { x: 202, w: 50, h: 105, wallColor: isNight ? "#1e293b" : (isSunset ? "#be185d" : "#06b6d4") }
  ];

  const loopW = 260;
  const offsetX = (bgScroll * 0.12) % loopW;

  ctx.save();
  for (let i = -1; i < Math.ceil(w / loopW) + 1; i++) {
    const baseX = i * loopW - offsetX;
    buildings.forEach(b => {
      const bx = baseX + b.x;
      const by = baseLineY - b.h;

      ctx.fillStyle = b.wallColor;
      ctx.fillRect(bx, by, b.w, b.h + 20);

      ctx.fillStyle = isNight ? "#fde047" : "rgba(255, 255, 255, 0.85)";
      for (let wY = 12; wY < b.h - 8; wY += 18) {
        ctx.fillRect(bx + 6, by + wY, 6, 8);
        if (b.w > 36) ctx.fillRect(bx + b.w - 12, by + wY, 6, 8);
      }
    });
  }
  ctx.restore();
}

function drawCartoonThemeGround(ctx, width, height, groundHeight, scrollOffset) {
  const groundY = height - groundHeight;

  ctx.save();
  ctx.fillStyle = "#5c9e31";
  ctx.fillRect(0, groundY, width, 14);

  ctx.fillStyle = "#80d038";
  ctx.fillRect(0, groundY, width, 4);

  ctx.fillStyle = "#d8be70";
  ctx.fillRect(0, groundY + 14, width, groundHeight - 14);

  ctx.fillStyle = "#be9d48";
  const tileSize = 20;
  const startX = -(scrollOffset % tileSize);

  for (let x = startX; x < width + tileSize; x += tileSize) {
    ctx.fillRect(x, groundY + 14, 2, groundHeight - 14);
    ctx.fillRect(x, groundY + 28, tileSize, 2);
    ctx.fillRect(x, groundY + 44, tileSize, 2);
  }

  ctx.fillStyle = "#2d5116";
  ctx.fillRect(0, groundY + 13, width, 2);
  ctx.restore();
}

function drawCleanPipe(ctx, x, y, w, h, isTop) {
  if (h <= 0) return;

  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = "#9ce659";
  ctx.fillRect(x + 4, y, 5, h);

  ctx.fillStyle = "#498818";
  ctx.fillRect(x + w - 7, y, 7, h);

  ctx.strokeStyle = "#2e520e";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  const capH = 20;
  const overhang = 4;
  const capX = x - overhang;
  const capW = w + (overhang * 2);
  const capY = isTop ? y + h - capH : y;

  ctx.fillStyle = "#73bf2e";
  ctx.fillRect(capX, capY, capW, capH);
  ctx.fillStyle = "#9ce659";
  ctx.fillRect(capX + 4, capY, 5, capH);
  ctx.fillStyle = "#498818";
  ctx.fillRect(capX + capW - 7, capY, 7, capH);
  ctx.strokeRect(capX, capY, capW, capH);
}

function drawVectorHelicopter(ctx, x, y, angleDeg, frame, isNight) {
  ctx.save();
  ctx.translate(x + 22, y + 14);

  if (isNight) {
    ctx.save();
    ctx.rotate((angleDeg * Math.PI) / 180);
    const lightGrad = ctx.createLinearGradient(16, 2, 280, 20);
    lightGrad.addColorStop(0, "rgba(254, 240, 138, 0.85)");
    lightGrad.addColorStop(0.4, "rgba(250, 204, 21, 0.35)");
    lightGrad.addColorStop(1, "rgba(250, 204, 21, 0)");

    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(300, -80);
    ctx.lineTo(300, 100);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(-20, -3, 15, 6);
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -3, 15, 6);

  ctx.fillStyle = "#f39c12";
  ctx.beginPath();
  ctx.moveTo(-18, -3);
  ctx.lineTo(-24, -10);
  ctx.lineTo(-14, -3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2.5;
  const tailRotorSpin = Math.sin(frame * 2.5) * 7;
  ctx.beginPath();
  ctx.moveTo(-23, -6 - tailRotorSpin);
  ctx.lineTo(-23, -6 + tailRotorSpin);
  ctx.stroke();

  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.ellipse(2, 1, 14, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.arc(6, -1, 7, -Math.PI / 2, Math.PI / 3);
  ctx.lineTo(6, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#1a252f";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillRect(7, -4, 3, 3);

  if (isNight) {
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(16, 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.fillStyle = "#2c3e50";
  ctx.fillRect(-1, -13, 4, 4);

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 3;
  const blurWidth = 24 * Math.abs(Math.sin(frame));
  ctx.beginPath();
  ctx.moveTo(1 - blurWidth, -13);
  ctx.lineTo(1 + blurWidth, -13);
  ctx.stroke();

  ctx.strokeStyle = "#2c3e50";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-6, 11);
  ctx.lineTo(-6, 15);
  ctx.moveTo(6, 11);
  ctx.lineTo(6, 15);
  ctx.moveTo(-12, 15);
  ctx.lineTo(14, 15);
  ctx.stroke();

  ctx.restore();
}

function renderTopHeaderUI(ctx, w) {
  ctx.save();

  const exitX = 12, exitY = 12, exitW = 80, exitH = 32;
  const exitGrad = ctx.createLinearGradient(exitX, exitY, exitX, exitY + exitH);
  exitGrad.addColorStop(0, "#ef4444");
  exitGrad.addColorStop(1, "#b91c1c");

  ctx.fillStyle = exitGrad;
  drawRoundedRect(ctx, exitX, exitY, exitW, exitH, 10, true);
  ctx.strokeStyle = "#fca5a5";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✕ EXIT", exitX + exitW / 2, exitY + exitH / 2 + 1);

  const pauseX = 12, pauseY = 48, pauseW = 80, exitH_pause = 32;
  const pauseGrad = ctx.createLinearGradient(pauseX, pauseY, pauseX, pauseY + exitH_pause);
  pauseGrad.addColorStop(0, "#475569");
  pauseGrad.addColorStop(1, "#1e293b");

  ctx.fillStyle = pauseGrad;
  drawRoundedRect(ctx, pauseX, pauseY, pauseW, exitH_pause, 10, true);
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⏸ PAUSE", pauseX + pauseW / 2, pauseY + exitH_pause / 2 + 1);

  const scoreStr = String(heliGame.distanceMeters).padStart(5, '0');
  const scoreW = 115, scoreH = 32;
  const scoreX = w - scoreW - 12, scoreY = 12;

  let scoreBoxGradTop = "#3b82f6";
  let scoreBoxGradBottom = "#1d4ed8";
  let scaleOffset = 1;

  if (heliGame.scoreBlinkTimer > 0) {
    scoreBoxGradTop = "#f59e0b";
    scoreBoxGradBottom = "#b45309";
    scaleOffset = 1.04 + Math.sin(heliGame.scoreBlinkTimer * 30) * 0.04;
  }

  ctx.save();
  if (heliGame.scoreBlinkTimer > 0) {
    ctx.translate(scoreX + scoreW / 2, scoreY + scoreH / 2);
    ctx.scale(scaleOffset, scaleOffset);
    ctx.translate(-(scoreX + scoreW / 2), -(scoreY + scoreH / 2));
  }

  const scoreGrad = ctx.createLinearGradient(scoreX, scoreY, scoreX, scoreY + scoreH);
  scoreGrad.addColorStop(0, scoreBoxGradTop);
  scoreGrad.addColorStop(1, scoreBoxGradBottom);

  ctx.fillStyle = scoreGrad;
  drawRoundedRect(ctx, scoreX, scoreY, scoreW, scoreH, 10, true);
  ctx.strokeStyle = heliGame.scoreBlinkTimer > 0 ? "#fef08a" : "#93c5fd";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 15px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(scoreStr, scoreX + scoreW / 2, scoreY + scoreH / 2 + 1);
  ctx.restore();

  const bonusStr = `⭐ BONUS: +${heliGame.bonusScore}`;
  const bonusW = 125, bonusH = 30;
  const bonusX = w - bonusW - 12, bonusY = 50;

  const bonusGrad = ctx.createLinearGradient(bonusX, bonusY, bonusX + bonusW, bonusY + bonusH);
  bonusGrad.addColorStop(0, "#10b981");
  bonusGrad.addColorStop(1, "#047857");

  ctx.fillStyle = bonusGrad;
  drawRoundedRect(ctx, bonusX, bonusY, bonusW, bonusH, 10, true);
  ctx.strokeStyle = "#a7f3d0";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 11px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(bonusStr, bonusX + bonusW / 2, bonusY + bonusH / 2 + 1);

  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
}

function handleCrash() {
  heliGame.active = false;
  if (heliGame.loopId) cancelAnimationFrame(heliGame.loopId);

  unlockMobileAudio();
  gameSounds.stopChopper();
  gameSounds.stopRain();
  gameSounds.playCrash();

  let currentRunTotal = heliGame.distanceMeters + heliGame.bonusScore;
  appState.currentRunScore = currentRunTotal;

  if (appState.dailyScore > heliGame.bestScore) {
    heliGame.bestScore = appState.dailyScore;
  }

  updateLeaderboardWithUserScore();

  const currentRunEl = document.getElementById("currentRunScoreDisplay");
  const dailyTotalEl = document.getElementById("dailyTotalScoreDisplay");
  const reviveBtnEl = document.getElementById("reviveActionBtn");
  const rankTextEl = document.getElementById("crashRankText");

  if (currentRunEl) currentRunEl.innerText = `${currentRunTotal}`;
  if (dailyTotalEl) dailyTotalEl.innerText = `${appState.dailyScore}`;

  if (rankTextEl && appState.currentUser) {
    const userRankObj = lbDailyData.find(item => item.name === appState.currentUser.name);
    if (userRankObj) {
      rankTextEl.innerText = `RANK #${userRankObj.rank}`;
    } else {
      rankTextEl.innerText = `RANK #--`;
    }
  }

  if (reviveBtnEl) {
    if (appState.hasRevivedThisGame) {
      reviveBtnEl.style.display = "none";
    } else {
      reviveBtnEl.style.display = "block";
    }
  }

  document.getElementById("gameOverOverlay")?.classList.remove("hidden");
}

function updateLeaderboardWithUserScore() {
  if (!appState.currentUser) return;
  const targetData = lbDailyData;
  const existingIdx = targetData.findIndex(item => item.name === appState.currentUser.name);
  if (existingIdx !== -1) {
    targetData[existingIdx].score = appState.dailyScore;
  } else {
    targetData.push({ rank: targetData.length + 1, name: appState.currentUser.name, score: appState.dailyScore });
  }
  targetData.sort((a, b) => b.score - a.score);
  targetData.forEach((item, index) => item.rank = index + 1);
  renderLeaderboard('daily');
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
  if (!appState.currentUser) {
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="glass-card" style="padding: 16px; text-align: center;">
          <p style="font-size: 0.82rem; color: #6e6e73; margin-bottom: 10px;">Log in to access your Wallet.</p>
          <button class="glass-btn primary-btn" onclick="openAuthModal('login')">LOG IN NOW</button>
        </div>
      `;
    }
    return;
  }
  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="glass-card" style="padding: 16px; text-align: left;">
        <div style="font-size: 0.72rem; color: #8e8e93; font-weight: 800;">ACCOUNT HOLDER</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: #1c1c1e;">${appState.currentUser.name}</div>
      </div>
    `;
  }
}

