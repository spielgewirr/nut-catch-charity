// post_highscore.js
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app";
const GAME_LINK = "https://spielgewirr.github.io/nut-catch-charity/";
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

async function postHighscore() {
    console.log("Rufe Highscores von Firebase ab...");
    
    try {
        const response = await fetch(`${DATABASE_URL}/highscores.json?orderBy="score"&limitToLast=10`);
        const data = await response.json();

        if (!data) {
            return console.log("Keine Daten gefunden.");
        }

        // Wir filtern kaputte Datensätze und sortieren sie sicher
        const scores = Object.values(data)
            .filter(entry => entry && typeof entry.score !== 'undefined' && entry.name)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Davon nehmen wir die Top 3

        if (scores.length === 0) {
            return console.log("Keine gültigen Highscores zum Posten gefunden.");
        }

        let message = "🐿️ **Die Wusel-Meister der Woche!** 🐿️\n\n";
        const medals = ["🥇", "🥈", "🥉"];
        
        scores.forEach((entry, i) => {
            message += `${medals[i]} **${entry.name}** mit ${entry.score} Punkten\n`;
        });
        
        message += `\nSpiele jetzt mit und fange so viele Nüsse wie möglich!: ${GAME_LINK}`;

        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
        });
        
        console.log("Erfolgreich an Discord gesendet!");
    } catch (error) {
        console.error("Fehler beim Abrufen/Senden:", error);
    }
}

postHighscore();