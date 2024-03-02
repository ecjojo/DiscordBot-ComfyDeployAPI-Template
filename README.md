## Discord Bot Template (ComfyDeploy API)

A Discord Bot Template able to generate image via comfyDeploy API.

![image](https://github.com/ecjojo/DiscordBotTemplate-ComfyDeploy/assets/48451938/de783316-fa58-424f-9b62-45dfbcd705c2)

### ComfyDeploy
https://www.comfydeploy.com/

### Discord Applications
https://discord.com/developers/applications

---
## Guide 

1. Clone Project
2. `npm i`
3. Create your Discord Bot 
4. Enter the the Discord Bot info in`config.json`
     "token": "",
     "clientId": "",
     "guildId": ""
5. Create your Workflow and deoploy in comfydeploy
6. This template design for txt2image workflow. make sure you have setting 
7. Enter the apiTokek and deployment_id in `command/create.js`
8. `node deploy_commands`to deploy the bot command
9. `node index`to run discord server
10. enter /create in discord









