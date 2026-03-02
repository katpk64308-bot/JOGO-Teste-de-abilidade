// Canvas base do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const orientationOverlay = document.getElementById("orientation-lock");
const miniMap = document.getElementById("miniMap");
const isMobileDevice = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;

// Estado principal do jogo
let player;
let platforms = [];
let gameRunning = false;
let orientationBlocked = false;

// Mapa simples de controles
const controls = {
    left: false,
    right: false,
    down: false,
};

// Cria o layout das plataformas
function buildPlatforms() {
    platforms = [
        new Floor(canvas.width, canvas.height), // chao
        new Platform(300, canvas.height - 180, 220, 20),
        new Platform(620, canvas.height - 280, 180, 20),
    ];
}

function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

function updateOrientationGate() {
    orientationBlocked = isMobileDevice && isPortraitMode();

    if (orientationOverlay) {
        orientationOverlay.classList.toggle("is-visible", orientationBlocked);
    }

    if (miniMap) {
        miniMap.style.display = orientationBlocked ? "none" : "block";
    }
}

async function tryLockLandscape() {
    if (!isMobileDevice) return;
    if (!window.screen || !screen.orientation || !screen.orientation.lock) return;

    try {
        await screen.orientation.lock("landscape");
    } catch (_) {
        // Alguns navegadores exigem fullscreen/gesto do usuario.
    }
}

// Inicializa o jogo e comeca o loop
function startGame() {
    updateOrientationGate();
    tryLockLandscape();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    player = new Player();
    buildPlatforms();

    gameRunning = true;
    gameLoop();
}

// Tecla pressionada
function handleKeyDown(e) {
    switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
            controls.left = true;
            break;
        case "ArrowRight":
        case "KeyD":
            controls.right = true;
            break;
        case "ArrowDown":
        case "KeyS":
            controls.down = true;
            break;
        case "ArrowUp":
        case "Space":
            if (player) player.jump();
            break;
        default:
            return;
    }

    e.preventDefault();
}

// Tecla solta
function handleKeyUp(e) {
    switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
            controls.left = false;
            break;
        case "ArrowRight":
        case "KeyD":
            controls.right = false;
            break;
        case "ArrowDown":
        case "KeyS":
            controls.down = false;
            break;
        default:
            return;
    }

    e.preventDefault();
}

// Eventos de entrada e de janela
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("mousedown", () => {
    if (player) player.jump();
});
window.addEventListener(
    "touchstart",
    () => {
        tryLockLandscape();
    },
    { passive: true }
);

window.addEventListener("resize", () => {
    if (!gameRunning) return;
    updateOrientationGate();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildPlatforms();
});

window.addEventListener("orientationchange", updateOrientationGate);

window.addEventListener("DOMContentLoaded", startGame);

// Loop principal
function gameLoop() {
    if (!gameRunning) return;
    updateOrientationGate();

    if (orientationBlocked) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(gameLoop);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const horizontalDirection = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    player.setHorizontalInput(horizontalDirection);

    if (controls.down && !player.isGrounded) {
        player.vy += 0.35;
    }

    // Atualiza e desenha
    player.update(platforms, canvas.width);
    platforms.forEach((p) => p.draw(ctx));
    player.draw(ctx);

    requestAnimationFrame(gameLoop);
}
