import { EmbedBuilder } from "discord.js";
import { getSchedule } from "../server/controller.schedule.js";

const handleScheduleView = async(interaction) => {
    try{
        const res = await getSchedule({
            discordId: interaction.user.id
        });

        if(!res.success){
            return await interaction.reply(res.message);
        }

        const scheduleData = res.data.scheduleData;

        let table1 = 
        `   Monday    |   Tuesday   |  Wednesday  |   Thursday  |\n`;

        let table2 = 
        `   Friday    |  Saturday   |   Sunday    |\n`

        table1 += `-------------|-------------|-------------|-------------|`;

        table2 += `-------------|-------------|-------------|`;

        const daysOfWeek1 = ['Monday','Tuesday','Wednesday','Thursday'];
        const daysOfWeek2 = ['Friday','Saturday','Sunday'];

        let maxTiming = 0;
        daysOfWeek1.forEach(day=>{
            if(scheduleData[day].length>maxTiming){
                maxTiming = scheduleData[day].length
            }
        });
        daysOfWeek2.forEach(day=>{
            if(scheduleData[day].length>maxTiming){
                maxTiming = scheduleData[day].length
            }
        });

        for(let i=0; i<maxTiming; i++){
            let newRow = '\n'
            daysOfWeek1.forEach(day=>{
                if(scheduleData[day][i]){
                    newRow+=` ${scheduleData[day][i]} |`
                }else{
                    newRow+=`             |`
                }
            })
            table1+=newRow
        }

        for(let i=0; i<maxTiming; i++){
            let newRow = '\n'
            daysOfWeek2.forEach(day=>{
                if(scheduleData[day][i]){
                    newRow+=` ${scheduleData[day][i]} |`
                }else{
                    newRow+=`             |`
                }
            })
            table2+=newRow
        }

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle(`${interaction.user.globalName || interaction.user.username}'s schedule`)
            .addFields({ name: '\u200B', value: `\`\`\`markdown\n${table1}\n\`\`\`` })
            .addFields({ name: '\u200B', value: `\`\`\`markdown\n${table2}\n\`\`\`` });
        
        return await interaction.reply({ embeds: [embed] });
        
    }catch(err){
        console.log(err)
        return await interaction.channel.send(`schedule view failed. <@1300072525530927165>`);
    }
};

export default handleScheduleView;