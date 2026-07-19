// post_highscore.js
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

async function postHighscore() {
    try {
        const response = await fetch(DATABASE_URL);
        const data = await response.json();

        if (!data) return;

        // Wir wandeln das Firebase-Objekt (mit den IDs als Keys) in ein normales Array um
        const scores = Object.keys(data).map(key => data[key]);

        // Sortieren nach Score (höchste zuerst)
        scores.sort((a, b) => b.score - a.score);

        // Die Top 3 auswählen
        const top3 = scores.slice(0, 3);

        let message = "🐿️ **Die Wusel-Meister der Woche!** 🐿️\n\n";
        const medals = ["🥇", "🥈", "🥉"];
        
        top3.forEach((entry, i) => {
            message += `${medals[i]} **${entry.name}** mit ${entry.score} Punkten\n`;
        });
        
        message += `\nSpiele jetzt mit und fange so viele Nüsse wie möglich!: https://spielgewirr.github.io/nut-catch-charity/`;

        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
        });
        
        console.log("Erfolgreich gepostet!");
    } catch (error) {
        console.error("Fehler:", error);
    }
}

postHighscore();