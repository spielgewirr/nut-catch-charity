// run_score.js
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";

async function run() {
    const res = await fetch(DATABASE_URL);
    const data = await res.json();
    
    // Wir senden nur die Keys, damit wir sehen, ob überhaupt Daten da sind
    const keys = Object.keys(data || {}).join(", ");
    
    await fetch(process.env.DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Datenbank-Keys: " + keys })
    });
}
run();