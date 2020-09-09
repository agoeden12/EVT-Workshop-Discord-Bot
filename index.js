const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");

const client = new Discord.Client();
const baseUrl = config.BASE_URL;
const prefix = "!";

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "hours") {
    const url = baseUrl + `/users/getUser?id=${args.shift()}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data.data);
    var output = `**${data.data.name}:**\nHours committed: ${data.data.hours.toFixed(2)}`

    message.channel.send(output);  
  }

  if (command === "shop") {
    const url = baseUrl + `/shop`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    message.channel.send(`There ${data == 1 ? `is ${data} person` : `are ${data} people`} in the shop right now.`);  
    
  }
});

client.on('ready', () => {
  console.log('Connecting...');
  client.user.setStatus('available'); // Can be 'available', 'idle', 'dnd', or 'invisible'
  client.user.setUsername("Watcher");
  client.user.setPresence({
      "activity": {"name": "Avoiding Covid"}
  });
});

client.login(config.BOT_TOKEN);
