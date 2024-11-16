import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import { isValidTime, isValidTiming } from "../utils.schedule.js"
import { editSchedule, getSchedule } from "../server/controller.schedule.js";

const handleScheduleEdit = async(interaction) => {
let scheduleEditData = {
    'Monday': [],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': [],
    'Sunday': []
};

let firstReply=true;

try{
    //step 1
    const resGet = await getSchedule({ discordId: interaction.user.id })
    if(!resGet.success){
        return await interaction.reply(resGet.message);
    }

    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    while(true){
        
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

        if(firstReply){
            await interaction.reply({
                content: "Which days of the week the schedule applies to?",
                components: [row],
            });
            firstReply = false;
        }else{
            await interaction.channel.send({
                content: "Which days of the week the schedule applies to?",
                components: [row],
            });
        }

        const daysResponse = await interaction.channel.awaitMessageComponent({
            filter: i => i.customId === 'select_days' && i.user.id === interaction.user.id, 
            time: 30000
        })

        if(!daysResponse){
            return await interaction.channel.send("You didn't select any days. try again.");
        }

        await daysResponse.deferUpdate();

        const selectedDays = daysResponse.values;
        daysOfWeek = daysOfWeek.filter(day=>!selectedDays.includes(day))
        console.log(selectedDays);

        //step 3
        await interaction.channel.send({
            content: "Enter the timings in 24-hour format (eg: 09:30-17:30). Enter 'continue' when you're done to continue scheduling. or enter 'done' if you're finished scheduling"
        });

        let existingTimings = [];
    while(true){
        const timingsResponse = await interaction.channel.awaitMessages({
            filter: response => response.author.id === interaction.user.id,
            max: 1,
            time: 30000,
            errors: ['time']
        }).catch(()=>null);

        if(!timingsResponse){
            return await interaction.channel.send("You're late. try again.");
        }

        const userInput = timingsResponse.first().content.trim();

        if(userInput.toLowerCase() === 'continue'){
            break;
        }else if(userInput.toLowerCase() === 'done'){
            selectedDays.forEach(day=>{
                scheduleEditData[day] = existingTimings
            });
            const res = await editSchedule({   
                discordId: interaction.user.id,   
                scheduleEditData: scheduleEditData 
            });
            await interaction.channel.send(res.message);
            return;
        }else{
            const validationResult = isValidTiming(userInput, existingTimings);
            if(!validationResult.valid){
                await timingsResponse.first().reply(validationResult.message);
                continue;
            }

            existingTimings.push(userInput);
            await timingsResponse.first().react('✅');
        }
    }
    selectedDays.forEach(day=>{
        scheduleEditData[day] = existingTimings
    });

    if(daysOfWeek.length === 0){
        await interaction.channel.send("All available days have been selected.");
        break;
    }
    }
    const resEdit = await editSchedule({   
        discordId: interaction.user.id, 
        scheduleEditData: scheduleEditData 
    });
    await interaction.channel.send(resEdit.message);
}catch(err){
    console.log(err)
    return await interaction.channel.send(`schedule edit failed. <@1300072525530927165>`);
}
};

export default handleScheduleEdit;