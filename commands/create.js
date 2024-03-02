const fs = require("fs");


const apiToken =""; // ComfyDeploy Account API, Please make sure keep it private. 
//You move the apiToken to .env if you will holding on server.

const { AttachmentBuilder,SlashCommandBuilder } = require("discord.js");
const timeout = 3 * 60 * 1000; 

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create")
    .setDescription("Image Gen request via comfydeploy api.")
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Create a request to comfydeploy api.')
        .setRequired(true)),

  async execute(interaction) {

    const message = interaction.options.getString('message');
    await interaction.reply(`Running... "${message}"`);
    console.log(`Running by: ${interaction.user.username} "${message}"`);

    let timecounter = 10;

    const { run_id } = await fetch("https://www.comfydeploy.com/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiToken,
      },
      body: JSON.stringify({
        deployment_id: "", // ComfyDeploy Workflow Deployment ID
        inputs: {
          input_text: message,
        },
      }),
    }).then((response) => response.json());
    
    const apiEndpoint = `https://www.comfydeploy.com/api/run?run_id=${run_id}`;

    const interval = setInterval(async () => {
      interaction.editReply(`Duration: ${timecounter}s, "${message}"`); // Time Display

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiToken,
      },
    });
    const output = await response.json();

    if (output.status==="success" ) {

      interaction.editReply(`Duration: ${timecounter}s, Success! "${message}"`);
      const image_url = output.outputs[0]?.data?.images[0].url;
      const image = new AttachmentBuilder(image_url);
      interaction.editReply({files: [image]});

      console.log('Cleaning up interval...');
      timecounter = 0; 
      clearInterval(interval); //Cleaning up interval
    }

  } catch (error) {
    console.error("Error:", error);
  }
  timecounter += 10
}, 10000); 
  },
  
};