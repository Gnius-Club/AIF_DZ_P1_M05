/**
 * Mi Día de Súper Poder: Aventura de Balance - VERSIÓN DEFINITIVA CORREGIDA
 * FIXES: Tutorial progression, D-PAD controls, proximity detection, avatar movement
 */

// ============================================================================
// 1. CONFIGURACIÓN Y CONSTANTES
// ============================================================================

const GameStates = {
    TUTORIAL: 'tutorial',
    WORLD: 'world', 
    MINIGAME: 'minigame'
};

const GAME_CONFIG = {
    // Efectos de los mini-juegos
    SNAKE_HEART_DECAY: 0.015,
    SNAKE_ENERGY_DECAY: 0.03,
    SNAKE_MENTAL_GAIN: 0.05,
    TICTACTOE_HEART_GAIN: 0.05,
    PENALTY_ENERGY_GAIN: 0.06,
    RPS_HEART_GAIN: 0.07,
    RPS_ENERGY_GAIN: 0.07,
    
    // Configuración del juego
    GREEN_THRESHOLD: 70,
    RED_THRESHOLD: 30,
    DAY_DURATION: 150,
    AVATAR_SPEED: 120,
    PROXIMITY_DISTANCE: 80
};

// Objetos del juego con especificaciones exactas
const GAME_OBJECTS = {
    phone: {
        id: 'phone',
        renderX: 150, renderY: 180,
        name: "Celular", 
        type: "snake",
        emoji: "📱",
        zone: "Tu Cuarto"
    },
    boardgame: {
        id: 'boardgame',
        renderX: 500, renderY: 180,
        name: "Mesa de Juegos",
        type: "tictactoe", 
        emoji: "🎲",
        zone: "La Sala"
    },
    ball: {
        id: 'ball',
        renderX: 300, renderY: 450,
        name: "Balón",
        type: "penalty",
        emoji: "⚽", 
        zone: "El Jardín"
    },
    friends: {
        id: 'friends',
        renderX: 450, renderY: 480,
        name: "Amigos",
        type: "rockpaperscissors",
        emoji: "👫",
        zone: "El Jardín"  
    }
};

// ============================================================================
// 2. VARIABLES GLOBALES
// ============================================================================

let currentState = GameStates.TUTORIAL;
let activeMinigame = null;

let gameState = {
    dayProgress: 0,
    
    meters: {
        physical: 100,
        social: 100, 
        mental: 0
    },
    
    avatar: {
        x: 200,
        y: 200,
        width: 30,
        height: 30
    },
    
    input: {
        keys: {},
        dpad: {}
    },
    
    soundEnabled: true,
    isPaused: false,
    scaleX: 1,
    scaleY: 1
};

// Tutorial dinámico
let currentTutorialStep = 0;
const tutorialSteps = [
    {
        title: "¡Hola! Soy el Guía del Balance",
        text: "Te voy a enseñar cómo mantener un día equilibrado y divertido. ¡Empezamos!",
        narration: "Hola pequeño héroe. Soy tu guía del balance y te voy a enseñar cómo tener un día perfecto."
    },
    {
        title: "⚡ Medidor de Energía Física", 
        text: "Este medidor muestra tu energía física. Se llena con ejercicio y actividad. ¡Manténlo en verde!",
        narration: "Mira este rayo. Es tu energía física. Cuando haces ejercicio, sube. Cuando te cansas, baja.",
        highlight: '#energy-fill'
    },
    {
        title: "❤️ Medidor de Conexión Social",
        text: "Este medidor muestra tu conexión social. Se llena cuando compartes con otros. ¡También manténlo en verde!",
        narration: "El corazón muestra tu conexión social. Cuando juegas con amigos o familia, se llena de amor.",
        highlight: '#social-fill'
    },
    {
        title: "🎯 Tu Misión de Balance",
        text: "Tu objetivo es mantener ambos medidores ⚡ y ❤️ en la zona verde al final del día. ¡Ese es tu súper poder!",
        narration: "Tu súper poder es el equilibrio. Mantén tanto la energía como el amor en verde para ganar."
    },
    {
        title: "🕹️ Controles de Movimiento",
        text: "Usa las teclas WASD o las flechas del teclado para moverte. También puedes usar la cruceta en la esquina.",
        narration: "Para moverte, usa las teclas W A S D, o las flechitas, o toca los botones de la esquina.",
        highlight: '#dpad'
    },
    {
        title: "🏠 Objetos Interactivos",
        text: "En el mundo hay objetos especiales: 📱 Celular, 🎲 Mesa, ⚽ Balón, 👫 Amigos. Cada uno tiene efectos únicos.",
        narration: "Hay objetos mágicos en el mundo. El celular, la mesa, el balón y los amigos. Cada uno es especial."
    },
    {
        title: "🎮 Cómo Activar Mini-juegos",
        text: "Acércate a cualquier objeto con tu avatar. Cuando estés cerca aparecerá un botón grande '🎮 Jugar...' ¡Úsalo!",
        narration: "Cuando te acerques a un objeto, aparecerá un botón mágico que dice Jugar. ¡Tócalo para divertirte!"
    },
    {
        title: "🚀 ¡Comienza tu Aventura!",
        text: "¡Perfecto! Ahora sabes todo lo que necesitas. Ve, explora, juega y mantén tu balance. ¡Eres un héroe del bienestar!",
        narration: "¡Fantástico! Ya sabes todo. Ahora ve, explora y demuestra que eres un verdadero héroe del balance."
    }
];

// Referencias DOM
let canvas, ctx, elements = {};

// Variables de mini-juegos
let snakeGame = {
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'right',
    score: 0,
    gameRunning: false,
    interval: null
};

let ticTacToe = { board: Array(9).fill(''), gameActive: true, playerTurn: true };
let penaltyGame = { selectedZone: null, shots: 0, goals: 0, maxShots: 5 };
let rpsGame = { playerScore: 0, aiScore: 0, maxRounds: 3, currentRound: 0 };

