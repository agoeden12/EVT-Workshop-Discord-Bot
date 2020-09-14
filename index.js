const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");

const client = new Discord.Client();
const baseUrl = config.BASE_URL;
const prefix = "~";

client.on("message", async (message) => {
  // console.log(message.author);
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  var args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "create_member":
      args = args.join(" ").split("|")
      var name = args.shift().trim();
      var id = args.shift().trim();
      create(message, name, id);
      break;

    case "hours":
      hoursByName(message, args.join(" "));
      break;

    case "shop":
      shop(message);
      break;

    case "checkin":
      checkIn(message, args.join(" "));
      break;

    case "checkout":
      checkOut(message, args.join(" "));
      break;

    default:
      message.channel.send("I did not recognize that command");
      break;
  }
});

const create = async (message, name, id) => {
  
  console.log(`${name} | ${id}`);
  const url = baseUrl + `/users/createUser?id=${id}`;
  const body = {
      name: name,
      discord: message.author.id,
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });


  if (response.status != 200 || response.status != 201) {
    message.channel.send("There was an issue on the server, please try again soon.");
    return;
  }

  const data = await response.json();

  
  console.log(data.data);
  message.channel.send(`${data.data}`);
};

const hoursByName = async (message, name) => {
  const url = baseUrl + `/users/getUserByName?name=${name}`;
  const response = await fetch(url);

  console.log(response.status);
  if (response.status === 200) {
    const data = await response.json();

    console.log(data);
    var output = `**${
      data.data.name
    }:**\nHours committed: ${data.data.hours.toFixed(2)}`;

    message.channel.send(output);
  }
};

const hoursByUser = async (message) => {
  //TODO: Implement search by discord ID.
  // const url = baseUrl + `/users/getUserByName?name=${}`;
  // const response = await fetch(url);

  // if (response.status === 200) {
  //   const data = await response.json();

  //   console.log(data);
  //   var output = `**${
  //     data.data.name
  //   }:**\nHours committed: ${data.data.hours.toFixed(2)}`;

  //   message.channel.send(output);
  // }
};

const shop = async (message) => {
  const url = baseUrl + `/shop`;

  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
  message.channel.send(
    `There ${
      data == 1 ? `is ${data} person` : `are ${data} people`
    } in the shop right now.`
  );
};

const checkIn = async (message) => {
  const id = await getIdFromDiscord(message.author.id);
  const url = baseUrl + `/shop/checkIn?id=${id}`;

  const response = await fetch(url, {
    method: 'POST'
  });

  if (response.status === 200 || response.status === 201) {
    message.reply("Check in successful.");
  } else {
    message.reply("Check in was not successful. Please try again later");
  }
};

const checkOut = async (message) => {
  const id = await getIdFromDiscord(message.author.id);
  const url = baseUrl + `/shop/checkOut?id=${id}`;

  const response = await fetch(url, {
    method: 'POST'
  });

  if (response.status === 200 || response.status === 201) {
    message.reply("Check out successful.");
  } else {
    message.reply("Check out was not successful. Please try again later");
  }
};

const getIdFromDiscord = async (id) => {
  const url = baseUrl + `/users/getUserByDiscordId?id=${id}`;
  const response = await fetch(url);
  
  if (response.status === 200 || response.status === 201) {
    const data = await response.json();
    return data.id;
  } else {
    return 0;
  }
}

client.on("ready", () => {
  console.log("Connecting...");
  client.user.setStatus("available"); // Can be 'available', 'idle', 'dnd', or 'invisible'
  client.user.setUsername("Watcher");
  client.user.setPresence({
    activity: { name: "Avoiding Covid" },
  });
});

client.login(config.BOT_TOKEN);
