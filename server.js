const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
app.get('/', (req, res) => res.redirect('/host.html'));

// Option format: { text: "..." } OR { img: "/img/real/x.jpg", label: "caption" }
// Question.answer: number (single) OR array (multi-select, exact match required)

const roundsData = [
  {
    round: 1,
    title: "ROUND 1 — THE FIRST STEPS OF HUMANITY IN SPACE",
    subtitle: "Space history • Easy level",
    duration: 12,
    questions: [
      {
        q: "On 4 October 1957, which COUNTRY started the Space Age by launching Sputnik 1?",
        options: [
          { text: "The Soviet Union (USSR)" },
          { text: "The United States (USA)" },
          { text: "China" },
          { text: "France" }
        ],
        answer: 0,
        explanation: "The USSR launched Sputnik 1 in 1957, opening the Space Age. Its 'beep-beep' radio signal was heard all over the world for 21 days."
      },
      {
        q: "Look at these photos: which one shows APOLLO 11, the mission that took humans to the Moon?",
        options: [
          { img: "/img/real/vostok.jpg", label: "Photo A" },
          { img: "/img/real/apollo11.jpg", label: "Photo B" },
          { img: "/img/real/hubble.jpg", label: "Photo C" },
          { img: "/img/real/sputnik.jpg", label: "Photo D" }
        ],
        answer: 1,
        explanation: "Photo B shows the Saturn V rocket launching Apollo 11. Vostok (A) is a small spherical capsule, Hubble (C) has huge solar panels, Sputnik (D) is a small metal sphere with antennas."
      },
      {
        q: "According to the presentation, why was the APOLLO 11 mission so important for humanity?",
        options: [
          { text: "It proved humans could travel to another world, walk on it and come back safely" },
          { text: "It launched the first artificial satellite" },
          { text: "It built the International Space Station" },
          { text: "It discovered water on Mars" }
        ],
        answer: 0,
        explanation: "Apollo 11 proved that humans could reach another celestial body and return safely — 'One small step for man, one giant leap for mankind.'"
      },
      {
        q: "MULTIPLE ANSWERS — During the APOLLO 11 mission, what REALLY happened? Select ALL correct answers.",
        multi: true,
        duration: 12,
        options: [
          { text: "Two astronauts walked on the surface of the Moon" },
          { text: "The crew returned safely to Earth" },
          { text: "The crew planted the first flag on MARS" },
          { text: "It was the first satellite ever launched" }
        ],
        answer: [0, 1],
        explanation: "Armstrong and Aldrin walked on the Moon and the whole crew came home safely. No human has ever been to Mars, and Apollo 11 was a crewed mission, not a satellite."
      }
    ]
  },
  {
    round: 2,
    title: "ROUND 2 — ARTIFICIAL INTELLIGENCE SERVING SPACE",
    subtitle: "Core concepts • Medium level",
    duration: 12,
    questions: [
      {
        q: "MULTIPLE ANSWERS — According to the presentation, what does ARTIFICIAL INTELLIGENCE enable machines to do? Select ALL correct answers.",
        multi: true,
        duration: 12,
        image: "/img/aibrain.svg",
        options: [
          { text: "Learn from data" },
          { text: "Analyze complex situations and make their own decisions" },
          { text: "Fly faster than the speed of light" },
          { text: "Talk to extraterrestrial life forms" }
        ],
        answer: [0, 1],
        explanation: "AI lets machines learn from data, analyze complex situations and decide without direct human input. Faster-than-light travel and alien chats are science fiction!"
      },
      {
        q: "Which of these is NOT one of the goals of space exploration mentioned in the presentation?",
        image: "/img/earth.svg",
        options: [
          { text: "Understand the Universe" },
          { text: "Discover new worlds" },
          { text: "Mine gold on Mars" },
          { text: "Protect our planet" }
        ],
        answer: 2,
        explanation: "The 5 real goals: understand the Universe, discover new worlds, develop new technologies, search for extraterrestrial life, protect our planet. Gold mining is not one of them!"
      }
    ]
  },
  {
    round: 3,
    title: "ROUND 3 — FROM HUMANS TO MACHINES: THE EVOLUTION",
    subtitle: "Past vs Present • Hard level",
    duration: 12,
    questions: [
      {
        q: "What is the MAJOR difference between space exploration in the PAST and TODAY?",
        options: [
          { text: "PAST: human calculations & direct instructions → TODAY: AI-powered analysis & autonomous robots" },
          { text: "PAST: nuclear rockets → TODAY: ion propulsion only" },
          { text: "PAST: pilot astronauts → TODAY: space tourists only" },
          { text: "PAST: no communication → TODAY: quantum telepathy" }
        ],
        answer: 0,
        explanation: "Back then: manual calculations, direct commands from Earth. Today: onboard AI, autonomous navigation, intelligent robots like Perseverance."
      },
      {
        q: "Which NASA rover has been exploring Mars since 2021 using AI to DRIVE ITSELF, analyze terrain and PICK ITS OWN science targets?",
        image: "/img/mars.svg",
        options: [
          { img: "/img/real/curiosity.jpg", label: "Curiosity (2012)" },
          { img: "/img/real/perseverance.jpg", label: "Perseverance (2021)" },
          { img: "/img/real/opportunity.jpg", label: "Opportunity (2004)" },
          { img: "/img/real/spirit.jpg", label: "Spirit (2004)" }
        ],
        answer: 1,
        explanation: "Perseverance uses AutoNav (autonomous driving) and its PIXL/SHERLOC instruments to analyze rocks in real time. It even chose where to drill by itself!"
      },
      {
        q: "MULTIPLE ANSWERS — Which of these are REAL applications of AI in space? Select ALL correct answers.",
        multi: true,
        duration: 12,
        options: [
          { text: "Autonomous rover navigation (AutoNav)" },
          { text: "Detecting craters and objects in satellite images" },
          { text: "Classifying stars and galaxies from their spectra" },
          { text: "Teleporting astronauts directly to Mars" }
        ],
        answer: [0, 1, 2],
        explanation: "AI really does drive rovers, detect objects in images and classify spectra. Teleportation remains impossible!"
      }
    ]
  },
  {
    round: 4,
    title: "ROUND 4 — FINAL MISSION: SPACE AI EXPERTISE",
    subtitle: "Advanced challenges • Expert level",
    duration: 12,
    questions: [
      {
        q: "In the analysis of scientific space data (petabytes of images, spectra, telemetry), what is the KEY role of AI?",
        options: [
          { text: "Image processing, object detection, spectral classification, anomaly detection" },
          { text: "Automatically filling the fuel tanks" },
          { text: "Cooling the nuclear reactors of probes" },
          { text: "Painting the solar panels to optimize albedo" }
        ],
        answer: 0,
        explanation: "AI processes petabytes of data: crater detection, mineral classification, spotting volcanic plumes, space weather forecasting, autonomous mapping..."
      },
      {
        q: "In this quiz, which team represents YOUR PROFESSOR MR. CHOKRI that students must BEAT?",
        image: "/img/victory.svg",
        options: [
          { text: "Alpha" },
          { text: "Geforce" },
          { text: "Beta" },
          { text: "MR.Chokri" }
        ],
        answer: 3,
        explanation: "Team MR.Chokri is reserved for the professor. The student teams (Alpha, Geforce, Beta, Antigravity) must outscore him to win!"
      }
    ]
  }
];