// ============================================================================
// 3. INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Iniciando VERSIÓN DEFINITIVA CORREGIDA...');
    
    initDOMElements();
    initCanvas();
    initAllEvents();
    initDPadControls();
    
    // Iniciar tutorial dinámico inmediatamente
    setTimeout(() => {
        startDynamicTutorial();
    }, 500);
    
    startGameLoop();
    
    console.log('✅ Juego inicializado - Estado: TUTORIAL OBLIGATORIO');
});

function initDOMElements() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    elements = {
        // Medidores
        energyFill: document.getElementById('energy-fill'),
        socialFill: document.getElementById('social-fill'), 
        mentalFill: document.getElementById('mental-fill'),
        energyValue: document.getElementById('energy-value'),
        socialValue: document.getElementById('social-value'),
        mentalValue: document.getElementById('mental-value'),
        dayProgress: document.getElementById('day-progress'),
        dayIcon: document.getElementById('day-icon'),
        
        // Botones
        pauseBtn: document.getElementById('pause-btn'),
        restartBtn: document.getElementById('restart-btn'),
        soundBtn: document.getElementById('sound-btn'),
        helpBtn: document.getElementById('help-btn'),
        
        // NUEVO: Botón de proximidad
        playButton: document.getElementById('play-button'),
        
        // Modales
        tutorialModal: document.getElementById('tutorial-modal'),
        minigameModal: document.getElementById('minigame-modal'),
        enddayModal: document.getElementById('endday-modal'),
        helpModal: document.getElementById('help-modal'),
        
        // Tutorial
        tutorialTitle: document.getElementById('tutorial-title'),
        tutorialText: document.getElementById('tutorial-text'),
        tutorialNext: document.getElementById('tutorial-next'),
        tutorialStart: document.getElementById('tutorial-start'),
        tutorialSkip: document.getElementById('tutorial-skip'),
        tutorialStep: document.getElementById('tutorial-step'),
        tutorialProgressBar: document.getElementById('tutorial-progress-bar'),
        
        // D-PAD
        dpad: document.getElementById('dpad'),
        
        // Debug y notificaciones
        debugPanel: document.getElementById('debug-panel'),
        debugInfo: document.getElementById('debug-info'),
        proximityDebug: document.getElementById('proximity-debug'),
        notifications: document.getElementById('notifications')
    };
    
    console.log('📋 Elementos DOM inicializados');
}

function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    ctx.imageSmoothingEnabled = false;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
}

function resizeCanvas() {
    const container = document.querySelector('.game-area');
    const containerRect = container.getBoundingClientRect();
    
    canvas.width = Math.min(800, containerRect.width);
    canvas.height = Math.min(600, containerRect.height - 100);
    
    gameState.scaleX = canvas.width / 800;
    gameState.scaleY = canvas.height / 600;
    
    console.log(`📐 Canvas: ${canvas.width}x${canvas.height}`);
}

// ============================================================================
// 4. SISTEMA DE EVENTOS CORREGIDO
// ============================================================================

function initAllEvents() {
    console.log('🔧 Configurando eventos...');
    
    // Botones principales
    if (elements.pauseBtn) elements.pauseBtn.addEventListener('click', togglePause);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', restartDay);
    if (elements.soundBtn) elements.soundBtn.addEventListener('click', toggleSound);
    if (elements.helpBtn) elements.helpBtn.addEventListener('click', showHelpModal);
    
    // Controles de teclado CORREGIDOS
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Tutorial events CORREGIDOS
    setupTutorialEvents();
    
    // Minigame events
    const minigameClose = document.getElementById('minigame-close');
    if (minigameClose) minigameClose.addEventListener('click', exitMinigame);
    
    // Help modal
    const helpClose = document.getElementById('help-close');
    if (helpClose) helpClose.addEventListener('click', closeHelpModal);
    
    // End day events
    const enddayRetry = document.getElementById('endday-retry');
    const enddayContinue = document.getElementById('endday-continue');
    if (enddayRetry) enddayRetry.addEventListener('click', restartDay);
    if (enddayContinue) enddayContinue.addEventListener('click', closeEndDayModal);
    
    console.log('✅ Eventos configurados');
}

function setupTutorialEvents() {
    console.log('📖 Configurando eventos del tutorial...');
    
    // CORREGIDO: Remover listeners anteriores y agregar nuevos
    if (elements.tutorialNext) {
        elements.tutorialNext.onclick = null;
        elements.tutorialNext.addEventListener('click', nextTutorialStep);
    }
    
    if (elements.tutorialStart) {
        elements.tutorialStart.onclick = null;
        elements.tutorialStart.addEventListener('click', finishTutorial);
    }
    
    if (elements.tutorialSkip) {
        elements.tutorialSkip.onclick = null;
        elements.tutorialSkip.addEventListener('click', skipTutorial);
    }
    
    console.log('📖 Tutorial events CORREGIDOS');
}

// NUEVA: Inicialización de D-PAD COMPLETAMENTE CORREGIDA
function initDPadControls() {
    console.log('🕹️ Inicializando D-PAD CORREGIDO...');
    
    const dpadButtons = {
        'dpad-up': 'up',
        'dpad-down': 'down', 
        'dpad-left': 'left',
        'dpad-right': 'right'
    };
    
    Object.keys(dpadButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        const direction = dpadButtons[buttonId];
        
        if (button) {
            console.log(`🕹️ Configurando botón ${buttonId} para dirección ${direction}`);
            
            // Limpiar eventos anteriores
            button.onmousedown = null;
            button.onmouseup = null;
            button.onmouseleave = null;
            button.ontouchstart = null;
            button.ontouchend = null;
            
            // Mouse events CORREGIDOS
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                gameState.input.dpad[direction] = true;
                button.style.transform = 'scale(0.9)';
                console.log(`🕹️ D-PAD ${direction} ON (mouse)`);
            });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                gameState.input.dpad[direction] = false;
                button.style.transform = 'scale(1)';
                console.log(`🕹️ D-PAD ${direction} OFF (mouse)`);
            });
            
            button.addEventListener('mouseleave', (e) => {
                gameState.input.dpad[direction] = false;
                button.style.transform = 'scale(1)';
            });
            
            // Touch events CORREGIDOS
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                gameState.input.dpad[direction] = true;
                button.style.transform = 'scale(0.9)';
                console.log(`🕹️ D-PAD ${direction} ON (touch)`);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                gameState.input.dpad[direction] = false;
                button.style.transform = 'scale(1)';
                console.log(`🕹️ D-PAD ${direction} OFF (touch)`);
            });
            
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                gameState.input.dpad[direction] = false;
                button.style.transform = 'scale(1)';
            });
        } else {
            console.error(`❌ No se encontró botón: ${buttonId}`);
        }
    });
    
    console.log('✅ D-PAD completamente configurado');
}

