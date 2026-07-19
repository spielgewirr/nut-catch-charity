// post_highscore.js
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app";
const GAME_LINK = "https://spielgewirr.github.io/nut-catch-charity/";
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

async function postHighscore() {
    console.log("Rufe Highscores ab...");
    
    try {
        const response = await fetch(`${DATABASE_URL}/highscores.json`);
        const data = await response.json();

        if (!data) {
            console.log("Keine Daten gefunden.");
            return;
        }

        // Wir wandeln das Objekt in eine Liste um
        const entries = Object.values(data);
        
        // Wir suchen in jedem Eintrag nach 'score' und 'name', egal ob sie direkt da sind
        // oder in einem Unterobjekt versteckt (das löst das 'undefined' Problem)
        const scores = entries.map(entry => {
            // Wenn der Eintrag direkt name/score hat, nimm das. 
            // Wenn nicht, schau ob es in einem Unterobjekt steckt.
            const name = entry.name || (entry.value && entry.value.name) || "Unbekannt";
            const score = entry.score !== undefined ? entry.score : (entry.value && entry.value.score) || 0;
            return { name, score };
        })
        .filter(entry => entry.score > 0) // Nur gültige Scores
        .sort((a, b) => b.score - a.score) // Sortieren
        .slice(0, 3); // Top 3

        if (scores.length === 0) {
            console.log("Keine Highscores zum Posten.");
            return;
        }

        // Discord-Nachricht zusammenbauen
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
        
        console.log("Erfolgreich gepostet!");
    } catch (error) {
        console.error("Fehler:", error);
    }
}

postHighscore();