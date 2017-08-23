'use strict';

const WORK_START_HOURS = 9;
const WORK_END_HOURS = 17;
const WORK_HOURS = WORK_END_HOURS - WORK_START_HOURS;
const SATURDAY = 6;
const SUNDAY = 0;

function ordCalculateDueDate(submitDate, turnAroundTime) {

    if (turnAroundTime < 0)
        throw new Error('Turnaround time must be >= 0');
    if (isWeekend(submitDate))
        throw new Error('Submit date is a weekend day');
    if (turnAroundTime === 0)
        return submitDate;
    if (isStillThisWorkday(submitDate, turnAroundTime)) {
        return addHours(submitDate, turnAroundTime);
    } else {
        return getOverLappingDate(submitDate, turnAroundTime);
    }
}

function isStillThisWorkday(date, hoursToAdd) {
    let onTime = addHours(date, hoursToAdd).getHours() <= WORK_END_HOURS;
    let today = addHours(date, hoursToAdd).getDate() === date.getDate();
    return onTime && today;
}

function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60000 * 60);
}

function getOverLappingDate(submitDate, turnAroundTime) {
    let daysToAdd = calculateDaysToAdd(submitDate, turnAroundTime);
    let hoursToAdd = calculateHoursToAdd(submitDate, turnAroundTime);

    return addHoursAndDaysToDate(submitDate, daysToAdd, hoursToAdd);
}

function calculateDaysToAdd(date, hours) {
    let days = Math.floor((date.getHours() - WORK_START_HOURS + hours) / WORK_HOURS);
    let weekendDays = countWeekEndDays(date, hours);

    return days + weekendDays;
}

function calculateHoursToAdd(date, hours) {
    return (date.getHours() - WORK_START_HOURS + hours) % WORK_HOURS;
}

function addHoursAndDaysToDate(date, days, hours){
    let daysAdded = addDays(date, days);
    let daysAndHoursAdded = new Date(daysAdded.getFullYear(),
        daysAdded.getMonth(),
        daysAdded.getDate(),
        WORK_START_HOURS + hours,
        daysAdded.getMinutes());

    return daysAndHoursAdded;
}

function countWeekEndDays(date, hours) {
    let tempDate = new Date(date);
    let hoursToDays = Math.floor(hours / 8);
    let remainingHours = hours % 8;

    let weekEndDays = calculateWeekeendDaysByDays(tempDate, hoursToDays);
    weekEndDays += calculateWeekendByRemainingHours(tempDate, remainingHours);

    return weekEndDays;
}

function calculateWeekeendDaysByDays(date, days) {
    let weekEndDays = 0;
    let tempDate = new Date(date);
    while (days !== 0) {
        tempDate = addDays(tempDate, 1);
        if (isWeekend(tempDate)) {
            weekEndDays += 2;
            tempDate = addDays(tempDate, 1);
        } else
            days--;
    }
    return weekEndDays;
}

function calculateWeekendByRemainingHours(date, hours) {
    let weekEndDays = 0;
    date = addHours(date, hours);
    if (date.getHours() > 17) {
        date = addDays(date, 1);
        if (isWeekend(date))
            weekEndDays += 2;
    }
    return weekEndDays;
}

function isWeekend(date) {
    let day = date.getDay();
    return day === SUNDAY || day === SATURDAY;
}

function addDays(date, days) {
    let tempDate = new Date(date);
    return new Date(tempDate.setDate(tempDate.getDate() + days));
}
module.exports = ordCalculateDueDate;