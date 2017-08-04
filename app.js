'use strict';

const workStartHour = 9;
const workEndHour = 17;
const workHours = workEndHour - workStartHour;
const numberOfSaturday = 6;
const numberOfSunday = 0;

function ordCalculateDueDate(submitDate, turnAroundTime){

    if(turnAroundTime < 0)
        throw new Error('Turnaround time must be >= 0');
    if(isWeekend(submitDate))
        throw new Error('Submit date is a weekend day');
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

    return new Date(daysAdded.getFullYear(),
                    daysAdded.getMonth(),
                    daysAdded.getDate(),
                    workStartHour + hoursToAdd,
                    daysAdded.getMinutes());
}
function calculateDaysToAdd(date, hours){
    let days = Math.floor((date.getHours() - workStartHour + hours) / workHours);
    let weekendDays = countWeekEndDays(date, hours);

    return days + weekendDays;
}

function calculateHoursToAdd(date,hours){
    return (date.getHours() - workStartHour + hours) % workHours;
}

function countWeekEndDays(date, hours){
    let tempDate = new Date(date);
    let hoursToDays = Math.floor(hours / 8);
    let remainingHours = hours % 8;

    let weekEndDays = calculateWeekeendDaysByDays(tempDate,hoursToDays);
    weekEndDays += calculateWeekendByRemainingHours(tempDate, remainingHours);

    return weekEndDays;
}

function calculateWeekeendDaysByDays(date, days){
    let weekEndDays = 0;
    while(days !== 0){
        date = addDays(date, 1);
        if(isWeekend(date)){
            weekEndDays+= 2;
            date = addDays(date, 1);
        }else
            days--;
    }
    return weekEndDays;
}

function calculateWeekendByRemainingHours(date, hours) {
    let weekEndDays = 0;
    date = addHours(date, hours);
    if(date.getHours() > 17){
        date = addDays(date,1);
        if(isWeekend(date))
            weekEndDays+=2;
    }
    return weekEndDays;
}

function isWeekend(date){
    return date.getDay() === numberOfSunday || date.getDay() === numberOfSaturday;
}

function addDays(date, days){
    let tempDate = new Date(date);
    return new Date(tempDate.setDate( tempDate.getDate() + days));
}
module.exports = ordCalculateDueDate;