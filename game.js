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
    let rand = Math.random();
    let type = 'normal';
    if (rand < 0.05) type = 'bomb';      // 5% Chance
    else if (rand < 0.15) type = 'gold'; // 10% Chance

    let speed = (type === 'bomb' ? 15 : (type === 'gold' ? 14 : 8)) + (Math.random() * 3);

    nuts.push({
        x: Math.random() * (1920 - 60),
        y: -60,
        width: 60,
        height: 60,
        speed: speed,
        type: type
    });
}

function updateGame() {
    // Eichhörnchen Bewegung
    if (squirrel.movingLeft && squirrel.x > 0) squirrel.x -= squirrel.speed;
    if (squirrel.movingRight && squirrel.x < 1920 - squirrel.width) squirrel.x += squirrel.speed;

    dropTimer++;
    if (dropTimer > 30) { 
        spawnNut(); 
        dropTimer = 0; 
    }

    // Nüsse/Bomben Kollision
    for (let i = nuts.length - 1; i >= 0; i--) {
        let n = nuts[i];
        n.y += n.speed;

        // Prüfen, ob Nuss das Eichhörnchen berührt
        if (n.x < squirrel.x + squirrel.width && n.x + n.width > squirrel.x &&
            n.y < squirrel.y + squirrel.height && n.y + n.height > squirrel.y) {
            
            // Logik für Bombe
            if (n.type === 'bomb') {
                new Audio('bang.mp3').play().catch(e => console.log("Sound konnte nicht abgespielt werden"));
                gameActive = false;
                endGame(null);
                return;
            }
            
            // Logik für Punkte
            score += (n.type === 'gold') ? 50 : 10;
            nuts.splice(i, 1);
            continue;
        }

        // Nuss unten aus dem Bild entfernt
        if (n.y > 1080) {
            nuts.splice(i, 1);
        }
    }
}

function drawGame() {
    // Canvas leeren
    ctx.clearRect(0, 0, 1920, 1080);
    
    // Hintergrund zeichnen
    if(bgImg.complete) ctx.drawImage(bgImg, 0, 0, 1920, 1080);
    
    // Eichhörnchen zeichnen
    if(squirrelImg.complete) {
        ctx.drawImage(squirrelImg, squirrel.x, squirrel.y, squirrel.width, squirrel.height);
    } else {
        ctx.fillStyle = "orange";
        ctx.fillRect(squirrel.x, squirrel.y, squirrel.width, squirrel.height);
    }

    // Nüsse/Bomben zeichnen
    for (let n of nuts) {
        let img = (n.type === 'bomb') ? bombImg : (n.type === 'gold' ? goldNutImg : nutImg);
        if(img.complete) {
            ctx.drawImage(img, n.x, n.y, n.width, n.height);
        } else {
            // Fallback Farben
            ctx.fillStyle = (n.type === 'bomb') ? "red" : (n.type === 'gold' ? "gold" : "saddlebrown");
            ctx.fillRect(n.x, n.y, n.width, n.height);
        }
    }

    // UI (Punkte & Zeit) mit schwarzem Rahmen
    ctx.font = "bold 60px sans-serif";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";

    // Punkte links
    ctx.textAlign = "left";
    ctx.strokeText("Punkte: " + score, 40, 80);
    ctx.fillText("Punkte: " + score, 40, 80);

    // Zeit rechts
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
    if(timerInterval) clearInterval(timerInterval);
    
    const hs = document.getElementById("highscore-screen");
    const list = document.getElementById("highscore-list");
    const restartBtn = document.getElementById("restart-button");
    
    hs.style.display = "block";
    list.innerHTML = `<li>Dein Ergebnis: ${score} Punkte</li>`;
    
    // Timer-Logik
    let countdown = 10;
    const textElement = document.createElement("p");
    textElement.id = "countdown-text";
    textElement.style.color = "orange";
    hs.appendChild(textElement);
    
    restartBtn.style.display = "none";
    
    const interval = setInterval(() => {
        countdown--;
        textElement.innerText = `Nächste Runde startet in ${countdown} Sekunden...`;
        
        if (countdown <= 0) {
            clearInterval(interval);
            textElement.remove();
            restartBtn.style.display = "inline-block";
            restartBtn.onclick = () => {
                hs.style.display = "none";
                startGame();
            };
        }
    }, 1000);
}