import * as dotenv from 'dotenv';
import { ChannelType } from 'discord.js';
import { getAllUsers } from "../../user/user.controller.js";

dotenv.config();

const vcs = [
    process.env.DSA, 
    process.env.CB_02, 
    process.env.CB_24, 
    process.env.CB_46, 
    process.env.CB_68, 
    process.env.DISCUSSIONS, 
    process.env.DEBUGS,
    process.env.COLLABS,
    process.env.CGS
]

const handleStudySessions = async(client) => {
try{
    const currentTime = new Date();
    const currentDay = currentTime.toLocaleString(
        'en-US',
        { weekday: 'long'}
    );
    const currentHour = currentTime.toTimeString().slice(0,5);

    const data = await getAllUsers();
    if(!data.success){
        console.log(data.message)
    }
    const users = data.data;

    users.forEach(user => {
        if(!user.schedule || !user.schedule.scheduleDataIST){
            console.log(user.discordName,"Schedule not registered")
        }else{
        const todaySchedule = user.schedule.scheduleDataIST[currentDay];

        if(todaySchedule){
            todaySchedule.forEach(async(session) => {
                const [startTime, endTime] = session.split('-');

                if(currentHour === startTime){
                    await pingUsers(client, `<@${user.discordId}>  It's time to grind, hop on!`);
                }

                if(currentHour === endTime){
                    const userInVoiceChannel = await checkUserInVoiceChannel(client, user.discordId);
                    if(userInVoiceChannel){
                        await pingUsers(client, `<@${user.discordId}>  It's break time!`);
                    }
                }
            });
        }
        }
    })
}catch(err){
    console.log(err)
    return await interaction.channel.send(`auto ping failed. <@1300072525530927165>`);
}
}

const pingUsers = async(client, message) => {
    const channel = await client.channels.fetch(process.env.SCHEDULE_PING);
    if(!channel || channel.type !== ChannelType.GuildText) return;

    await channel.send(message);
}

const checkUserInVoiceChannel = async(client, userId) => {
    const guild = client.guilds.cache.first();
    if(!guild){
        console.log("Bot is not connected to any guilds");
    }
    const member = await guild.members.fetch(userId);
    const voiceChannel = member.voice.channel;

    return member.voice.channel && vcs.includes(voiceChannel.parentId);
} 

export default handleStudySessions;