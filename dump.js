const DATABASE_URL = "https://eichhoernchen-charity-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";

async function dump() {
    console.log("Starte Dump...");
    try {
        const res = await fetch(DATABASE_URL);
        const data = await res.json();
        const msg = "ROHDATEN: " + JSON.stringify(data);
        
        await fetch(process.env.DISCORD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: msg })
        });
        console.log("Gesendet!");
    } catch (e) {
        console.error(e);
    }
}
dump();