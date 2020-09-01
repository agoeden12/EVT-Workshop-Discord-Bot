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

  if (command === "member") {
    const url = baseUrl + `/users/getUser?id=${args.shift()}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    message.reply(`\`\`\`json\n${JSON.stringify(data)}\n\`\`\``);  
  }

  if (command === "shop") {
    const url = baseUrl + `/shop`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    message.reply(`There ${data == 1 ? `is ${data} person` : `are ${data} people`} in the shop right now.`);  
  }
});

client.login(config.BOT_TOKEN);