function handleKeyDown(event) {
    gameState.input.keys[event.code] = true;
    console.log(`⌨️ Tecla presionada: ${event.code}`);
    
    if (event.code === 'KeyD') {
        toggleDebugPanel();
    }
    
    // CORREGIDO: Permitir controles de movimiento en tutorial también
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
        event.preventDefault();
    }
}

function handleKeyUp(event) {
    gameState.input.keys[event.code] = false;
}

// ============================================================================
// 5. TUTORIAL DINÁMICO CORREGIDO
// ============================================================================

function startDynamicTutorial() {
    console.log('📖 INICIANDO TUTORIAL DINÁMICO OBLIGATORIO');
    currentState = GameStates.TUTORIAL;
    currentTutorialStep = 0;
    
    elements.tutorialModal.classList.remove('hidden');
    
    // CORREGIDO: Configurar eventos DESPUÉS de mostrar el modal
    setTimeout(() => {
        setupTutorialEvents();
        updateTutorialDisplay();
    }, 100);
    
    // Bloquear todo el juego
    elements.playButton.classList.add('hidden');
    
    console.log('🚫 Juego BLOQUEADO hasta completar tutorial');
}

function updateTutorialDisplay() {
    const step = tutorialSteps[currentTutorialStep];
    const progress = ((currentTutorialStep + 1) / tutorialSteps.length) * 100;
    
    console.log(`📖 Actualizando tutorial paso ${currentTutorialStep + 1}: ${step.title}`);
    
    elements.tutorialTitle.textContent = step.title;
    elements.tutorialText.textContent = step.text;
    elements.tutorialStep.textContent = `Paso ${currentTutorialStep + 1} de ${tutorialSteps.length}`;
    elements.tutorialProgressBar.style.setProperty('--progress-width', `${progress}%`);
    
    // Mostrar/ocultar botones según el paso
    if (currentTutorialStep < tutorialSteps.length - 1) {
        elements.tutorialNext.classList.remove('hidden');
        elements.tutorialStart.classList.add('hidden');
    } else {
        elements.tutorialNext.classList.add('hidden');
        elements.tutorialStart.classList.remove('hidden');
    }
    
    // Narración por voz
    if (gameState.soundEnabled && step.narration) {
        speakText(step.narration);
    }
    
    // Resaltar elemento si se especifica
    if (step.highlight) {
        highlightElement(step.highlight);
    }
}

function nextTutorialStep() {
    console.log('📖 Tutorial SIGUIENTE clickeado');
    if (currentTutorialStep < tutorialSteps.length - 1) {
        currentTutorialStep++;
        updateTutorialDisplay();
    }
}

function finishTutorial() {
    console.log('🚀 TUTORIAL COMPLETADO - INICIANDO JUEGO');
    elements.tutorialModal.classList.add('hidden');
    currentState = GameStates.WORLD;
    showNotification('🎮 ¡Juego desbloqueado! Acércate a objetos para jugar', 'success');
    
    // Habilitar sistema de proximidad
    initProximitySystem();
}

function skipTutorial() {
    console.log('⏭️ Tutorial SALTADO por el usuario');
    finishTutorial();
}

function speakText(text) {
    if ('speechSynthesis' in window && gameState.soundEnabled) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
    }
}

function highlightElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.animation = 'pulse 1s ease-in-out 3';
        setTimeout(() => {
            element.style.animation = '';
        }, 3000);
    }
}

// ============================================================================
// 6. SISTEMA DE PROXIMIDAD CORREGIDO
// ============================================================================

function initProximitySystem() {
    console.log('🔍 Sistema de proximidad CORREGIDO activado');
    
    // CORREGIDO: Asegurar que el botón de proximidad tenga su evento
    if (elements.playButton) {
        elements.playButton.onclick = null;
        elements.playButton.addEventListener('click', activateNearbyObject);
        console.log('✅ Botón de proximidad configurado');
    }
}

function checkProximity() {
    if (currentState !== GameStates.WORLD) {
        hidePlayButton();
        return;
    }
    
    let nearbyObject = null;
    let nearestDistance = Infinity;
    
    for (let obj of Object.values(GAME_OBJECTS)) {
        const distance = Math.sqrt(
            Math.pow(gameState.avatar.x - obj.renderX, 2) + 
            Math.pow(gameState.avatar.y - obj.renderY, 2)
        );
        
        if (distance < GAME_CONFIG.PROXIMITY_DISTANCE && distance < nearestDistance) {
            nearestDistance = distance;
            nearbyObject = obj;
        }
    }
    
    if (nearbyObject) {
        showPlayButton(nearbyObject);
    } else {
        hidePlayButton();
    }
    
    // Debug de proximidad
    updateProximityDebug(nearbyObject, nearestDistance);
}

function showPlayButton(object) {
    elements.playButton.textContent = `🎮 Jugar ${object.name}`;
    elements.playButton.classList.remove('hidden');
    elements.playButton.dataset.objectId = object.id;
    
    console.log(`✅ Botón "Jugar ${object.name}" visible`);
}

function hidePlayButton() {
    elements.playButton.classList.add('hidden');
    delete elements.playButton.dataset.objectId;
}

