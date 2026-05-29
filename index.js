const express = require("express");
const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");

// ======================
// WEB SERVER (Render Fix)
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
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message
    ]
});

// ======================
// CONFIG
// ======================
const LOG_CHANNEL_ID = "1508905272972673104";

const ROLE_IDS = [
    "1508899625258717355",
    "1507456888843800596"
];

// ======================
// HELP
// ======================
function logChannel(guild) {
    return guild.channels.cache.get(LOG_CHANNEL_ID);
}

// ======================
// READY
// ======================
client.once("clientReady", () => {
    console.log("Bot online: " + client.user.tag);
});

// ======================
// JOIN + ROLES
// ======================
client.on("guildMemberAdd", async (member) => {

    for (const roleId of ROLE_IDS) {
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
            await member.roles.add(role).catch(() => {});
        }
    }

    const log = logChannel(member.guild);
    if (log) {
        log.send(
            `@${member.user.username} ist dem Server beigetreten.`
        );
    }
});

// ======================
// LEAVE
// ======================
client.on("guildMemberRemove", async (member) => {

    const log = logChannel(member.guild);
    if (log) {
        log.send(
            `@${member.user.username} hat den Server verlassen.`
        );
    }
});

// ======================
// BAN
// ======================
client.on("guildBanAdd", async (ban) => {

    const log = logChannel(ban.guild);
    if (log) {
        log.send(
            `🚫 ${ban.user.tag} wurde gebannt.`
        );
    }
});

// ======================
// UNBAN
// ======================
client.on("guildBanRemove", async (ban) => {

    const log = logChannel(ban.guild);
    if (log) {
        log.send(
            `✅ ${ban.user.tag} wurde entbannt.`
        );
    }
});

// ======================
// MESSAGE DELETE
// ======================
client.on("messageDelete", (msg) => {

    if (!msg.guild) return;

    const log = logChannel(msg.guild);
    if (!log) return;

    log.send(
        `🗑️ Eine Nachricht wurde gelöscht in #${msg.channel.name}`
    );
});

// ======================
// MESSAGE EDIT
// ======================
client.on("messageUpdate", (oldMsg) => {

    if (!oldMsg.guild) return;

    const log = logChannel(oldMsg.guild);
    if (!log) return;

    log.send(
        `✏️ Eine Nachricht wurde bearbeitet in #${oldMsg.channel.name}`
    );
});

// ======================
// CHANNEL LOGS
// ======================
client.on("channelCreate", (c) => {

    const log = logChannel(c.guild);
    if (!log) return;

    log.send(
        `📁 Channel erstellt: ${c.name}`
    );
});

client.on("channelDelete", (c) => {

    const log = logChannel(c.guild);
    if (!log) return;

    log.send(
        `🗑️ Channel gelöscht: ${c.name}`
    );
});

// ======================
// ROLE LOGS
// ======================
client.on("roleCreate", (r) => {

    const log = logChannel(r.guild);
    if (!log) return;

    log.send(
        `➕ Rolle erstellt: ${r.name}`
    );
});

client.on("roleDelete", (r) => {

    const log = logChannel(r.guild);
    if (!log) return;

    log.send(
        `➖ Rolle gelöscht: ${r.name}`
    );
});

// ======================
// VOICE LOGS (dein Style)
// ======================
client.on("voiceStateUpdate", (oldState, newState) => {

    const log = logChannel(newState.guild);
    if (!log) return;

    const user = newState.member.user;

    if (!oldState.channel && newState.channel) {
        log.send(
            `@${user.username} ist dem Sprachkanal **${newState.channel.name}** beigetreten.`
        );
    }

    if (oldState.channel && !newState.channel) {
        log.send(
            `@${user.username} hat den Sprachkanal **${oldState.channel.name}** verlassen.`
        );
    }

    if (
        oldState.channel &&
        newState.channel &&
        oldState.channel.id !== newState.channel.id
    ) {
        log.send(
            `@${user.username} hat von **${oldState.channel.name}** zu **${newState.channel.name}** gewechselt.`
        );
    }
});

// ======================
// ERROR HANDLING
// ======================
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// ======================
// LOGIN
// ======================
client.login(process.env.DISCORD_TOKEN);
