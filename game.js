const SECRET_PASSWORD = "1aWuselSupport2026";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyB3ecrvvJvBK7OzRysFXRSmPEOnVHQXIxE",
  authDomain: "eichhoernchen-charity.firebaseapp.com",
  databaseURL: "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eichhoernchen-charity",
  storageBucket: "eichhoernchen-charity.firebasestorage.app",
  messagingSenderId: "199113442226",
  appId: "1:199113442226:web:133e97760ae8854156daab"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
    const newScoreRef = database.ref('highscores').push();
    newScoreRef.set({
        name: name,
        score: finalScore,
        passwordCheck: SECRET_PASSWORD,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

function displayHighscores() {
    const highscoreScreen = document.getElementById("highscore-screen");
    const list = document.getElementById("highscore-list");
    const countdownText = document.getElementById("countdown-text");
    const restartButton = document.getElementById("restart-button");
    
    highscoreScreen.style.display = "block";
    list.innerHTML = "Lade Highscores... 🐿️";
    restartButton.style.display = "none";
    countdownText.style.display = "block";

    database.ref('highscores').orderByChild('score').limitToLast(10).once('value')
        .then((snapshot) => {
            let scoresArray = [];
            snapshot.forEach((child) => {
                scoresArray.push(child.val());
            });
            scoresArray.reverse();
            
            list.innerHTML = "";
            if(scoresArray.length === 0) {
                list.innerHTML = "<li>Noch keine Einträge!</li>";
            } else {
                scoresArray.forEach((entry, index) => {
                    let medal = index < 3 ? ["🥇 ", "🥈 ", "🥉 "][index] : "";
                    list.innerHTML += `<li>${medal}${entry.name}: <b>${entry.score}</b></li>`;
                });
            }
        })
        .catch(() => {
            list.innerHTML = "Fehler beim Laden.";
        });

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