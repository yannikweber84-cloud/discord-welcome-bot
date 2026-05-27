const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// EXPRESS SERVER (für Render 24/7)
const app = express();

app.get('/', (req, res) => {
    res.send('Bot läuft!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Webserver läuft');
});

// DISCORD CLIENT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// BOT ONLINE
client.once('ready', () => {
    console.log(`✅ Bot online als ${client.user.tag}`);
});

// WENN JEMAND JOINT
client.on('guildMemberAdd', async (member) => {

    try {

        // Rolle 1
        const role1 = member.guild.roles.cache.find(
            r => r.name === "➢ Mitglied"
        );

        // Rolle 2
        const role2 = member.guild.roles.cache.find(
            r => r.name === "┏―――――💎Mitglied💎――――┛"
        );

        // Rollen geben
        if (role1) {
            await member.roles.add(role1);
        }

        if (role2) {
            await member.roles.add(role2);
        }

        console.log(`${member.user.tag} hat Rollen bekommen`);

    } catch (err) {

        console.log('Fehler beim Rollen geben:');
        console.log(err);

    }
});

// LOGIN
client.login(process.env.TOKEN);