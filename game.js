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

const squirrel = {
    x: 1920 / 2 - 100,
    y: 1080 - 220,
    width: 200,
    height: 200,
    speed: 15,
    movingLeft: false,
    movingRight: false
};

document.getElementById("login-button").addEventListener("click", () => {
    const input = document.getElementById("password-input").value;
    if (input === SECRET_PASSWORD) {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("game-container").style.display = "flex";
        startGame();
    } else {
        document.getElementById("error-msg").style.display = "block";
    }
});

function startGame() {
    score = 0;
    timeLeft = 60;
    nuts = [];
    gameActive = true;
    squirrel.x = 1920 / 2 - 100;
    
    const timerInterval = setInterval(() => {
        if(gameActive) {
            timeLeft--;
            if(timeLeft <= 0) {
                endGame(timerInterval);
            }
        }
    }, 1000);

    gameLoop();
}

window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") squirrel.movingLeft = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") squirrel.movingRight = true;
});
window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") squirrel.movingLeft = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") squirrel.movingRight = false;
});
window.addEventListener("touchstart", (e) => {
    if(!gameActive) return;
    const touchX = e.touches[0].clientX;
    const screenWidth = window.innerWidth;
    if(touchX < screenWidth / 2) squirrel.movingLeft = true;
    else squirrel.movingRight = true;
});
window.addEventListener("touchend", () => {
    squirrel.movingLeft = false;
    squirrel.movingRight = false;
});

function spawnNut() {
    nuts.push({
        x: Math.random() * (1920 - 60),
        y: -60,
        width: 60,
        height: 60,
        speed: Math.random() * 5 + 8
    });
}

function updateGame() {
    if (squirrel.movingLeft && squirrel.x > 0) squirrel.x -= squirrel.speed;
    if (squirrel.movingRight && squirrel.x < 1920 - squirrel.width) squirrel.x += squirrel.speed;

    dropTimer++;
    if (dropTimer > 30) {
        spawnNut();
        dropTimer = 0;
    }

    for (let i = nuts.length - 1; i >= 0; i--) {
        let n = nuts[i];
        n.y += n.speed;

        if (n.x < squirrel.x + squirrel.width &&
            n.x + n.width > squirrel.x &&
            n.y < squirrel.y + squirrel.height &&
            n.y + n.height > squirrel.y) {
            
            score += 10;
            nuts.splice(i, 1);
            continue;
        }

        if (n.y > 1080) {
            nuts.splice(i, 1);
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, 1920, 1080);
    if(bgImg.complete) ctx.drawImage(bgImg, 0, 0, 1920, 1080);

    if(squirrelImg.complete) {
        ctx.drawImage(squirrelImg, squirrel.x, squirrel.y, squirrel.width, squirrel.height);
    } else {
        ctx.fillStyle = "orange";
        ctx.fillRect(squirrel.x, squirrel.y, squirrel.width, squirrel.height);
    }

    for (let n of nuts) {
        if(nutImg.complete) {
            ctx.drawImage(nutImg, n.x, n.y, n.width, n.height);
        } else {
            ctx.fillStyle = "saddlebrown";
            ctx.fillRect(n.x, n.y, n.width, n.height);
        }
    }

    ctx.font = "bold 60px sans-serif";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";

    ctx.textAlign = "left";
    ctx.strokeText("Punkte: " + score, 40, 80);
    ctx.fillText("Punkte: " + score, 40, 80);

    ctx.textAlign = "right";
    ctx.strokeText("Zeit: " + timeLeft + "s", 1920 - 40, 80);
    ctx.fillText("Zeit: " + timeLeft + "s", 1920 - 40, 80);
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
    
    setTimeout(() => {
        let playerName = prompt(`Zeit abgelaufen! Du hast ${score} Punkte gesammelt.\nTrage deinen Namen ein:`);
        
        if(playerName && playerName.trim() !== "") {
            saveHighscore(playerName, score);
        }
        displayHighscores();
    }, 100);
}

function saveHighscore(name, finalScore) {
    let allScores = JSON.parse(localStorage.getItem('nutCatchScores') || "[]");
    allScores.push({ name: name, score: finalScore });
    allScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('nutCatchScores', JSON.stringify(allScores.slice(0, 10)));
}

function displayHighscores() {
    const highscoreScreen = document.getElementById("highscore-screen");
    const list = document.getElementById("highscore-list");
    const countdownText = document.getElementById("countdown-text");
    const restartButton = document.getElementById("restart-button");
    
    highscoreScreen.style.display = "block";
    list.innerHTML = "";
    restartButton.style.display = "none";
    countdownText.style.display = "block";

    // Wir holen nur den Score, den der Spieler gerade eben erzielt hat
    // Da wir ihn in 'score' gespeichert haben, zeigen wir ihn direkt an:
    list.innerHTML = `<li style="font-size: 24px; list-style: none; margin-top: 20px;">
        Du hast gerade <b>${score} Punkte</b> mit gefangenen Nüssen erzielt!<br><br>
        Weiter so! 🐿️
    </li>`;

    let waitTime = 10;
    countdownText.innerText = `Nächste Runde möglich in ${waitTime} Sekunden...`;
    
    const countdownInterval = setInterval(() => {
        waitTime--;
        if(waitTime > 0) {
            countdownText.innerText = `Nächste Runde möglich in ${waitTime} Sekunden...`;
        } else {
            clearInterval(countdownInterval);
            countdownText.style.display = "none";
            restartButton.style.display = "inline-block";
        }
    }, 1000);

    restartButton.onclick = () => {
        highscoreScreen.style.display = "none";
        startGame();
    };
}