import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import { isValidTime, isValidTiming, getOffset } from "../utils.schedule.js"
import { createSchedule, getSchedule } from "../server/controller.schedule.js";

const handleScheduleCreate = async(interaction) => {
let scheduleData = {
    'Monday': [],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': [],
    'Sunday': []
};

let offset = 0;

try{
    const userSchedule = await getSchedule({ discordId: interaction.user.id })
    if(userSchedule.success){
        return interaction.reply("You already created a schedule.")
    }
    //step 1
    await interaction.reply({
        content: "Enter your timezone in 24 hours format (eg: YYYY-MM-DD-HH-MM)"
    });

    while(true){
        const timeResponse = await interaction.channel.awaitMessages({
            filter: response => response.author.id === interaction.user.id,
            max: 1,
            time: 30000,
            errors: ['time']
        }).catch((err)=>console.log(err));

        if(!timeResponse){
            return await interaction.channel.send("You're late. try again.");
        }

        const currentZone = timeResponse.first().content.trim();

        const TimeValidationResult = isValidTime(currentZone);
        if(!TimeValidationResult.valid){
            await timeResponse.first().reply(TimeValidationResult.message);
            continue;
        }else{
            offset = getOffset(currentZone);
            break;
        }
    }
    //step 2
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

        await interaction.channel.send({
            content: "Which days of the week the schedule applies to?",
            components: [row],
        });

        const daysResponse = await interaction.channel.awaitMessageComponent({
            filter: i => i.customId === 'select_days' && i.user.id === interaction.user.id, 
            time: 30000,
            errors: ['time']
        }).catch((err)=>console.log(err));

        if(!daysResponse){
            return await interaction.channel.send("You didn't select any days. try again.");
        }

        await daysResponse.deferUpdate();

        const selectedDays = daysResponse.values;
        daysOfWeek = daysOfWeek.filter(day=>!selectedDays.includes(day))
        console.log(selectedDays);

        //step 3
        await interaction.channel.send({
            content: "Enter the timings in 24-hour format (eg: 09:30-17:30). Enter 'continue' to continue scheduling or 'done' if you're finished scheduling"
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
                scheduleData[day] = existingTimings
            });
            const res = await createSchedule({   
                discordId: interaction.user.id, 
                offset: offset, 
                scheduleData: scheduleData 
            });
            return await interaction.channel.send(res.message);
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
        scheduleData[day] = existingTimings
    });

    if(daysOfWeek.length === 0){
        await interaction.channel.send("All available days have been selected.");
        break;
    }
    }
    const res = await createSchedule({   
        discordId: interaction.user.id, 
        offset: offset, 
        scheduleData: scheduleData,
        report: {} 
    });
    return await interaction.channel.send(res.message);
}catch(err){
    console.log(err)
    return await interaction.channel.send(`schedule create failed. <@1300072525530927165>`);
}
};

export default handleScheduleCreate;