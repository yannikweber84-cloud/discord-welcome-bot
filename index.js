const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();

// Webserver für Render + UptimeRobot
app.get("/", (req, res) => {
    res.send("Bot läuft!");
});

app.listen(3000, () => {
    console.log("🌍 Webserver läuft");
});

// Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Bot online
client.once("clientReady", () => {
    console.log(`✅ Bot online als ${client.user.tag}`);
});

// Wenn jemand joint
client.on("guildMemberAdd", async (member) => {

    // Rollen die gegeben werden sollen
    const rollen = [
        "Mitglied",
        "💎Mitglied💎"
    ];

    for (const rollenName of rollen) {

        const rolle = member.guild.roles.cache.find(
            r => r.name === rollenName
        );

        if (rolle) {
            await member.roles.add(rolle);
            console.log(`${member.user.tag} bekam Rolle ${rollenName}`);
        }
    }
});

// Fehler Schutz
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// Login
client.login(process.env.DISCORD_TOKEN);