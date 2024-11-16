import handleScheduleCreate from "./client/create.schedule.js";
import handleScheduleEdit from "./client/edit.schedule.js";
import handleScheduleView from "./client/view.schedule.js";
import handleScheduleReport from "./client/report.schedule.js";
import handleScheduleClear from "./client/clear.schedule.js";
import handleScheduleDelete from "./client/delete.schedule.js";

const handleSchedule = async(interaction) => {
        const subCommand = interaction.options.getSubcommand();

        if(!subCommand){
            await interaction.reply({
                content: 
                `Please specify a command for \`/schedule\`.
                 Available options are:
                 \`\`\`
                 /schedule create: Creates a new schedule.
                 /schedule edit: Edits a new schedule.
                 /schedule view: View your current schedule.
                 /schedule delete: Delete your schedule.
                 /schedule report: View your performance report.
                 \`\`\`
                 `,
                 ephemeral: true
            });
            return;
        }

        switch(subCommand){
            case 'create':
                await handleScheduleCreate(interaction);
                break;
            case 'edit':
                await handleScheduleEdit(interaction);
                break;
            case 'view':
                await handleScheduleView(interaction);
                break;
            case 'report':
                await handleScheduleReport(interaction);
                break;
            case 'clear':
                await handleScheduleClear(interaction);
                break;
            case 'delete':
                await handleScheduleDelete(interaction);
                break;
            default:
                await interaction.reply({
                    content: "Unknown command.",
                    ephemeral: true
                });
                break;
        }
};

export default handleSchedule;

