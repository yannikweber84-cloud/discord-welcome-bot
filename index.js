const { Client, GatewayIntentBits, Events } = require("discord.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot läuft!");
});

app.listen(PORT, () => {
  console.log(`Webserver läuft auf Port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;

const WELCOME_CHANNEL_ID = "1507456889615810642";
const ROLE_1_ID = "1508899625258717355";
const ROLE_2_ID = "1507456888843800596";

client.once(Events.ClientReady, () => {
  console.log(`Bot online als ${client.user.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    await member.roles.add(ROLE_1_ID);
    await member.roles.add(ROLE_2_ID);

    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (channel) {
      channel.send(`👋 Willkommen ${member}!`);
    }

  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);
