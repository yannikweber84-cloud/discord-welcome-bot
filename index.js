const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();

// KEEP ALIVE SERVER
app.get('/', (req, res) => {
    res.send('Bot läuft!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('🌍 Webserver läuft');
});

// DISCORD CLIENT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    restTimeOffset: 0,
    failIfNotExists: false
});

// ONLINE
client.once('ready', () => {
    console.log(`✅ Bot online als ${client.user.tag}`);
});

// RECONNECT INFO
client.on('disconnect', () => {
    console.log('❌ Bot disconnected');
});

client.on('reconnecting', () => {
    console.log('🔄 Bot reconnecting...');
});

client.on('resume', () => {
    console.log('✅ Verbindung wiederhergestellt');
});

// AUTO ROLLEN
client.on('guildMemberAdd', async (member) => {

    try {

        const role1 = member.guild.roles.cache.find(
            r => r.name === "➢ Mitglied"
        );

        const role2 = member.guild.roles.cache.find(
            r => r.name === "┏―――――💎Mitglied💎――――┛"
        );

        if (role1) await member.roles.add(role1);
        if (role2) await member.roles.add(role2);

        console.log(`${member.user.tag} bekam Rollen`);

    } catch (err) {
        console.log('Rollen Fehler:', err);
    }
});

// FEHLER SCHUTZ
process.on('unhandledRejection', error => {
    console.log('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.log('Uncaught exception:', error);
});

// LOGIN
client.login(process.env.TOKEN);