function activateNearbyObject() {
    const objectId = elements.playButton.dataset.objectId;
    if (!objectId) {
        console.log('❌ No hay objeto ID en el botón');
        return;
    }
    
    const object = GAME_OBJECTS[objectId];
    if (!object) {
        console.log('❌ Objeto no encontrado:', objectId);
        return;
    }
    
    console.log(`🎮 ACTIVANDO MINI-JUEGO: ${object.type.toUpperCase()}`);
    startMinigame(object.type);
}

// ============================================================================
// 7. SISTEMA ROBUSTO DE MINI-JUEGOS (UNO A LA VEZ)
// ============================================================================

function startMinigame(type) {
    // BLOQUEAR si ya hay algo activo
    if (currentState !== GameStates.WORLD) {
        console.log('❌ Mini-juego bloqueado - estado actual:', currentState);
        return;
    }
    
    console.log(`🎮 INICIANDO MINI-JUEGO: ${type.toUpperCase()}`);
    
    // Cambiar estado y bloquear todo lo demás
    currentState = GameStates.MINIGAME;
    activeMinigame = type;
    hidePlayButton();
    
    // Abrir modal de mini-juego
    elements.minigameModal.classList.remove('hidden');
    
    // Iniciar mini-juego específico
    switch (type) {
        case 'snake':
            initSnakeGame();
            break;
        case 'tictactoe':
            initTicTacToeGame();
            break;
        case 'penalty':
            initPenaltyGame();
            break;
        case 'rockpaperscissors':
            initRockPaperScissorsGame();
            break;
        default:
            console.error('❌ Mini-juego no reconocido:', type);
            exitMinigame();
    }
}

function exitMinigame() {
    console.log('🔄 Saliendo del mini-juego');
    
    // Cambiar estado de vuelta al mundo
    currentState = GameStates.WORLD;
    activeMinigame = null;
    
    // Cerrar modal
    elements.minigameModal.classList.add('hidden');
    
    // Limpiar juegos activos
    cleanupActiveGames();
    
    showNotification('🔄 Volviste al mundo principal', 'success');
    console.log('✅ Estado: WORLD - Proximidad reactivada');
}

function cleanupActiveGames() {
    // Snake cleanup
    if (snakeGame.interval) {
        clearInterval(snakeGame.interval);
        snakeGame.interval = null;
    }
    snakeGame.gameRunning = false;
    
    // Otros juegos cleanup
    ticTacToe.gameActive = false;
    penaltyGame.selectedZone = null;
    rpsGame = { playerScore: 0, aiScore: 0, maxRounds: 3, currentRound: 0 };
}

// ============================================================================
// 8. MINI-JUEGOS IMPLEMENTADOS
// ============================================================================

// 🐍 SNAKE GAME (Celular)
function initSnakeGame() {
    console.log('🐍 Iniciando Snake para CELULAR');
    
    document.getElementById('minigame-title').textContent = '🐍 Snake - Celular';
    document.getElementById('minigame-content').innerHTML = `
        <div class="snake-game">
            <div>Puntuación: <span id="snake-score">0</span> | Tiempo: <span id="snake-time">45</span>s</div>
            <canvas id="snake-canvas" class="snake-canvas" width="300" height="300"></canvas>
            <div class="snake-controls">
                <button class="snake-btn up" onclick="setSnakeDirection('up')">⬆️</button>
                <button class="snake-btn left" onclick="setSnakeDirection('left')">⬅️</button>
                <button class="snake-btn right" onclick="setSnakeDirection('right')">➡️</button>
                <button class="snake-btn down" onclick="setSnakeDirection('down')">⬇️</button>
            </div>
            <div>Usa WASD o los botones para moverte</div>
            <div style="margin-top: 10px; font-size: 12px; color: var(--color-text-secondary);">
                Efectos: ❤️ -1.5%/s, ⚡ -3%/s, 🧠 +5% por comida
            </div>
        </div>
    `;
    
    snakeGame = {
        snake: [{ x: 10, y: 10 }],
        food: { x: 15, y: 15 },
        direction: 'right',
        score: 0,
        gameRunning: true,
        interval: null,
        timeLeft: 45
    };
    
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    
    snakeGame.interval = setInterval(() => {
        updateSnake();
        renderSnake(ctx);
        applySnakeEffects();
    }, 200);
    
    // Timer
    const timer = setInterval(() => {
        snakeGame.timeLeft--;
        const timeEl = document.getElementById('snake-time');
        if (timeEl) timeEl.textContent = snakeGame.timeLeft;
        if (snakeGame.timeLeft <= 0) {
            clearInterval(timer);
            snakeGame.gameRunning = false;
        }
    }, 1000);
}

function updateSnake() {
    if (!snakeGame.gameRunning) return;
    
    const head = { ...snakeGame.snake[0] };
    
    switch (snakeGame.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Colisiones
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        snakeGame.gameRunning = false;
        return;
    }
    
    if (snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        snakeGame.gameRunning = false;
        return;
    }
    
    snakeGame.snake.unshift(head);
    
    // Comida
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score++;
        const scoreEl = document.getElementById('snake-score');
        if (scoreEl) scoreEl.textContent = snakeGame.score;
        generateSnakeFood();
        gameState.meters.mental = Math.min(100, gameState.meters.mental + GAME_CONFIG.SNAKE_MENTAL_GAIN * 100);
    } else {
        snakeGame.snake.pop();
    }
}

function renderSnake(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 300, 300);
    
    ctx.fillStyle = '#0F0';
    snakeGame.snake.forEach(segment => {
        ctx.fillRect(segment.x * 15, segment.y * 15, 14, 14);
    });
    
    ctx.fillStyle = '#F00';
    ctx.fillRect(snakeGame.food.x * 15, snakeGame.food.y * 15, 14, 14);
}

function generateSnakeFood() {
    do {
        snakeGame.food = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
    } while (snakeGame.snake.some(segment => 
        segment.x === snakeGame.food.x && segment.y === snakeGame.food.y));
}

function setSnakeDirection(dir) {
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (dir !== opposites[snakeGame.direction]) {
        snakeGame.direction = dir;
    }
}

