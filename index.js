const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder
} = require("discord.js");

const express = require("express");

// =========================
// WEB SERVER FÜR RENDER
// =========================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("FARM Bot läuft!");
});

app.listen(PORT, () => {
  console.log(`Webserver läuft auf Port ${PORT}`);
});

// =========================
// DISCORD BOT
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// =========================
// ENV TOKEN
// =========================

const TOKEN = process.env.TOKEN;

// =========================
// IDs HIER EINTRAGEN
// =========================

const WELCOME_CHANNEL_ID = "1507456889615810642";

const ROLE_1_ID = "1508899625258717355";
const ROLE_2_ID = "1507456888843800596";

// =========================
// BOT READY
// =========================

client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} ist online!`);
});

// =========================
// MEMBER JOIN EVENT
// =========================

client.on(Events.GuildMemberAdd, async (member) => {

  try {

    // Rollen geben
    await member.roles.add(ROLE_1_ID);
    await member.roles.add(ROLE_2_ID);

    // Channel holen
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (!channel) return;

    // Welcome Embed
    const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setTitle("⚡️ Logging ⚡️")
      .setDescription(
`${member} ist gejoined!

UserId: ${member.id}

Aktuelle Memberanzahl: ${member.guild.memberCount}`
      )
      .setThumbnail(
        member.user.displayAvatarURL({
          dynamic: true
        })
      )
      .setImage(
        member.user.displayAvatarURL({
          dynamic: true,
          size: 1024
        })
      )
      .setFooter({
        text: "powered by FARM"
      })
      .setTimestamp();

    // Nachricht senden
    channel.send({
      embeds: [embed]
    });

  } catch (err) {
    console.error("Fehler beim Join:", err);
  }

});

// =========================
// LOGIN
// =========================

client.login(TOKEN);
