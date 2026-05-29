const express = require("express");
const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    AuditLogEvent
} = require("discord.js");

// ======================
// WEB SERVER
// ======================
const app = express();

app.get("/", (req, res) => {
    res.send("Bot läuft");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Webserver läuft");
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
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember
    ]
});

// ======================
// CONFIG
// ======================
const LOG_CHANNEL_ID = "1508905272972673104";

const ROLE_IDS = [
    "1508899625258717355",
    "1507456888843800596",
];

// ======================
// HELP
// ======================
function logChannel(guild) {
    return guild.channels.cache.get(LOG_CHANNEL_ID);
}

function embed(title, desc, color = 0x5865F2) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(desc)
        .setColor(color)
        .setTimestamp();
}

// ======================
// READY
// ======================
client.once("ready", () => {
    console.log("Bot online: " + client.user.tag);
});

// ======================
// JOIN + ROLES
// ======================
client.on("guildMemberAdd", async (member) => {

    for (const id of ROLE_IDS) {
        const role = member.guild.roles.cache.get(id);
        if (role) {
            await member.roles.add(role).catch(() => {});
        }
    }

    const log = logChannel(member.guild);
    if (log) {
        log.send({
            embeds: [
                embed("Member Joined", member.user.tag, 0x2ecc71)
            ]
        });
    }
});

// ======================
// LEAVE
// ======================
client.on("guildMemberRemove", async (member) => {

    const log = logChannel(member.guild);
    if (log) {
        log.send({
            embeds: [
                embed("Member Left", member.user.tag, 0xe74c3c)
            ]
        });
    }
});

// ======================
// BAN / UNBAN
// ======================
client.on("guildBanAdd", async (ban) => {
    const log = logChannel(ban.guild);
    if (log) log.send({ embeds: [embed("Member Banned", ban.user.tag, 0xff0000)] });
});

client.on("guildBanRemove", async (ban) => {
    const log = logChannel(ban.guild);
    if (log) log.send({ embeds: [embed("Member Unbanned", ban.user.tag, 0x00ff00)] });
});

// ======================
// MESSAGE LOGS
// ======================
client.on("messageDelete", async (msg) => {
    if (!msg.guild) return;
    const log = logChannel(msg.guild);
    if (!log) return;

    log.send({ embeds: [embed("Message Deleted", "Eine Nachricht wurde gelöscht", 0xe67e22)] });
});

client.on("messageUpdate", async (oldMsg) => {
    if (!oldMsg.guild) return;
    const log = logChannel(oldMsg.guild);
    if (!log) return;

    log.send({ embeds: [embed("Message Edited", "Eine Nachricht wurde bearbeitet", 0xf1c40f)] });
});

// ======================
// CHANNEL LOGS
// ======================
client.on("channelCreate", (c) => {
    const log = logChannel(c.guild);
    if (log) log.send({ embeds: [embed("Channel Created", c.name, 0x3498db)] });
});

client.on("channelDelete", (c) => {
    const log = logChannel(c.guild);
    if (log) log.send({ embeds: [embed("Channel Deleted", c.name, 0xe74c3c)] });
});

// ======================
// ROLE LOGS
// ======================
client.on("roleCreate", (r) => {
    const log = logChannel(r.guild);
    if (log) log.send({ embeds: [embed("Role Created", r.name, 0x3498db)] });
});

client.on("roleDelete", (r) => {
    const log = logChannel(r.guild);
    if (log) log.send({ embeds: [embed("Role Deleted", r.name, 0xe74c3c)] });
});

// ======================
// VOICE LOGS
// ======================
client.on("voiceStateUpdate", (oldState, newState) => {

    const log = logChannel(newState.guild);
    if (!log) return;

    if (!oldState.channel && newState.channel) {
        log.send({ embeds: [embed("Voice Join", newState.member.user.tag, 0x2ecc71)] });
    }

    if (oldState.channel && !newState.channel) {
        log.send({ embeds: [embed("Voice Leave", newState.member.user.tag, 0xe74c3c)] });
    }

    if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        log.send({ embeds: [embed("Voice Switch", newState.member.user.tag, 0x3498db)] });
    }
});

// ======================
// TIMEOUT (basic)
// ======================
client.on("guildMemberUpdate", (oldM, newM) => {

    const log = logChannel(newM.guild);
    if (!log) return;

    if (
        oldM.communicationDisabledUntilTimestamp !==
        newM.communicationDisabledUntilTimestamp
    ) {
        log.send({
            embeds: [
                embed("Timeout Changed", newM.user.tag, 0xf1c40f)
            ]
        });
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
console.log("TOKEN:", process.env.DISCORD_TOKEN);