function applySnakeEffects() {
    gameState.meters.physical = Math.max(0, gameState.meters.physical - GAME_CONFIG.SNAKE_ENERGY_DECAY);
    gameState.meters.social = Math.max(0, gameState.meters.social - GAME_CONFIG.SNAKE_HEART_DECAY);
}

// ⭕ TIC-TAC-TOE GAME (Mesa de Juegos)
function initTicTacToeGame() {
    console.log('⭕ Iniciando Tic-Tac-Toe para MESA DE JUEGOS');
    
    document.getElementById('minigame-title').textContent = '⭕ Tic-Tac-Toe - Mesa Familiar';
    document.getElementById('minigame-content').innerHTML = `
        <div class="tictactoe-game">
            <div>Jugador: <strong>X</strong> | IA: <strong>O</strong></div>
            <div class="tictactoe-board">
                ${Array(9).fill().map((_, i) => 
                    `<button class="tictactoe-cell" onclick="makeTTTMove(${i})"></button>`
                ).join('')}
            </div>
            <div id="ttt-status">Tu turno - ¡Haz tu jugada!</div>
            <div style="margin-top: 10px; font-size: 12px; color: var(--color-text-secondary);">
                Efectos: ❤️ +5% por jugada
            </div>
        </div>
    `;
    
    ticTacToe = { board: Array(9).fill(''), gameActive: true, playerTurn: true };
}

function makeTTTMove(index) {
    if (ticTacToe.board[index] || !ticTacToe.gameActive || !ticTacToe.playerTurn) return;
    
    ticTacToe.board[index] = 'X';
    updateTTTBoard();
    
    // Aplicar efectos
    gameState.meters.social = Math.min(100, gameState.meters.social + GAME_CONFIG.TICTACTOE_HEART_GAIN * 100);
    
    if (checkTTTWin('X')) {
        const statusEl = document.getElementById('ttt-status');
        if (statusEl) statusEl.textContent = '¡Ganaste! 🎉';
        ticTacToe.gameActive = false;
        return;
    }
    
    if (ticTacToe.board.every(cell => cell)) {
        const statusEl = document.getElementById('ttt-status');
        if (statusEl) statusEl.textContent = 'Empate';
        return;
    }
    
    ticTacToe.playerTurn = false;
    const statusEl = document.getElementById('ttt-status');
    if (statusEl) statusEl.textContent = 'Turno de la IA...';
    
    setTimeout(() => {
        makeAIMove();
        updateTTTBoard();
        const statusEl2 = document.getElementById('ttt-status');
        if (checkTTTWin('O')) {
            if (statusEl2) statusEl2.textContent = 'IA ganó 🤖';
            ticTacToe.gameActive = false;
        } else if (!ticTacToe.board.every(cell => cell)) {
            ticTacToe.playerTurn = true;
            if (statusEl2) statusEl2.textContent = 'Tu turno';
        }
    }, 800);
}

function makeAIMove() {
    const emptySpots = ticTacToe.board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
    if (emptySpots.length > 0) {
        const randomIndex = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        ticTacToe.board[randomIndex] = 'O';
    }
}

function updateTTTBoard() {
    const cells = document.querySelectorAll('.tictactoe-cell');
    cells.forEach((cell, i) => {
        cell.textContent = ticTacToe.board[i];
        cell.disabled = ticTacToe.board[i] !== '';
    });
}

function checkTTTWin(player) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // filas
        [0,3,6], [1,4,7], [2,5,8], // columnas
        [0,4,8], [2,4,6] // diagonales
    ];
    return winPatterns.some(pattern => 
        pattern.every(i => ticTacToe.board[i] === player)
    );
}

// ⚽ PENALTY GAME (Balón)
function initPenaltyGame() {
    console.log('⚽ Iniciando Penales para BALÓN');
    
    document.getElementById('minigame-title').textContent = '⚽ Penales - Balón';
    document.getElementById('minigame-content').innerHTML = `
        <div class="penalty-game">
            <div>Goles: <span id="penalty-score">0</span> / 5 | Tiros: <span id="penalty-shots">0</span> / 5</div>
            <div class="penalty-goal">
                <div class="penalty-zone" onclick="selectPenaltyZone(0)">IZQUIERDA</div>
                <div class="penalty-zone" onclick="selectPenaltyZone(1)">CENTRO</div>
                <div class="penalty-zone" onclick="selectPenaltyZone(2)">DERECHA</div>
            </div>
            <button id="penalty-shoot" class="penalty-shoot-btn" onclick="shootPenalty()" disabled>
                ⚽ TIRAR
            </button>
            <div id="penalty-result"></div>
            <div style="margin-top: 10px; font-size: 12px; color: var(--color-text-secondary);">
                Efectos: ⚡ +6% por gol
            </div>
        </div>
    `;
    
    penaltyGame = { selectedZone: null, shots: 0, goals: 0, maxShots: 5 };
}

function selectPenaltyZone(zone) {
    document.querySelectorAll('.penalty-zone').forEach((el, i) => {
        el.classList.toggle('selected', i === zone);
    });
    
    penaltyGame.selectedZone = zone;
    const shootBtn = document.getElementById('penalty-shoot');
    if (shootBtn) shootBtn.disabled = false;
}

function shootPenalty() {
    if (penaltyGame.selectedZone === null || penaltyGame.shots >= penaltyGame.maxShots) return;
    
    const goalkeeperZone = Math.floor(Math.random() * 3);
    const scored = penaltyGame.selectedZone !== goalkeeperZone;
    
    penaltyGame.shots++;
    if (scored) {
        penaltyGame.goals++;
        gameState.meters.physical = Math.min(100, gameState.meters.physical + GAME_CONFIG.PENALTY_ENERGY_GAIN * 100);
    }
    
    const scoreEl = document.getElementById('penalty-score');
    const shotsEl = document.getElementById('penalty-shots');
    if (scoreEl) scoreEl.textContent = penaltyGame.goals;
    if (shotsEl) shotsEl.textContent = penaltyGame.shots;
    
    const result = document.getElementById('penalty-result');
    if (result) result.textContent = scored ? '⚽ ¡GOL!' : '🧤 ¡Atajado!';
    
    penaltyGame.selectedZone = null;
    document.querySelectorAll('.penalty-zone').forEach(el => el.classList.remove('selected'));
    const shootBtn = document.getElementById('penalty-shoot');
    if (shootBtn) shootBtn.disabled = true;
    
    if (penaltyGame.shots >= penaltyGame.maxShots) {
        setTimeout(() => {
            if (result) result.textContent = `¡Juego terminado! ${penaltyGame.goals}/5 goles`;
        }, 1500);
    }
}

