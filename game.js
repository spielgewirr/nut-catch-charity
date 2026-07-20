const SECRET_PASSWORD = "1aWuselSupport2026";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let timeLeft = 60;
let gameActive = false;
let nuts = [];
let dropTimer = 0;

const bgImg = new Image(); bgImg.src = "bg.png";
const squirrelImg = new Image(); squirrelImg.src = "squirrel.png";
const nutImg = new Image(); nutImg.src = "nut.png";
const goldNutImg = new Image(); goldNutImg.src = "goldnut.png";

const squirrel = {
    x: 1920 / 2 - 100, y: 1080 - 220, width: 200, height: 200, speed: 15,
    movingLeft: false, movingRight: false
};

// Steuerung
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") squirrel.movingLeft = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") squirrel.movingRight = true;
});
document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") squirrel.movingLeft = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") squirrel.movingRight = false;
});

// Login
document.getElementById("login-button").onclick = () => {
    const input = document.getElementById("password-input").value;
    if (input === SECRET_PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startGame();
    } else {
        alert("Passwort falsch!");
    }
};

function startGame() {
    score = 0; timeLeft = 60; nuts = []; gameActive = true;
    squirrel.x = 1920 / 2 - 100;
    const timerInterval = setInterval(() => {
        if(gameActive) {
            timeLeft--;
            if(timeLeft <= 0) endGame(timerInterval);
        }
    }, 1000);
    gameLoop();
}

function spawnNut() {
    let isGold = Math.random() < 0.1;
    nuts.push({
        x: Math.random() * (1920 - 60), y: -60, width: 60, height: 60,
        speed: isGold ? Math.random() * 5 + 12 : Math.random() * 5 + 8,
        type: isGold ? 'gold' : 'normal'
    });
}

function updateGame() {
    if (squirrel.movingLeft && squirrel.x > 0) squirrel.x -= squirrel.speed;
    if (squirrel.movingRight && squirrel.x < 1920 - squirrel.width) squirrel.x += squirrel.speed;
    dropTimer++;
    if (dropTimer > 30) { spawnNut(); dropTimer = 0; }
    for (let i = nuts.length - 1; i >= 0; i--) {
        let n = nuts[i];
        n.y += n.speed;
        if (n.x < squirrel.x + squirrel.width && n.x + n.width > squirrel.x &&
            n.y < squirrel.y + squirrel.height && n.y + n.height > squirrel.y) {
            score += (n.type === 'gold') ? 50 : 10;
            nuts.splice(i, 1);
            continue;
        }
        if (n.y > 1080) nuts.splice(i, 1);
    }
}

function drawGame() {
    ctx.clearRect(0, 0, 1920, 1080);
    if(bgImg.complete) ctx.drawImage(bgImg, 0, 0, 1920, 1080);
    if(squirrelImg.complete) ctx.drawImage(squirrelImg, squirrel.x, squirrel.y, squirrel.width, squirrel.height);
    for (let n of nuts) {
        let img = (n.type === 'gold' && goldNutImg.complete) ? goldNutImg : nutImg;
        if(img.complete) ctx.drawImage(img, n.x, n.y, n.width, n.height);
        else ctx.fillRect(n.x, n.y, n.width, n.height);
    }
    ctx.font = "bold 60px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("Punkte: " + score, 40, 80);
    ctx.fillText("Zeit: " + timeLeft + "s", 1600, 80);
}

function gameLoop() {
    if (!gameActive) return;
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function endGame(timerInterval) {
    gameActive = false;
    clearInterval(timerInterval);
    const hs = document.getElementById("highscore-screen");
    hs.style.display = "block";
    document.getElementById("highscore-list").innerHTML = `<li>Dein Ergebnis: ${score} Punkte</li>`;
    document.getElementById("restart-button").onclick = () => {
        hs.style.display = "none";
        startGame();
    };
}