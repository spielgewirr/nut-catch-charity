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

const squirrel = { x: 860, y: 860, width: 200, height: 200, speed: 15, movingLeft: false, movingRight: false };

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") squirrel.movingLeft = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") squirrel.movingRight = true;
});
document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") squirrel.movingLeft = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") squirrel.movingRight = false;
});

document.getElementById("login-button").onclick = () => {
    if (document.getElementById("password-input").value === SECRET_PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startGame();
    }
};

function startGame() {
    score = 0; timeLeft = 60; nuts = []; gameActive = true;
    const timerInterval = setInterval(() => {
        if(gameActive) {
            timeLeft--;
            if(timeLeft <= 0) {
                gameActive = false;
                clearInterval(timerInterval);
            }
        }
    }, 1000);
    gameLoop();
}

function updateGame() {
    if (squirrel.movingLeft && squirrel.x > 0) squirrel.x -= squirrel.speed;
    if (squirrel.movingRight && squirrel.x < 1720) squirrel.x += squirrel.speed;
    
    dropTimer++;
    if (dropTimer > 30) {
        nuts.push({ x: Math.random() * 1860, y: -60, type: Math.random() < 0.1 ? 'gold' : 'normal' });
        dropTimer = 0;
    }
    
    for (let i = nuts.length - 1; i >= 0; i--) {
        nuts[i].y += 8;
        if (nuts[i].y > 860 && nuts[i].x > squirrel.x - 50 && nuts[i].x < squirrel.x + 150) {
            score += (nuts[i].type === 'gold' ? 50 : 10);
            nuts.splice(i, 1);
        } else if (nuts[i].y > 1080) nuts.splice(i, 1);
    }
}

function drawGame() {
    ctx.clearRect(0, 0, 1920, 1080);
    if(bgImg.complete) ctx.drawImage(bgImg, 0, 0, 1920, 1080);
    ctx.drawImage(squirrelImg, squirrel.x, squirrel.y, 200, 200);
    for (let n of nuts) ctx.drawImage(n.type === 'gold' ? goldNutImg : nutImg, n.x, n.y, 60, 60);
    
    ctx.font = "bold 60px sans-serif";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    
    ctx.textAlign = "left";
    ctx.strokeText("Punkte: " + score, 40, 80);
    ctx.fillText("Punkte: " + score, 40, 80);
    
    ctx.textAlign = "right";
    ctx.strokeText("Zeit: " + timeLeft + "s", 1880, 80);
    ctx.fillText("Zeit: " + timeLeft + "s", 1880, 80);
}

function gameLoop() {
    if (!gameActive) return;
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}