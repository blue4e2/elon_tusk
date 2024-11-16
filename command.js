import { REST, Routes } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const commands = [
    {
        name: "schedule",
        description: "Manages your schedule",
        options: [
            {
                name: 'create',
                description: 'Creates a new schedule',
                type: 1
            },
            {
                name: 'edit',
                description: 'Edits your schedule',
                type: 1
            },
            {
                name: 'view',
                description: 'View your schedule',
                type: 1
            },
            {
                name: 'report',
                description: 'View your performace',
                type: 1
            },
            {
                name: 'clear',
                description: 'Clears your schedule',
                type: 1
            },
            {
                name: 'delete',
                description: 'Deletes your schedule',
                type: 1
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async()=>{
    try{
        console.log("started refreshing application(/) commands");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands, }
        );
        console.log("Successfully reloaded application(/) commands")
    }catch(err){
        console.log(err);
    }
})();