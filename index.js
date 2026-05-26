const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot läuft!'));
app.listen(3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;

client.once('ready', () => {
    console.log(`Bot online als ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {

    const role1 = member.guild.roles.cache.find(r => r.name === "➢ Mitglied");
    const role2 = member.guild.roles.cache.find(r => r.name === "┏―――――💎Mitglied💎――――┛");

    try {
        if (role1) await member.roles.add(role1);
        if (role2) await member.roles.add(role2);
    } catch (err) {
        console.log(err);
    }
});

client.login(TOKEN);