require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot läuft!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Server läuft auf Port ${PORT}`);
});
;
require("dotenv").config();
```js
const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    AuditLogEvent
} = require("discord.js");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Bot läuft!");
});

app.listen(3000, () => {
    console.log("🌍 Webserver läuft");
});

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
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember
    ]
});

const LOG_CHANNEL = "╠»🪻𝐋𝐨𝐠𝐬";

function getLogChannel(guild) {
    return guild.channels.cache.find(
        c => c.name === LOG_CHANNEL
    );
}

function createEmbed(title, description, color = "Purple") {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

client.once("clientReady", () => {
    console.log(`✅ Bot online als ${client.user.tag}`);
});


// =========================
// MEMBER JOIN
// =========================

client.on("guildMemberAdd", async (member) => {

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
        }
    }

    const logChannel = getLogChannel(member.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "✅ Member Joined",
                    `${member.user.tag} ist dem Server beigetreten.`,
                    "Green"
                )
            ]
        });
    }
});


// =========================
// MEMBER LEFT
// =========================

client.on("guildMemberRemove", async (member) => {

    const logChannel = getLogChannel(member.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "❌ Member Left",
                    `${member.user.tag} hat den Server verlassen.`,
                    "Red"
                )
            ]
        });
    }
});


// =========================
// MEMBER BANNED
// =========================

client.on("guildBanAdd", async (ban) => {

    const logChannel = getLogChannel(ban.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "🔨 Member Banned",
                    `${ban.user.tag} wurde gebannt.`,
                    "DarkRed"
                )
            ]
        });
    }
});


// =========================
// MEMBER UNBANNED
// =========================

client.on("guildBanRemove", async (ban) => {

    const logChannel = getLogChannel(ban.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "✅ Member Unbanned",
                    `${ban.user.tag} wurde entbannt.`,
                    "Green"
                )
            ]
        });
    }
});


// =========================
// MESSAGE DELETE
// =========================

client.on("messageDelete", async (message) => {

    if (!message.guild) return;

    const logChannel = getLogChannel(message.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "🗑️ Message Deleted",
                    `Nachricht von ${message.author} gelöscht:\n\n${message.content}`,
                    "Orange"
                )
            ]
        });
    }
});


// =========================
// MESSAGE EDIT
// =========================

client.on("messageUpdate", async (oldMessage, newMessage) => {

    if (!oldMessage.guild) return;

    if (oldMessage.content === newMessage.content) return;

    const logChannel = getLogChannel(oldMessage.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "✏️ Message Edited",
                    `**Alt:** ${oldMessage.content}\n\n**Neu:** ${newMessage.content}`,
                    "Yellow"
                )
            ]
        });
    }
});


// =========================
// CHANNEL CREATED
// =========================

client.on("channelCreate", async (channel) => {

    const logChannel = getLogChannel(channel.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "📁 Channel Created",
                    `${channel.name} wurde erstellt.`,
                    "Blue"
                )
            ]
        });
    }
});


// =========================
// CHANNEL DELETED
// =========================

client.on("channelDelete", async (channel) => {

    const logChannel = getLogChannel(channel.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "🗑️ Channel Deleted",
                    `${channel.name} wurde gelöscht.`,
                    "Red"
                )
            ]
        });
    }
});


// =========================
// ROLE CREATED
// =========================

client.on("roleCreate", async (role) => {

    const logChannel = getLogChannel(role.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "🛡️ Role Created",
                    `${role.name} wurde erstellt.`,
                    "Blue"
                )
            ]
        });
    }
});


// =========================
// ROLE DELETED
// =========================

client.on("roleDelete", async (role) => {

    const logChannel = getLogChannel(role.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "🗑️ Role Deleted",
                    `${role.name} wurde gelöscht.`,
                    "Red"
                )
            ]
        });
    }
});


// =========================
// ROLE GIVEN / REMOVED
// =========================

client.on("guildMemberUpdate", async (oldMember, newMember) => {

    const logChannel = getLogChannel(newMember.guild);

    if (!logChannel) return;

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter(
        role => !oldRoles.has(role.id)
    );

    const removedRoles = oldRoles.filter(
        role => !newRoles.has(role.id)
    );

    addedRoles.forEach(role => {
        logChannel.send({
            embeds: [
                createEmbed(
                    "✅ Role Given",
                    `${newMember.user.tag} bekam ${role.name}`,
                    "Green"
                )
            ]
        });
    });

    removedRoles.forEach(role => {
        logChannel.send({
            embeds: [
                createEmbed(
                    "❌ Role Removed",
                    `${newMember.user.tag} verlor ${role.name}`,
                    "Red"
                )
            ]
        });
    });

    if (oldMember.nickname !== newMember.nickname) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "✏️ Nickname Changed",
                    `**Alt:** ${oldMember.nickname || "Kein Nickname"}\n**Neu:** ${newMember.nickname || "Kein Nickname"}`,
                    "Yellow"
                )
            ]
        });
    }
});


// =========================
// VOICE LOGS
// =========================

client.on("voiceStateUpdate", async (oldState, newState) => {

    const logChannel = getLogChannel(newState.guild);

    if (!logChannel) return;

    // JOIN
    if (!oldState.channel && newState.channel) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "🔊 Voice Join",
                    `${newState.member.user.tag} trat ${newState.channel.name} bei.`,
                    "Green"
                )
            ]
        });
    }

    // LEAVE
    if (oldState.channel && !newState.channel) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "🔇 Voice Leave",
                    `${newState.member.user.tag} verließ ${oldState.channel.name}.`,
                    "Red"
                )
            ]
        });
    }

    // SWITCH
    if (
        oldState.channel &&
        newState.channel &&
        oldState.channel.id !== newState.channel.id
    ) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "🔁 Voice Switch",
                    `${newState.member.user.tag} wechselte von ${oldState.channel.name} nach ${newState.channel.name}.`,
                    "Blue"
                )
            ]
        });
    }

    // MUTE / DEAFEN
    if (
        oldState.selfMute !== newState.selfMute ||
        oldState.selfDeaf !== newState.selfDeaf
    ) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "🎤 Voice State Changed",
                    `${newState.member.user.tag} änderte seinen Voice Status.`,
                    "Purple"
                )
            ]
        });
    }
});


// =========================
// ERROR HANDLER
// =========================

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);


// =========================
// LOGIN
// =========================

client.login(process.env.DISCORD_TOKEN);
```
