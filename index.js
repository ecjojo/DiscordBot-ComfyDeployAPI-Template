const fs = require('fs');  
const { Client, CommandInteraction, Events, Collection, Partials, GatewayIntentBits } = require('discord.js');  
const { token } = require('./config.json');  
const { InteractionType } = require("discord-api-types/v10");  
  
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent],
    partials: [
        Partials.Channel,
      ],
     });  

  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));    
    
for (const file of eventFiles) {  
    const event = require(`./events/${file}`);  
    if (event.once) {  
        client.once(event.name, (...args) => event.execute(...args));  
    } else {  
        client.on(event.name, (...args) => event.execute(...args));  
    }  
}  
  
client.commands = new Collection();  
const cmdPaths = require("./cmdPaths.js").data;  
const commandFiles = [];  
for (let i = 0; i < cmdPaths.length; i++) {  
    commandFiles[i] = fs.readdirSync(cmdPaths[i]).filter(file => file.endsWith(".js")); 
    for (let j = 0; j < commandFiles[i].length; j++) {  
        commandFiles[i][j] = cmdPaths[i] + "/" + commandFiles[i][j];  
    }  
}  
  
for (const fileArray of commandFiles) {  
    for (const file of fileArray) {  
        const command = require(`./${file}`);  
        client.commands.set(command.data.name, command);  
  
        if (command.akaNames != null && Array.isArray(command.akaNames) && command.akaNames.length > 0) {  
            for (let i = 0; i < command.akaNames.length; i++) {  
                client.commands.set(command.akaNames[i], command);  
            }  
        }  
    }  
}  
  
client.once('ready', () => {
    console.log('Bot Ready!');});  

client.on('interactionCreate', async interaction => {  
    if (interaction.type !== InteractionType.ApplicationCommand) return;  

    const command = client.commands.get(interaction.commandName);  
    if (!command) return;  
  
    try {  
        await command.execute(interaction);  

    } catch (error) {  
        console.error(error);  
        await interaction.reply({  
            content: 'There was an error while executing this command!',  
            ephemeral: true  
        });  
    }  
});  
  
client.login(token);