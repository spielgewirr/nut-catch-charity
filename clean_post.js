// clean_post.js
async function run() {
    await fetch(process.env.DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "TEST-TEST-TEST" })
    });
}
run();