/*
===============================================
  X-O Game Controller - Premium Edition
  مع toast notifications بدلاً من alerts
===============================================
*/

let gameState = {
    playerName: '',
    opponentName: '',
    mode: '',
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: 'X',
    scores: { X: 0, O: 0 },
    round: 1,
    isGameActive: true
};

const screens = {
    welcome: document.getElementById('welcome-screen'),
    mode: document.getElementById('mode-screen'),
    game: document.getElementById('game-screen')
};

const elements = {
    playerNameInput: document.getElementById('player-name'),
    startBtn: document.getElementById('start-btn'),
    backToWelcome: document.getElementById('back-to-welcome'),
    pvpMode: document.getElementById('pvp-mode'),
    aiMode: document.getElementById('ai-mode'),
    backToMode: document.getElementById('back-to-mode'),
    player1Name: document.getElementById('player1-name'),
    player2Name: document.getElementById('player2-name'),
    scoreX: document.getElementById('score-x'),
    scoreO: document.getElementById('score-o'),
    roundNumber: document.getElementById('round-number'),
    currentPlayerText: document.getElementById('current-player-name'),
    gameBoard: document.getElementById('game-board'),
    cells: document.querySelectorAll('.cell'),
    newGameBtn: document.getElementById('new-game-btn'),
    resultModal: document.getElementById('result-modal'),
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    nextRoundBtn: document.getElementById('next-round-btn'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    tournamentModal: document.getElementById('tournament-modal'),
    tournamentTitle: document.getElementById('tournament-title'),
    finalScores: document.getElementById('final-scores'),
    winnerAnnouncement: document.getElementById('winner-announcement'),
    newTournamentBtn: document.getElementById('new-tournament-btn'),
    closeTournamentBtn: document.getElementById('close-tournament-btn')
};

/*
===============================================
  Toast Notification System
===============================================
*/

function showToast(message, type = 'info') {
    // إزالة أي toast سابق
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // إنشاء toast جديد
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // إزالته بعد 3 ثواني
    setTimeout(() => {
        toast.style.animation = 'slideInToast 0.5s ease reverse';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/*
===============================================
  Confetti Effect
===============================================
*/

function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'confetti-container';
        document.body.appendChild(div);
    }

    const colors = ['#00f3ff', '#ff00ea', '#a855f7', '#00ff88', '#ffd700'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            document.getElementById('confetti-container').appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

/*
===============================================
  Particles Background
===============================================
*/

function createParticlesBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = ['#00f3ff', '#ff00ea', '#a855f7'][Math.floor(Math.random() * 3)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/*
===============================================
  وظائف التنقل بين الشاشات
===============================================
*/

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

/*
===============================================
  وظائف شاشة الترحيب
===============================================
*/

elements.startBtn.addEventListener('click', () => {
    const name = elements.playerNameInput.value.trim();

    if (!name) {
        showToast('الرجاء إدخال اسمك أولاً! 😊', 'error');
        elements.playerNameInput.focus();
        return;
    }

    gameState.playerName = name;
    showScreen('mode');
});

elements.playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.startBtn.click();
    }
});

elements.backToWelcome.addEventListener('click', () => {
    showScreen('welcome');
});

/*
===============================================
  وظائف اختيار نمط اللعب
===============================================
*/

elements.pvpMode.addEventListener('click', () => {
    gameState.mode = 'pvp';
    gameState.opponentName = 'اللاعب 2';
    initializeGame();
});

elements.aiMode.addEventListener('click', () => {
    gameState.mode = 'ai';
    gameState.opponentName = 'الذكاء الاصطناعي 🤖';
    initializeGame();
});

/*
===============================================
  وظائف تهيئة اللعبة
===============================================
*/

function initializeGame() {
    // تهيئة اللعبة بدون API
    gameState.scores = { X: 0, O: 0 };
    gameState.round = 1;
    
    elements.player1Name.textContent = gameState.playerName;
    elements.player2Name.textContent = gameState.opponentName;

    updateScoreboard();
    resetBoard();
    showScreen('game');
    showToast(`🎮 لنبدأ اللعب يا ${gameState.playerName}!`);
}

/*
===============================================
  وظائف لوحة اللعب
===============================================
*/

function resetBoard() {
    gameState.board = [null, null, null, null, null, null, null, null, null];
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;

    elements.cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'taken', 'winner');
    });

    updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
    const currentPlayerName = gameState.currentPlayer === 'X'
        ? gameState.playerName
        : gameState.opponentName;

    elements.currentPlayerText.textContent = currentPlayerName;
}

function updateScoreboard() {
    elements.scoreX.textContent = gameState.scores.X;
    elements.scoreO.textContent = gameState.scores.O;
    elements.roundNumber.textContent = gameState.round;
}

/*
===============================================
  التحكم في حركات اللاعبين
===============================================
*/

elements.cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

function handleCellClick(cell) {
    const index = parseInt(cell.dataset.index);

    if (!gameState.isGameActive || gameState.board[index] !== null) {
        return;
    }

    if (gameState.mode === 'ai' && gameState.currentPlayer === 'O') {
        return;
    }

    makeMove(index);
}

