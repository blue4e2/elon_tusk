import * as dotenv from 'dotenv';
import { getSchedule, editSchedule } from "../schedule/server/controller.schedule.js";

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
const userVoiceTimes = {};

const handleCounter = async(oldState, newState) => {
    try{
        const discordId = newState.id;
        const isInTargetCategory = vcs.includes(newState.channel?.parentId);
        const currentDate = new Date();

        const res1 = await getSchedule({ discordId });
        if(!res1.success){
            console.log(res1.message);
            return;
        }
        const schedule = res1.data

        if( (isInTargetCategory && newState.channel && !oldState.channel) ||
            (isInTargetCategory && newState.channel && vcs.includes(oldState.channel?.parentId))
        ){
            if(isWithinSchedule(schedule)){
                console.log("within schedule");
                userVoiceTimes[discordId] = Date.now();
            }
        }

        if((!newState.channel && oldState.channel && 
            vcs.includes(oldState.channel.parentId)) ||
            (!isInTargetCategory && oldState.channel && 
            vcs.includes(oldState.channel.parentId))
        ){
            const joinTime = userVoiceTimes[discordId];
            if(joinTime){
                const duration = Math.floor((Date.now() - joinTime)/1000);
                const res2 = await editSchedule({ 
                    discordId: discordId, 
                    reportData: {
                        date: currentDate.toISOString().split('T')[0],
                        duration: duration
                    }
                });
                if(!res2.success){
                    console.log(res2.message);
                }else{
                    console.log("report updated")
                }
                delete userVoiceTimes[discordId];
            }
        }
    }catch(err){
        console.log(err);
    }
}

const isWithinSchedule = (schedule) => {
    const currentTime = new Date();
    const dayOfWeek = currentTime.toLocaleString('en-US',{ weekday: 'long'});
    const todaySchedule = schedule.scheduleData[dayOfWeek];

    for(const timeRange of todaySchedule){
        const [startTime, endTime] = timeRange.split('-').map(time=>{
            const [hours, minutes] = time.split(':');
            return new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                hours, 
                minutes
            )
        });

        if(currentTime>=startTime && currentTime<=endTime){
            return true;
        }
    }
    return false;
}

export default handleCounter;