const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

// ======================
// WEB SERVER (Render Pflicht)
// ======================
const app = express();

app.get("/", (req, res) => {
    res.send("Bot läuft");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Webserver läuft auf Port " + PORT);
});

// ======================
// DISCORD BOT
// ======================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ======================
// CONFIG
// ======================
const ROLE_IDS = [
    "1508899625258717355",
    "1507456888843800596"
];

const LOG_CHANNEL_ID = "1507456889615810642";

// ======================
// READY
// ======================
client.once("ready", () => {
    console.log("Bot online: " + client.user.tag);
});

// ======================
// AUTO ROLES + JOIN LOG
// ======================
client.on("guildMemberAdd", async (member) => {

    // ===== AUTO ROLES =====
    for (const roleId of ROLE_IDS) {
        const role = member.guild.roles.cache.get(roleId);

        if (role) {
            member.roles.add(role).catch(console.error);
        }
    }

    // ===== LOG CHANNEL =====
    const logChannel = await member.guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);

    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle("⚡️ Logging ⚡️")
        .setDescription(
            `<@${member.id}> ist gejoined!\n\n` +
            `UserId: ${member.id}\n\n` +
            `Aktuelle Memberanzahl: ${member.guild.memberCount}`
        )
        .setColor(0x00ffcc)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setFooter({ text: "powered by PowerBot" })
        .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
});

// ======================
// LOGIN
// ======================
client.login(process.env.DISCORD_TOKEN);
