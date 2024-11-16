import User from "../../models/user.model.js";
import Schedule from "../../models/schedule.model.js";
import { convertSchedule } from "../utils.schedule.js";

const createSchedule = async(req) => {
    const { discordId, offset, scheduleData } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user){
            return { success: false, message: "User doesn't exist." };
        }

        if(user.schedule){
            return { success: false, message: "You already created a schedule." };
        }

        const scheduleDataIST = convertSchedule(scheduleData, offset);
        
        const schedule = {
            discordId,
            offset,
            scheduleData,
            scheduleDataIST
        }

        user.schedule = schedule;
        await user.save();

        return { success: true, message: "Schedule Created Successfully" };
    }catch(err){
        console.log(err);
        return { success: false, message: "server error. schedule create failed. <@1300072525530927165>"};
    }
}

const editSchedule = async(req) => {
    const { discordId, offset, reportData, scheduleEditData } = req;
    try{
        const user = await User.findOne({ discordId });

        if(!user){
            return { success: false, message: "User doesn't exist." };
        }

        if(!user.schedule){
            return { success: false, message: "You haven't created a schedule." };
        }

        if(offset){
            user.schedule.timezone = offset;
        }
        if(scheduleEditData){
            const scheduleDataIST = convertSchedule(scheduleEditData, user.schedule.offset);
            console.log('scheduleDataIST',scheduleDataIST);
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            daysOfWeek.forEach(day => {
                if(scheduleEditData[day].length>0){
                    user.schedule.scheduleData[day] = scheduleEditData[day];
                    user.schedule.scheduleDataIST[day] = scheduleDataIST[day];
                }
            });
        }

        if(reportData){
            const tr = user.schedule.report
            if(tr.has(reportData.date)){
                tr.set(reportData.date, tr.get(reportData.date) + reportData.duration);
            }else{
                tr.set(reportData.date, reportData.duration);
            }
            console.log(tr)
        }
        await user.save();

        return { success: true, message: "Schedule Edited Successfully" };
    }catch(err){
        console.log(err);
        return { success: false, message: "server error. schedule edit failed. <@1300072525530927165>"};
    }
}

const getSchedule = async(req) => {
    const { discordId } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user.schedule){
            return { success: false, message: "You haven't created a schedule"}
        }

        return { success: true, data: user.schedule };
    }catch(err){
        console.log(err);
        return { success: false, message: "server error. schedule view failed. <@1300072525530927165>"};
    }
}

const clearSchedule = async(req) => {
    const { discordId, scheduleClearData } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user.schedule){
            return { success: false, message: "You haven't created a schedule"};
        }

        scheduleClearData.forEach(day=>{
            user.schedule.scheduleData[day] = [];
            user.schedule.scheduleDataIST[day] = [];
        });
        await user.save();

        return { success: true, message: "Schedule cleared successfully" };
    }catch(err){
        console.log(err);
        return { success: false, message: "server error. schedule clear failed. <@1300072525530927165>" };
    }
}

const deleteSchedule = async(req) => {
    const { discordId } = req;

    try{
        const user = await User.findOne({ discordId });

        if(!user.schedule){
            return { success: false, message: "You haven't created a schedule"};
        }

        user.schedule = null;
        await user.save();

        return { success: true, message: "Schedule deleted successfully" };
    }catch(err){
        console.log(err);
        return { success: false, message: "server error. schedule delete failed. <@1300072525530927165>" };
    }
}

export { createSchedule, getSchedule, editSchedule, clearSchedule, deleteSchedule};