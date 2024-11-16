import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import { clearSchedule, getSchedule } from "../server/controller.schedule.js";

const handleScheduleClear = async(interaction) => {
try{    
        const resGet = await getSchedule({ discordId: interaction.user.id })
        if(!resGet.success){
            return await interaction.reply(resGet.message);
        }
        //step 1
        let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const daysSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_days')
            .setPlaceholder('Select days of the week')
            .setMinValues(1)
            .setMaxValues(daysOfWeek.length)

        daysOfWeek.forEach(day=>{
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(day)
                .setValue(day);
            
            daysSelectMenu.addOptions(option);
        });

        const row = new ActionRowBuilder().addComponents(daysSelectMenu);

        await interaction.reply({
            content: "Which days of the week you want to clear the schedule?",
            components: [row],
        });

        const daysResponse = await interaction.channel.awaitMessageComponent({
            filter: i => i.customId === 'select_days' && i.user.id === interaction.user.id, 
            time: 30000
        })

        if(!daysResponse){
            return await interaction.channel.send("You didn't select any days. goodbye.");
        }

        await daysResponse.deferUpdate();

        const selectedDays = daysResponse.values;

        const res = await clearSchedule({   
            discordId: interaction.user.id, 
            scheduleClearData: selectedDays 
        });
        return await interaction.channel.send(res.message);
    }catch(err){
        console.log(err)
        return await interaction.channel.send(`schedule clear failed. <@1300072525530927165>`);
    }
};

export default handleScheduleClear;