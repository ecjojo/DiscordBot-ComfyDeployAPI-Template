const fs = require("fs");  const { REST } = require('@discordjs/rest');  const { Routes } = require('discord.js');  
const { clientId, guildId, token } = require('./config.json');  
  
const commands = []; 
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
      console.log(file);  
      let command = require(`./${file}`);  
      commands.push(command.data.toJSON());  
  
      if (command.akaNames != null && Array.isArray(command.akaNames) && command.akaNames.length > 0)  {  
         for (let i = 0; i < command.akaNames.length; i++) {  
            let akaData = command.data;  
            akaData.name = command.akaNames[i];  
            commands.push(akaData.toJSON());  
         }  
      }  
   }  
}    
    
const rest = new REST({ version: '10' }).setToken(token);  
  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })    
   .then(() => console.log('Successfully registered application commands.'))    
   .catch(console.error);