// ============ GAME STATE ============
const newGroup = (color, icon) => ({
  score: 0, members: 0, color, icon, eliminated: false, dangerLevel: 0
});

let gameState = {
  phase: 'lobby',
  currentRoundIndex: 0,
  currentQuestionIndex: 0,
  groups: {
    'Alpha': newGroup('#00d4aa', '🚀'),
    'Geforce': newGroup('#6366f1', '⚡'),
    'Beta': newGroup('#f59e0b', '🛰️'),
    'Antigravity': newGroup('#ec4899', '🌌'),
    'MR.Chokri': newGroup('#ef4444', '👨‍🏫')
  },
  players: {},
  answersThisQuestion: {},
  questionStartedAt: null,
  timeUp: false,
  teamStats: {},      // per round: { team: { saved, total } }
  lastTeamResults: {},// per question: { team: 'saved' | 'danger' }
  roundResults: []    // at round_summary: [{ team, saved, total, survived }]
};

function getLocalIp() {
  const nets = os.networkInterfaces();
  let best = null;
  let bestScore = -Infinity;
  for (const [name, addrs] of Object.entries(nets)) {
    for (const net of addrs || []) {
      if (net.family !== 'IPv4' || net.internal) continue;
      const ip = net.address;
      const iface = name.toLowerCase();
      let score = 0;
      if (/^192\.168\./.test(ip)) score += 30;
      else if (/^10\./.test(ip)) score += 20;
      else if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) score += 10;
      if (/wi-?fi|wlan|ethernet|^eth\d*$|^en\d+$/.test(iface)) score += 5;
      // virtual adapters are usually unreachable from phones
      if (/vethernet|vmware|virtualbox|hyper-?v|wsl|docker|loopback|tailscale|zerotier|hamachi|radmin|bluetooth|^tap|^tun/.test(iface)) score -= 40;
      if (/^169\.254\./.test(ip)) score -= 100;
      if (score > bestScore) { bestScore = score; best = ip; }
    }
  }
  return best || 'localhost';
}

