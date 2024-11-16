import { Client, GatewayIntentBits, Events } from "discord.js";
import * as dotenv from 'dotenv';
import connectDB from "./config/connectDB.js"
import handleSchedule from "./schedule/main.schedule.js";
import handleCounter from "./counter/main.counter.js";
import handleStudySessions from "./schedule/client/ping.schedule.js";
import registerAllUsers from "./registerEveryone.js";
import { handleUserJoin, handleUserLeave } from "./user/user.join.leave.js";

dotenv.config();

connectDB();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once(Events.ClientReady, ()=>{
    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(() => {
        handleStudySessions(client);
    }, 60*1000);
    // registerAllUsers(client);
});

client.on(Events.GuildMemberAdd, (member) =>{
    handleUserJoin(member);
});

client.on(Events.GuildMemberRemove, (member) =>{
    handleUserLeave(member);
});

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    handleCounter(oldState, newState);
});

client.on(Events.InteractionCreate, async(interaction)=>{
    if(!interaction.isCommand()) return;

    const commandName = interaction.commandName;

    if(commandName === 'schedule'){
        await handleSchedule(interaction);
    }
});

client.login(process.env.TOKEN);

