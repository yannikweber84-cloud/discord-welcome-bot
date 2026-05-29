```js id="z7x8p1"
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Bot läuft!");
});

const PORT = process.env.PORT || 3000;

const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder
} = require("discord.js");
```
const express = require("express");

const app = express();

// =========================
// WEB SERVER
// =========================
app.get("/", (req, res) => {
    res.send("Bot läuft");
});

app.listen(3000, () => {
    console.log("Webserver gestartet");
});

// =========================
// DISCORD CLIENT
// =========================
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

// =========================
// CONFIG
// =========================

// LOG CHANNEL ID
const LOG_CHANNEL_ID = "1508905272972673104";

// AUTOMATISCHE ROLLEN IDs
const START_ROLES = [
    "1508899625258717355",
    "1507456888843800596"
];

// =========================
// HELPER
// =========================
function getLogChannel(guild) {
    return guild.channels.cache.get(LOG_CHANNEL_ID);
}

function createEmbed(title, description, color = 0x9b59b6) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
}

// =========================
// READY
// =========================
client.once("ready", () => {
    console.log("Bot online als " + client.user.tag);
});

// =========================
// MEMBER JOIN
// =========================
client.on("guildMemberAdd", async (member) => {

    // ROLLEN GEBEN
    for (const roleId of START_ROLES) {

        const role = member.guild.roles.cache.get(roleId);

        if (role) {
            await member.roles.add(role).catch(console.error);
        }
    }

    // LOG
    const logChannel = getLogChannel(member.guild);

    if (logChannel) {
        logChannel.send({
            embeds: [
                createEmbed(
                    "Member Joined",
                    member.user.tag + " ist dem Server beigetreten",
                    0x2ecc71
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
                    "Member Left",
                    member.user.tag + " hat den Server verlassen",
                    0xe74c3c
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
                    "Member Banned",
                    ban.user.tag + " wurde gebannt",
                    0xff0000
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
                    "Member Unbanned",
                    ban.user.tag + " wurde entbannt",
                    0x00ff00
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

    if (!logChannel) return;

    logChannel.send({
        embeds: [
            createEmbed(
                "Message Deleted",
                "Nachricht wurde gelöscht",
                0xe67e22
            )
        ]
    });
});

// =========================
// MESSAGE EDIT
// =========================
client.on("messageUpdate", async (oldMsg, newMsg) => {

    if (!oldMsg.guild) return;

    if (oldMsg.content === newMsg.content) return;

    const logChannel = getLogChannel(oldMsg.guild);

    if (!logChannel) return;

    logChannel.send({
        embeds: [
            createEmbed(
                "Message Edited",
                "Nachricht wurde bearbeitet",
                0xf1c40f
            )
        ]
    });
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
                    "Channel Created",
                    channel.name + " wurde erstellt",
                    0x3498db
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
                    "Channel Deleted",
                    channel.name + " wurde gelöscht",
                    0xe74c3c
                )
            ]
        });
    }
});

// =========================
// CHANNEL UPDATED
// =========================
client.on("channelUpdate", async (oldChannel, newChannel) => {

    const logChannel = getLogChannel(newChannel.guild);

    if (logChannel) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Channel Updated",
                    newChannel.name + " wurde bearbeitet",
                    0xf1c40f
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
                    "Role Created",
                    role.name + " wurde erstellt",
                    0x3498db
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
                    "Role Deleted",
                    role.name + " wurde gelöscht",
                    0xe74c3c
                )
            ]
        });
    }
});

// =========================
// MEMBER UPDATE
// =========================
client.on("guildMemberUpdate", async (oldMember, newMember) => {

    const logChannel = getLogChannel(newMember.guild);

    if (!logChannel) return;

    // NICKNAME
    if (oldMember.nickname !== newMember.nickname) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Nickname Changed",
                    newMember.user.tag + " änderte Nickname",
                    0xf1c40f
                )
            ]
        });
    }

    // TIMEOUT
    if (
        oldMember.communicationDisabledUntilTimestamp !==
        newMember.communicationDisabledUntilTimestamp
    ) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Timeout Updated",
                    newMember.user.tag + " Timeout geändert",
                    0xe67e22
                )
            ]
        });
    }

    // ROLLEN
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
                    "Role Given",
                    role.name + " wurde gegeben",
                    0x2ecc71
                )
            ]
        });
    });

    removedRoles.forEach(role => {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Role Removed",
                    role.name + " wurde entfernt",
                    0xe74c3c
                )
            ]
        });
    });
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
                    "Voice Joined",
                    newState.member.user.tag +
                    " jointe " +
                    newState.channel.name,
                    0x2ecc71
                )
            ]
        });
    }

    // LEAVE
    if (oldState.channel && !newState.channel) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Voice Left",
                    newState.member.user.tag +
                    " verließ Voice",
                    0xe74c3c
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
                    "Voice Switch",
                    newState.member.user.tag +
                    " wechselte Voice Channel",
                    0x3498db
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
                    "Voice State Changed",
                    newState.member.user.tag +
                    " änderte Mute/Deafen",
                    0xf1c40f
                )
            ]
        });
    }
});

// =========================
// SERVER UPDATE
// =========================
client.on("guildUpdate", async (oldGuild, newGuild) => {

    const logChannel = getLogChannel(newGuild);

    if (logChannel) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Server Updated",
                    "Server Einstellungen wurden geändert",
                    0x3498db
                )
            ]
        });
    }
});

// =========================
// INVITE CREATED
// =========================
client.on("inviteCreate", async (invite) => {

    const logChannel = getLogChannel(invite.guild);

    if (logChannel) {

        logChannel.send({
            embeds: [
                createEmbed(
                    "Invite Created",
                    "Ein neuer Invite wurde erstellt",
                    0x2ecc71
                )
            ]
        });
    }
});

// =========================
// ERROR HANDLING
// =========================
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// =========================
// LOGIN
// =========================
client.login(process.env.DISCORD_TOKEN);
```
