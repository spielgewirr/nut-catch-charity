// post_highscore.js

// === EINSTELLUNGEN (Hier anpassen) ===
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app"; // z.B. https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app
const GAME_LINK = "https://spielgewirr.github.io/nut-catch-charity/"; // z.B. https://spielgewirr.github.io/nut-catch-charity/
// =====================================

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

async function postHighscore() {
    console.log("Rufe Highscores von Firebase ab...");
    
    // Die Top 3 direkt über die Firebase-Schnittstelle abrufen
    const response = await fetch(`${DATABASE_URL}/highscores.json?orderBy="score"&limitToLast=3`);
    const data = await response.json();

    if (!data) {
        return console.log("Noch keine Highscores vorhanden. Skript beendet.");
    }

    // Daten sortieren (Höchste Punktzahl zuerst)
    const scores = Object.values(data).sort((a, b) => b.score - a.score);

    // Discord-Nachricht zusammenbauen
    let message = "🐿️ **Die Wusel-Meister der Woche!** 🐿️\n\n";
    const medals = ["🥇", "🥈", "🥉"];
    
    scores.forEach((entry, i) => {
        message += `${medals[i]} **${entry.name}** mit ${entry.score} Punkten\n`;
    });
    
    message += `\nSpiele jetzt mit und rette Eichhörnchen: ${GAME_LINK}`;

    // Nachricht an Discord senden
    console.log("Sende an Discord...");
    await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
    });
    
    console.log("Erfolgreich gepostet!");
}

postHighscore();