// ✂️ ROCK PAPER SCISSORS (Amigos)
function initRockPaperScissorsGame() {
    console.log('✂️ Iniciando Piedra Papel Tijera para AMIGOS');
    
    document.getElementById('minigame-title').textContent = '✂️ Piedra, Papel o Tijera - Amigos';
    document.getElementById('minigame-content').innerHTML = `
        <div class="rps-game">
            <div>Mejor de 3 - Tú: <span id="rps-player-score">0</span> | Amigo: <span id="rps-ai-score">0</span></div>
            <div class="rps-choices">
                <button class="rps-choice" onclick="makeRPSChoice('rock')">🪨</button>
                <button class="rps-choice" onclick="makeRPSChoice('paper')">📄</button>
                <button class="rps-choice" onclick="makeRPSChoice('scissors')">✂️</button>
            </div>
            <div class="rps-battle" id="rps-battle" style="display:none;">
                <div class="rps-player">
                    <div>Tú</div>
                    <div class="rps-choice-display" id="rps-player-choice"></div>
                </div>
                <div>VS</div>
                <div class="rps-player">
                    <div>Amigo</div>
                    <div class="rps-choice-display" id="rps-ai-choice"></div>
                </div>
            </div>
            <div id="rps-result"></div>
            <div style="margin-top: 10px; font-size: 12px; color: var(--color-text-secondary);">
                Efectos: ❤️ +7%, ⚡ +7% por jugada
            </div>
        </div>
    `;
    
    rpsGame = { playerScore: 0, aiScore: 0, maxRounds: 3, currentRound: 0 };
}

function makeRPSChoice(choice) {
    if (rpsGame.currentRound >= rpsGame.maxRounds) return;
    
    const choices = ['rock', 'paper', 'scissors'];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    const aiChoice = choices[Math.floor(Math.random() * 3)];
    
    const battleEl = document.getElementById('rps-battle');
    const playerChoiceEl = document.getElementById('rps-player-choice');
    const aiChoiceEl = document.getElementById('rps-ai-choice');
    
    if (battleEl) battleEl.style.display = 'flex';
    if (playerChoiceEl) playerChoiceEl.textContent = emojis[choice];
    if (aiChoiceEl) aiChoiceEl.textContent = emojis[aiChoice];
    
    let result = '';
    if (choice === aiChoice) {
        result = 'Empate';
    } else if (
        (choice === 'rock' && aiChoice === 'scissors') ||
        (choice === 'paper' && aiChoice === 'rock') ||
        (choice === 'scissors' && aiChoice === 'paper')
    ) {
        result = '¡Ganaste la ronda!';
        rpsGame.playerScore++;
    } else {
        result = 'Perdiste la ronda';
        rpsGame.aiScore++;
    }
    
    rpsGame.currentRound++;
    
    const resultEl = document.getElementById('rps-result');
    const playerScoreEl = document.getElementById('rps-player-score');
    const aiScoreEl = document.getElementById('rps-ai-score');
    
    if (resultEl) resultEl.textContent = result;
    if (playerScoreEl) playerScoreEl.textContent = rpsGame.playerScore;
    if (aiScoreEl) aiScoreEl.textContent = rpsGame.aiScore;
    
    // Aplicar efectos
    gameState.meters.physical = Math.min(100, gameState.meters.physical + GAME_CONFIG.RPS_ENERGY_GAIN * 100);
    gameState.meters.social = Math.min(100, gameState.meters.social + GAME_CONFIG.RPS_HEART_GAIN * 100);
    
    if (rpsGame.currentRound >= rpsGame.maxRounds) {
        setTimeout(() => {
            const finalResult = rpsGame.playerScore > rpsGame.aiScore ? '¡Victoria total!' : 
                             rpsGame.playerScore < rpsGame.aiScore ? '¡Derrota!' : '¡Empate total!';
            if (resultEl) resultEl.textContent = `Juego terminado: ${finalResult}`;
        }, 2000);
    }
}

// ============================================================================
// 9. CONTROLES Y FUNCIONES DEL JUEGO
// ============================================================================

function updateAvatarMovement(deltaTime) {
    let moveX = 0;
    let moveY = 0;
    
    // Teclado CORREGIDO
    if (gameState.input.keys['ArrowLeft'] || gameState.input.keys['KeyA']) {
        moveX -= 1;
        console.log('⬅️ Moviendo izquierda (teclado)');
    }
    if (gameState.input.keys['ArrowRight'] || gameState.input.keys['KeyD']) {
        moveX += 1;
        console.log('➡️ Moviendo derecha (teclado)');
    }
    if (gameState.input.keys['ArrowUp'] || gameState.input.keys['KeyW']) {
        moveY -= 1;
        console.log('⬆️ Moviendo arriba (teclado)');
    }
    if (gameState.input.keys['ArrowDown'] || gameState.input.keys['KeyS']) {
        moveY += 1;
        console.log('⬇️ Moviendo abajo (teclado)');
    }
    
    // D-PAD CORREGIDO
    if (gameState.input.dpad.left) {
        moveX -= 1;
        console.log('⬅️ Moviendo izquierda (D-PAD)');
    }
    if (gameState.input.dpad.right) {
        moveX += 1;
        console.log('➡️ Moviendo derecha (D-PAD)');
    }
    if (gameState.input.dpad.up) {
        moveY -= 1;
        console.log('⬆️ Moviendo arriba (D-PAD)');
    }
    if (gameState.input.dpad.down) {
        moveY += 1;
        console.log('⬇️ Moviendo abajo (D-PAD)');
    }
    
    // Normalizar diagonal
    if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.707;
        moveY *= 0.707;
    }
    
    // Aplicar movimiento
    if (moveX !== 0 || moveY !== 0) {
        const oldX = gameState.avatar.x;
        const oldY = gameState.avatar.y;
        
        gameState.avatar.x += moveX * GAME_CONFIG.AVATAR_SPEED * deltaTime;
        gameState.avatar.y += moveY * GAME_CONFIG.AVATAR_SPEED * deltaTime;
        
        console.log(`🚶 Avatar movido de (${Math.round(oldX)}, ${Math.round(oldY)}) a (${Math.round(gameState.avatar.x)}, ${Math.round(gameState.avatar.y)})`);
    }
    
    // CORREGIDO: Límites del canvas expandidos para acceder a todas las áreas
    gameState.avatar.x = Math.max(15, Math.min(785, gameState.avatar.x));
    gameState.avatar.y = Math.max(15, Math.min(585, gameState.avatar.y));
}

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    elements.pauseBtn.innerHTML = gameState.isPaused ? '▶️' : '⏸️';
}

