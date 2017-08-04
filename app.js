'use strict'

const workStartHour = 9;
const workEndHour = 17;
const workHours = workEndHour - workStartHour;
const numberOfSaturday = 6;
const numberOfSunday = 0;

function ordCalculateDueDate(submitDate, turnAroundTime){

    if(turnAroundTime === 0)
        return submitDate;
    if(isStillThisWorkday(submitDate, turnAroundTime)){
        return addHours(submitDate, turnAroundTime);
    }else{
        return getOverLappingDate(submitDate,turnAroundTime);
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
    let daysToAdd = calculateDaysToAdd(submitDate,turnAroundTime);
    let hoursToAdd = calculateHoursToAdd(submitDate,turnAroundTime);
    let daysAdded = addDays(submitDate,daysToAdd);

    return new Date(daysAdded.getFullYear(), daysAdded.getMonth(), daysAdded.getDate(), workStartHour+hoursToAdd, daysAdded.getMinutes());
}
function calculateDaysToAdd(date, hours){
    let days = Math.floor((date.getHours() - workStartHour + hours) / workHours);
    let weekendDays = countWeekEndDays(date, hours);

    return days + weekendDays;
}

function countWeekEndDays(date, hours){
    let tempDate = new Date(date);
    let weekendDays = 0;
    while(hours >= workHours){
        date = addDays(tempDate,1);
        if(isWeekend(tempDate)){
            weekendDays+=2;
            date = addDays(tempDate,1);
        }else{
            hours -= workHours;
        }
    }

    date = addHours(date,hours);
    if(date.getHours() >= 17)
        date = addDays(date,1);
    if(isWeekend(date)){
        weekendDays+=2;
    }
    return weekendDays;
}

function isWeekend(date){
    return date.getDay() === numberOfSunday || date.getDay() === numberOfSaturday;
}

function calculateHoursToAdd(date,hours){
    return (date.getHours() - workStartHour + hours) % workHours;
}
function addDays(date, days){
    return new Date(date.setDate( date.getDate() + days));
}
module.exports = ordCalculateDueDate;