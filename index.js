const { Client, GatewayIntentBits, Events } = require("discord.js");
const express = require("express");

// === EXPRESS SERVER (für Render Port) ===
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Webserver läuft auf Port ${PORT}`);
});

// === DISCORD BOT ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ENV VARS (Render)
const TOKEN = process.env.TOKEN;
const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const ROLE_1_ID = process.env.ROLE_1_ID;
const ROLE_2_ID = process.env.ROLE_2_ID;

client.once(Events.ClientReady, () => {
  console.log(`Bot online als ${client.user.tag}`);
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    await member.roles.add(ROLE_1_ID);
    await member.roles.add(ROLE_2_ID);

    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (channel) {
      channel.send(`👋 Willkommen ${member} auf dem Server!`);
    }

  } catch (err) {
    console.error("Join error:", err);
  }
});

client.login(TOKEN);