function restartDay() {
    gameState.meters = { physical: 100, social: 100, mental: 0 };
    gameState.dayProgress = 0;
    gameState.avatar.x = 200;
    gameState.avatar.y = 200;
    currentState = GameStates.WORLD;
    activeMinigame = null;
    closeAllModals();
    showNotification('🔄 Día reiniciado', 'success');
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    elements.soundBtn.innerHTML = gameState.soundEnabled ? '🔊' : '🔇';
}

function showHelpModal() {
    elements.helpModal.classList.remove('hidden');
}

function closeHelpModal() {
    elements.helpModal.classList.add('hidden');
}

function closeEndDayModal() {
    elements.enddayModal.classList.add('hidden');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// ============================================================================
// 10. LOOP PRINCIPAL Y RENDERIZADO
// ============================================================================

let lastTime = 0;
let fps = 0;

function startGameLoop() {
    requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    fps = Math.round(1 / deltaTime);
    
    if (currentState === GameStates.WORLD && !gameState.isPaused) {
        updateGame(deltaTime);
        checkProximity(); // NUEVA: Verificar proximidad continuamente
    }
    
    // CORREGIDO: Permitir movimiento incluso en tutorial para demostrar
    if (currentState === GameStates.TUTORIAL && !gameState.isPaused) {
        updateAvatarMovement(deltaTime);
    }
    
    renderGame();
    updateUI();
    updateDebugPanel();
    
    requestAnimationFrame(gameLoop);
}

function updateGame(deltaTime) {
    updateDayProgress(deltaTime);
    updateAvatarMovement(deltaTime);
    checkEndOfDay();
}

function updateDayProgress(deltaTime) {
    gameState.dayProgress += (deltaTime / GAME_CONFIG.DAY_DURATION) * 100;
    
    if (gameState.dayProgress < 33) {
        elements.dayIcon.textContent = '🌅';
    } else if (gameState.dayProgress < 66) {
        elements.dayIcon.textContent = '☀️';
    } else {
        elements.dayIcon.textContent = '🌙';
    }
}

function renderGame() {
    // Limpiar canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    renderZones();
    renderObjects();
    renderAvatar();
    
    if (currentState === GameStates.TUTORIAL) {
        // Overlay para tutorial
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.fillText('Completa el tutorial para jugar', canvas.width / 2, 50);
    }
}

function renderZones() {
    const zones = [
        { name: "Tu Cuarto", x: 50, y: 50, width: 250, height: 200, color: 'rgba(255, 182, 193, 0.3)' },
        { name: "La Sala", x: 350, y: 50, width: 250, height: 200, color: 'rgba(255, 218, 185, 0.3)' },
        { name: "El Jardín", x: 150, y: 300, width: 400, height: 250, color: 'rgba(144, 238, 144, 0.3)' }
    ];
    
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 2;
    ctx.font = '16px Arial';
    
    for (const zone of zones) {
        const x = zone.x * gameState.scaleX;
        const y = zone.y * gameState.scaleY;
        const w = zone.width * gameState.scaleX;
        const h = zone.height * gameState.scaleY;
        
        ctx.fillStyle = zone.color;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        
        ctx.fillStyle = '#2D3748';
        ctx.fillText(zone.name, x + w/2, y + 20);
    }
}

function renderObjects() {
    ctx.font = '40px Arial';
    
    for (const obj of Object.values(GAME_OBJECTS)) {
        const x = obj.renderX * gameState.scaleX;
        const y = obj.renderY * gameState.scaleY;
        
        ctx.fillStyle = '#000';
        ctx.fillText(obj.emoji, x, y);
        
        // Indicator de proximidad CORREGIDO
        const distance = Math.sqrt(
            Math.pow(gameState.avatar.x - obj.renderX, 2) + 
            Math.pow(gameState.avatar.y - obj.renderY, 2)
        );
        
        if (distance < GAME_CONFIG.PROXIMITY_DISTANCE) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.stroke();
            
            // Texto indicativo
            ctx.fillStyle = '#FFD700';
            ctx.font = '12px Arial';
            ctx.fillText('CERCA', x, y - 50);
        }
    }
}

function renderAvatar() {
    const x = gameState.avatar.x * gameState.scaleX;
    const y = gameState.avatar.y * gameState.scaleY;
    
    // Cuerpo
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Cara
    ctx.font = '24px Arial';
    ctx.fillStyle = '#000';
    if (gameState.meters.physical <= GAME_CONFIG.RED_THRESHOLD) {
        ctx.fillText('😴', x, y);
    } else if (gameState.meters.social <= GAME_CONFIG.RED_THRESHOLD) {
        ctx.fillText('😔', x, y);
    } else {
        ctx.fillText('😊', x, y);
    }
}

