'use strict'

const workStartHour = 9;
const workEndHour = 17;
const numberOfSaturday = 6;
const numberOfSunday = 0;
function ordCalculateDueDate(submitDate, turnAroundTime){

    if(turnAroundTime === 0)
        return submitDate;
    if(isStillThisWorkday(submitDate, turnAroundTime)){
        return addHours(submitDate, turnAroundTime);
    }else{
        let incrementedDate = getOverLappingDate(submitDate,turnAroundTime);
        while(isWeekend(incrementedDate)){
            incrementedDate = addDays(incrementedDate,1);
        }
        return incrementedDate;
    }

}

function isStillThisWorkday(date, hoursToAdd){
    return addHours(date, hoursToAdd).getHours() <= workEndHour &&
        addHours(date, hoursToAdd).getDate() === date.getDate();
}
function addHours(date, hours) {
    return new Date(date.getTime() + hours*60000*60);
}

function getOverLappingDate(submitDate,turnAroundTime){
    let daysToAdd =calculateDaysToAdd(submitDate,turnAroundTime);
    let hoursToAdd = calculateHoursToADD(submitDate,turnAroundTime);

    let daysAdded = addDays(submitDate,daysToAdd);
    return new Date(daysAdded.getFullYear(), daysAdded.getMonth(), daysAdded.getDate(), workStartHour+hoursToAdd, daysAdded.getMinutes());
}
function calculateDaysToAdd(date, hours){
    return Math.floor((date.getHours() - workStartHour + hours) / 8);
}
function calculateHoursToADD(date,hours){
    return (date.getHours() - workStartHour + hours) % 8;
}
function addDays(date, days){
    return new Date(date.setDate( date.getDate() + days));
}
function isWeekend(date){
    let day = date.getDay();
    return day === numberOfSaturday || day === numberOfSunday;
}
module.exports = ordCalculateDueDate;