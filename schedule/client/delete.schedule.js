import { deleteSchedule } from "../server/controller.schedule.js";

const handleScheduleDelete = async(interaction) => {
try{
    const res = await deleteSchedule({   
        discordId: interaction.user.id
    });
    await interaction.reply(res.message);
}catch(err){
    console.log(err)
    return await interaction.channel.send(`schedule delete failed. <@1300072525530927165>`);
}
};

export default handleScheduleDelete;