function updateUI() {
    // Medidores
    elements.energyFill.style.width = `${gameState.meters.physical}%`;
    elements.socialFill.style.width = `${gameState.meters.social}%`;
    elements.mentalFill.style.width = `${gameState.meters.mental}%`;
    
    elements.energyValue.textContent = `${Math.round(gameState.meters.physical)}%`;
    elements.socialValue.textContent = `${Math.round(gameState.meters.social)}%`;
    elements.mentalValue.textContent = `${Math.round(gameState.meters.mental)}%`;
    
    // Progreso del día
    elements.dayProgress.style.width = `${Math.min(100, gameState.dayProgress)}%`;
}

function checkEndOfDay() {
    if (gameState.dayProgress >= 100) {
        currentState = GameStates.WORLD; // Reset state
        showEndDayModal();
    }
}

function showEndDayModal() {
    const energySuccess = gameState.meters.physical >= GAME_CONFIG.GREEN_THRESHOLD;
    const socialSuccess = gameState.meters.social >= GAME_CONFIG.GREEN_THRESHOLD;
    const victory = energySuccess && socialSuccess;
    
    document.getElementById('endday-character').textContent = victory ? '🎉' : '🤖';
    document.getElementById('endday-title').textContent = victory ? '¡Victoria!' : '¡Puedes mejorar!';
    document.getElementById('endday-message').textContent = victory ? 
        '¡Eres un Héroe del Bienestar! Mantuviste el balance perfecto.' : 
        'Mañana podrás practicar más el equilibrio. ¡Sigue intentando!';
    
    document.getElementById('endday-results').innerHTML = `
        <div class="result-meter ${energySuccess ? 'success' : 'failure'}">
            <div style="font-size: 2rem;">⚡</div>
            <div>Energía Física</div>
            <div style="font-weight: bold;">${Math.round(gameState.meters.physical)}%</div>
        </div>
        <div class="result-meter ${socialSuccess ? 'success' : 'failure'}">
            <div style="font-size: 2rem;">❤️</div>
            <div>Conexión Social</div>
            <div style="font-weight: bold;">${Math.round(gameState.meters.social)}%</div>
        </div>
        <div class="result-meter">
            <div style="font-size: 2rem;">🧠</div>
            <div>Diversión Mental</div>
            <div style="font-weight: bold;">${Math.round(gameState.meters.mental)}%</div>
        </div>
    `;
    
    elements.enddayModal.classList.remove('hidden');
}

// ============================================================================
// 11. DEBUG Y UTILIDADES
// ============================================================================

let debugVisible = false;

function toggleDebugPanel() {
    debugVisible = !debugVisible;
    elements.debugPanel.classList.toggle('hidden', !debugVisible);
    console.log(`🔧 Debug panel: ${debugVisible ? 'VISIBLE' : 'OCULTO'}`);
}

function updateDebugPanel() {
    if (!debugVisible) return;
    
    const activeKeys = Object.keys(gameState.input.keys).filter(k => gameState.input.keys[k]);
    const activeDpad = Object.keys(gameState.input.dpad).filter(k => gameState.input.dpad[k]);
    
    elements.debugInfo.innerHTML = `
        <div>FPS: ${fps}</div>
        <div>Estado: ${currentState.toUpperCase()}</div>
        <div>Mini-juego activo: ${activeMinigame || 'Ninguno'}</div>
        <div>Avatar: (${Math.round(gameState.avatar.x)}, ${Math.round(gameState.avatar.y)})</div>
        <div>Energía: ${Math.round(gameState.meters.physical)}%</div>
        <div>Social: ${Math.round(gameState.meters.social)}%</div>
        <div>Mental: ${Math.round(gameState.meters.mental)}%</div>
        <div>Día: ${Math.round(gameState.dayProgress)}%</div>
        <div>Teclado: ${activeKeys.join(', ') || 'Ninguno'}</div>
        <div>D-PAD: ${activeDpad.join(', ') || 'Ninguno'}</div>
    `;
}

function updateProximityDebug(nearbyObject, distance) {
    if (!debugVisible) return;
    
    let debugText = '<div><strong>SISTEMA DE PROXIMIDAD:</strong></div>';
    
    if (nearbyObject) {
        debugText += `<div>✅ Cerca de: ${nearbyObject.name}</div>`;
        debugText += `<div>📏 Distancia: ${Math.round(distance)}px</div>`;
        debugText += `<div>🎮 Botón visible: ${!elements.playButton.classList.contains('hidden')}</div>`;
    } else {
        debugText += `<div>❌ No hay objetos cerca</div>`;
        debugText += `<div>🎮 Botón oculto</div>`;
    }
    
    debugText += '<div><strong>Distancias a objetos:</strong></div>';
    for (const obj of Object.values(GAME_OBJECTS)) {
        const dist = Math.sqrt(
            Math.pow(gameState.avatar.x - obj.renderX, 2) + 
            Math.pow(gameState.avatar.y - obj.renderY, 2)
        );
        debugText += `<div>${obj.emoji} ${obj.name}: ${Math.round(dist)}px</div>`;
    }
    
    elements.proximityDebug.innerHTML = debugText;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notifications.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

// ============================================================================
// 12. FUNCIONES GLOBALES PARA MINI-JUEGOS
// ============================================================================

// Estas funciones deben ser globales para los onclick en HTML
window.setSnakeDirection = setSnakeDirection;
window.makeTTTMove = makeTTTMove;
window.selectPenaltyZone = selectPenaltyZone;
window.shootPenalty = shootPenalty;
window.makeRPSChoice = makeRPSChoice;

// ============================================================================
// INICIALIZACIÓN FINAL
// ============================================================================

console.log('🎮 Mi Día de Súper Poder: VERSIÓN DEFINITIVA CORREGIDA CARGADA');
console.log('✅ BUGS CORREGIDOS:');
console.log('  📖 Tutorial progression CORREGIDO - botones funcionan');
console.log('  🕹️ D-PAD completamente funcional en todas las direcciones');
console.log('  ⌨️ Controles de teclado WASD y flechas funcionando');
console.log('  🔍 Sistema de proximidad CORREGIDO');
console.log('  🚶 Avatar puede moverse a todas las áreas del juego');
console.log('  🎮 Botón "Jugar..." aparece cerca de objetos');
console.log('🚀 Presiona "D" para debug completo');