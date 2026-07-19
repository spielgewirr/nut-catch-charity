// post_highscore.js
const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app";
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

async function postHighscore() {
    const response = await fetch(`${DATABASE_URL}/highscores.json`);
    const data = await response.json();

    // Wir senden die komplette Struktur an Discord, um den Fehler zu finden
    const debugMessage = "DEBUG INFO: " + JSON.stringify(data).substring(0, 1900);

    await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: debugMessage })
    });
}
postHighscore();