const PORT = process.env.PORT || 3000;
// PUBLIC_URL (tunnel) or RENDER_EXTERNAL_URL (Render hosting) provides the QR link instead of the LAN IP
const envBase = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL;
const publicBase = envBase ? envBase.replace(/\/+$/, '') : null;

function playerUrlNow() {
  return publicBase ? `${publicBase}/player.html` : `http://${getLocalIp()}:${PORT}/player.html`;
}

const playerUrl = playerUrlNow();

function currentQuestion() {
  return roundsData[gameState.currentRoundIndex].questions[gameState.currentQuestionIndex];
}

function currentDuration() {
  const q = currentQuestion();
  return (q && q.duration) || roundsData[gameState.currentRoundIndex].duration;
}

function correctSet(q) {
  return Array.isArray(q.answer) ? q.answer : [q.answer];
}

function isCorrect(q, indexes) {
  const c = correctSet(q);
  return indexes.length === c.length && c.every(i => indexes.includes(i));
}

function activeTeams() {
  return Object.entries(gameState.groups)
    .filter(([, g]) => g.members > 0)
    .map(([name]) => name);
}

let questionTimer = null;

function broadcast(extra = {}) {
  io.emit('gameState', {
    ...gameState,
    currentRoundData: roundsData[gameState.currentRoundIndex],
    questionDuration: currentDuration(),
    serverNow: Date.now(),
    ...extra
  });
}

function beginQuestion() {
  gameState.phase = 'question';
  gameState.answersThisQuestion = {};
  gameState.questionStartedAt = Date.now();
  gameState.timeUp = false;
  clearTimeout(questionTimer);
  // the server itself locks answers when time runs out (no phone-clock dependency)
  questionTimer = setTimeout(() => {
    if (gameState.phase === 'question') {
      gameState.timeUp = true;
      broadcast();
    }
  }, currentDuration() * 1000 + 1500);
  broadcast();
}

function beginRound() {
  gameState.teamStats = {};
  gameState.lastTeamResults = {};
  gameState.roundResults = [];
  gameState.currentQuestionIndex = 0;
  Object.values(gameState.groups).forEach(g => g.dangerLevel = 0);
  beginQuestion();
}

