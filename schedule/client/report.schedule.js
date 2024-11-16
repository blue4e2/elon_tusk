import { EmbedBuilder } from "discord.js";
import { getSchedule } from "../server/controller.schedule.js";

const handleScheduleReport = async(interaction) => {
    console.log(interaction.user)
    try{
        const res = await getSchedule({
            discordId: interaction.user.id
        });

        if(!res.success){
            return await interaction.reply(res.message);
        }

        const schedule = res.data;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth+1,0).getDate();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle(`${interaction.user.globalName || interaction.user.username}'s performace report of ${months[currentMonth-1]} ${currentYear}.`)
        
        let daysOfWeek = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        let rowsByDay = 35
        if(firstDay+daysInMonth>35){
            rowsByDay = 42
        }
        let reportData = `| Mon  | Tue  | Wed  | Thu  | Fri  | Sat  | Sun  |\n`
        reportData += '--------------------------------------------------\n'
        let count = firstDay
        let totalHours = 0

        function hourFormat(hourCount){
            const hourString = hourCount.toString();
            if(hourString.length==1){
                return `|   ${hourCount}  `
            }else if(hourString.length==2){
                return `|  ${hourCount}  `
            }else if(hourString.length==3){
                return `|  ${hourCount} `
            }else{
                return `| ${hourCount} `
            }
        }

        for(let i=0; i<firstDay; i++){
            reportData+= '| XXXX '
        }

        for(let i=0; i<daysInMonth; i++){
            count+=1
            const idate = `${currentYear}-${currentMonth}-${i.toString().padStart(2, '0')}`
            if( idate in schedule.report){
                const hourCount = parseFloat((schedule.report[idate]/3600).toFixed(1))
                totalHours+=schedule.report[idate]
                if(count==7){
                    reportData+= `${hourFormat(hourCount)}|`
                    reportData+= '\n--------------------------------------------------\n'
                    count = 0
                }else{
                    reportData+=hourFormat(hourCount)
                }
            }else{
                if(count==7){
                    reportData+= '|  0   |\n'
                    reportData+= '--------------------------------------------------\n'
                    count=0
                }else{
                    reportData+= '|  0   '
                }
            }
        }

        for(let i=0; i<(rowsByDay-firstDay-daysInMonth); i++){
            count+=1
            if(count==7){
                reportData+= '| XXXX '
                reportData+= '\n-------------------------------------------------\n'
                count=0
            }else{
                reportData+= '| XXXX '
            }
        }

        embed.addFields({
            name: '\u200B', 
            value: `\`\`\`markdown\n${reportData}\n\`\`\``
        });

        embed.addFields({
            name: 'Total Hours Studied : ',
            value: `${parseFloat((totalHours/3600).toFixed(1))}`
        })
        
        return await interaction.reply({ embeds: [embed] });
        
    }catch(err){
        console.log(err)
        return await interaction.channel.send(`schedule report failed. <@1300072525530927165>`);
    }
};

export default handleScheduleReport;