function makeMove(position) {
    // التحقق من أن اللعبة نشطة
    if (!gameState.isGameActive || gameState.board[position] !== null) {
        return;
    }

    // تنفيذ الحركة
    gameState.board[position] = gameState.currentPlayer;
    updateBoardDisplay();

    // فحص الفائز
    const winner = checkWinner(gameState.board);
    let isDraw = false;

    if (winner) {
        gameState.scores[winner] += 1;
        handleWin(winner, gameState.scores, gameState.round);
    } else if (isBoardFull(gameState.board)) {
        isDraw = true;
        handleDraw();
    } else {
        // تبديل اللاعب
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerDisplay();

        // إذا كان وضع AI ودور AI
        if (gameState.mode === 'ai' && gameState.currentPlayer === 'O') {
            setTimeout(() => makeAIMove(), 500);
        }
    }
}

function makeAIMove() {
    // التحقق من أن اللعبة نشطة
    if (!gameState.isGameActive) {
        return;
    }

    // الحصول على أفضل حركة للذكاء الاصطناعي
    const bestMove = getBestMove(gameState.board, 'O', 'X');
    
    if (bestMove === null) {
        return;
    }

    // تنفيذ الحركة
    gameState.board[bestMove] = 'O';
    updateBoardDisplay();

    // فحص الفائز
    const winner = checkWinner(gameState.board);
    let isDraw = false;

    if (winner) {
        gameState.scores[winner] += 1;
        handleWin(winner, gameState.scores, gameState.round);
    } else if (isBoardFull(gameState.board)) {
        isDraw = true;
        handleDraw();
    } else {
        gameState.currentPlayer = 'X';
        updateCurrentPlayerDisplay();
    }
}

function updateBoardDisplay() {
    elements.cells.forEach((cell, index) => {
        const value = gameState.board[index];

        if (value && !cell.classList.contains('taken')) {
            cell.textContent = value;
            cell.classList.add(value.toLowerCase(), 'taken');
        }
    });
}

/*
===============================================
  معالجة نتائج الجولات
===============================================
*/

function handleWin(winner, scores, round) {
    gameState.isGameActive = false;
    gameState.scores = scores;
    gameState.round = round;

    updateScoreboard();
    highlightWinningCells();
    createConfetti();

    const winnerName = winner === 'X' ? gameState.playerName : gameState.opponentName;

    elements.resultIcon.textContent = '🎉';
    elements.resultTitle.textContent = `${winnerName} فاز!`;
    elements.resultMessage.textContent = 'مبروك! أحسنت اللعب 🏆';

    if (gameState.round >= 3) {
        setTimeout(() => showTournamentResults(), 2000);
    } else {
        setTimeout(() => showResultModal(), 1000);
    }
}

function handleDraw() {
    gameState.isGameActive = false;

    elements.resultIcon.textContent = '🤝';
    elements.resultTitle.textContent = 'تعادل!';
    elements.resultMessage.textContent = 'لعبة متوازنة! 🎯';

    if (gameState.round >= 3) {
        setTimeout(() => showTournamentResults(), 2000);
    } else {
        setTimeout(() => showResultModal(), 1000);
    }
}

function highlightWinningCells() {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    winCombinations.forEach(combo => {
        if (gameState.board[combo[0]] &&
            gameState.board[combo[0]] === gameState.board[combo[1]] &&
            gameState.board[combo[1]] === gameState.board[combo[2]]) {
            combo.forEach(index => {
                elements.cells[index].classList.add('winner');
            });
        }
    });
}

/*
===============================================
  النوافذ المنبثقة
===============================================
*/

function showResultModal() {
    elements.resultModal.classList.add('active');
}

function showTournamentResults() {
    const scoreX = gameState.scores.X;
    const scoreO = gameState.scores.O;

    let winner = '';
    if (scoreX > scoreO) {
        winner = `🏆 ${gameState.playerName} فاز بالبطولة!`;
        createConfetti();
    } else if (scoreO > scoreX) {
        winner = `🏆 ${gameState.opponentName} فاز بالبطولة!`;
        createConfetti();
    } else {
        winner = '🤝 تعادل في البطولة!';
    }

    elements.winnerAnnouncement.textContent = winner;

    elements.finalScores.innerHTML = `
        <div style="font-size: 2.5rem; margin: 1.5rem 0;">
            <div style="margin: 1rem 0;">
                <span style="background: linear-gradient(135deg, #00f3ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;">${gameState.playerName}</span>: ${scoreX}
            </div>
            <div style="margin: 1rem 0;">
                <span style="background: linear-gradient(135deg, #ff00ea, #ff6b6b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900;">${gameState.opponentName}</span>: ${scoreO}
            </div>
        </div>
    `;

    elements.tournamentModal.classList.add('active');
}

/*
===============================================
  أزرار التحكم
===============================================
*/

elements.nextRoundBtn.addEventListener('click', () => {
    gameState.round += 1;
    elements.resultModal.classList.remove('active');
    resetBoard();
    updateScoreboard();
    showToast(`🎮 الجولة ${gameState.round} - هيا نلعب!`);
});

elements.closeModalBtn.addEventListener('click', () => {
    elements.resultModal.classList.remove('active');
});

elements.newTournamentBtn.addEventListener('click', () => {
    elements.tournamentModal.classList.remove('active');
    showScreen('mode');
});

elements.closeTournamentBtn.addEventListener('click', () => {
    elements.tournamentModal.classList.remove('active');
});

elements.newGameBtn.addEventListener('click', () => {
    resetBoard();
    showToast('🔄 لعبة جديدة!');
});

elements.backToMode.addEventListener('click', () => {
    showScreen('mode');
});

/*
===============================================
  تهيئة أولية
===============================================
*/

window.addEventListener('load', () => {
    elements.playerNameInput.focus();
    createParticlesBackground();
});
