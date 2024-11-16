const isValidTime = (newTime) => {
    const timeRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-(0[0-9]|1[0-9]|2[0-3])-(0[0-9]|[1-5][0-9])$/;

    if(!timeRegex.test(newTime)){
        return {valid: false, message: "invalid time format. Enter your timezone in 24 hours format (eg: YYYY-MM-DD-HH-MM)"};
    }

    return { valid: true }
}

const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours*60+minutes;
} 

const isValidTiming = (newTiming, existingTiming) => {
    const timingRegex = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]-(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
            
    if(!timingRegex.test(newTiming)){
        return {valid: false, message: "invalid timing format. Please enter in 24-hour format (eg: 09:30-17:30)"};
    }

    const [newStart, newEnd] = newTiming.split('-').map(time=>time.trim());
    const newStartTime = convertToMinutes(newStart);
    const newEndTime = convertToMinutes(newEnd);

    if(newStartTime >= newEndTime){
        return { valid: false, message: "End time must be greater than start time."}
    }

    for(const timing of existingTiming){
        const [existingStart, existingEnd] = timing.split('-').map(time => time.trim());

        const existingStartTime = convertToMinutes(existingStart);
        const existingEndTime = convertToMinutes(existingEnd);

        if((newStartTime < existingEndTime) && (newEndTime > existingStartTime)){
            return { valid: false, message: `Timings overlap with ${existingStart}-${existingEnd}`}
        }
    }

    return { valid: true }
}

const getOffset = (othersTime) => {
    const [othersYear, othersMonth, othersDate, othersHour, othersMinute] = othersTime.split('-').map(Number);

    const othersTimeObject = new Date(othersYear, othersMonth-1, othersDate, othersHour, othersMinute);

    const myTime = new Date();
    
    const timeDifference = (myTime.getTime() - othersTimeObject.getTime());
    
    return timeDifference
}

const convertTimeToIST =  (time, offset) => {
    const [start, end] = time.split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const currentDate = new Date();

    const othersStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startHour, startMinute)
    const othersStart = new Date(othersStartDate.getTime() + offset);
    
    const othersEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), endHour, endMinute)
    const othersEnd = new Date(othersEndDate.getTime() + offset);

    return `${othersStart.toTimeString().slice(0,5)}-${othersEnd.toTimeString().slice(0,5)}`
}

function convertSchedule(scheduleData, offset){
    let newSchedule = {
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': [],
        'Sunday': [],
    }
    const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    for(let i in daysOfWeek){
        newSchedule[daysOfWeek[i]] = scheduleData[daysOfWeek[i]].map(time =>  convertTimeToIST(time, offset))
    }
    return newSchedule;
}

export { isValidTime, isValidTiming, getOffset, convertSchedule };