io.on('connection', (socket) => {
  broadcast();

  socket.on('joinGame', ({ name, group, clientId }) => {
    if (!gameState.groups[group]) return;
    const clean = String(name || '').trim().slice(0, 24);
    if (!clean) return;

    // a reconnecting device replaces its stale session instead of double-counting
    for (const [id, p] of Object.entries(gameState.players)) {
      if (id === socket.id) continue;
      const sameDevice = clientId && p.clientId === clientId;
      const samePlayer = !clientId && p.name === clean && p.group === group;
      if (sameDevice || samePlayer) {
        gameState.groups[p.group].members = Math.max(0, gameState.groups[p.group].members - 1);
        delete gameState.players[id];
        delete gameState.answersThisQuestion[id];
      }
    }

    const prev = gameState.players[socket.id];
    if (prev && prev.group !== group) {
      gameState.groups[prev.group].members = Math.max(0, gameState.groups[prev.group].members - 1);
    }
    if (!prev || prev.group !== group) gameState.groups[group].members++;
    gameState.players[socket.id] = { name: clean, group, clientId: clientId || null };
    broadcast();
  });

  socket.on('submitAnswer', ({ answerIndex, answers }) => {
    if (gameState.phase !== 'question') return;
    const player = gameState.players[socket.id];
    if (!player) return;
    const group = gameState.groups[player.group];
    if (group.eliminated) return;
    if (gameState.answersThisQuestion[socket.id]) return;
    if (gameState.timeUp) return;
    const q = currentQuestion();
    const indexes = q.multi
      ? (Array.isArray(answers) ? [...new Set(answers)].filter(i => Number.isInteger(i) && i >= 0 && i < q.options.length) : [])
      : [answerIndex];
    if (q.multi && indexes.length === 0) return;
    if (!q.multi && !(Number.isInteger(answerIndex) && answerIndex >= 0 && answerIndex < q.options.length)) return;
    gameState.answersThisQuestion[socket.id] = { indexes, time: Date.now() };
    io.emit('playerAnswered', { socketId: socket.id, group: player.group });
  });

  socket.on('host:startRound', () => {
    beginRound();
  });

  socket.on('host:nextQuestion', () => {
    const round = roundsData[gameState.currentRoundIndex];
    if (gameState.currentQuestionIndex + 1 < round.questions.length) {
      gameState.currentQuestionIndex++;
      beginQuestion();
    } else {
      // ---- ELIMINATION: less than half of the round's questions saved = astronaut dies ----
      gameState.roundResults = [];
      for (const team of activeTeams()) {
        const g = gameState.groups[team];
        if (g.eliminated) continue;
        const st = gameState.teamStats[team] || { saved: 0, total: 0 };
        const survived = st.total > 0 && st.saved >= st.total / 2;
        if (!survived) g.eliminated = true;
        gameState.roundResults.push({ team, saved: st.saved, total: st.total, survived });
      }
      gameState.phase = 'round_summary';
      broadcast();
    }
  });

  socket.on('host:revealAnswer', () => {
    if (gameState.phase !== 'question') return;
    clearTimeout(questionTimer);
    const q = currentQuestion();

    // reset per-question team counters
    const counters = {};
    for (const team of activeTeams()) {
      if (!gameState.groups[team].eliminated) counters[team] = { answered: 0, correct: 0 };
    }

    for (const [sId, ans] of Object.entries(gameState.answersThisQuestion)) {
      const player = gameState.players[sId];
      if (!player || !counters[player.group]) continue;
      counters[player.group].answered++;
      if (isCorrect(q, ans.indexes)) {
        counters[player.group].correct++;
        gameState.groups[player.group].score += 10;
      }
    }

    // ---- astronaut save: at least half of the team's answering members must be correct ----
    gameState.lastTeamResults = {};
    for (const [team, c] of Object.entries(counters)) {
      if (!gameState.teamStats[team]) gameState.teamStats[team] = { saved: 0, total: 0 };
      const st = gameState.teamStats[team];
      st.total++;
      const saved = c.answered > 0 && c.correct >= c.answered / 2;
      if (saved) st.saved++;
      const g = gameState.groups[team];
      g.dangerLevel = saved ? Math.max(0, g.dangerLevel - 1) : Math.min(4, g.dangerLevel + 1);
      gameState.lastTeamResults[team] = saved ? 'saved' : 'danger';
    }

    gameState.phase = 'question_result';
    broadcast({ correctAnswers: correctSet(q) });
  });

  socket.on('host:nextRound', () => {
    const survivors = activeTeams().filter(t => !gameState.groups[t].eliminated);
    if (survivors.length === 0 || gameState.currentRoundIndex + 1 >= roundsData.length) {
      gameState.phase = 'game_over';
      broadcast();
    } else {
      gameState.currentRoundIndex++;
      beginRound();
    }
  });

  socket.on('host:resetGame', () => {
    clearTimeout(questionTimer);
    gameState.phase = 'lobby';
    gameState.timeUp = false;
    gameState.currentRoundIndex = 0;
    gameState.currentQuestionIndex = 0;
    gameState.questionStartedAt = null;
    gameState.answersThisQuestion = {};
    gameState.teamStats = {};
    gameState.lastTeamResults = {};
    gameState.roundResults = [];
    for (const [name, g] of Object.entries(gameState.groups)) {
      gameState.groups[name] = { ...newGroup(g.color, g.icon), members: g.members };
    }
    broadcast();
  });

  socket.on('disconnect', () => {
    const player = gameState.players[socket.id];
    if (player) {
      gameState.groups[player.group].members = Math.max(0, gameState.groups[player.group].members - 1);
      delete gameState.players[socket.id];
      delete gameState.answersThisQuestion[socket.id];
      broadcast();
    }
  });
});

server.listen(PORT, () => {
  console.log('\n  SPACE QUIZ - SAVE THE ASTRONAUT');
  console.log('  Server :  http://localhost:' + PORT);
  console.log('  Players:  ' + playerUrl);
  console.log('  Host   :  http://localhost:' + PORT + '/host.html\n');
});

// rebuild on every request so the QR follows the current LAN address
app.get('/api/qr', async (req, res) => {
  const url = playerUrlNow();
  try {
    res.json({ qr: await QRCode.toDataURL(url), playerUrl: url });
  } catch (e) {
    res.status(500).json({ error: 'qr generation failed' });
  }
});
