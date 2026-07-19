// dump.js
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";

async function dump() {
    const res = await fetch(DATABASE_URL);
    const data = await res.json();
    
    // Wir senden die kompletten Rohdaten als Text an Discord
    await fetch(process.env.DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "ROHDATEN: " + JSON.stringify(data) })
    });
}
dump();