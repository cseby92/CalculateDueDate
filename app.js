'use strict';

const WORK_START_HOURS = 9;
const WORK_END_HOURS = 17;
const WORK_HOURS = WORK_END_HOURS - WORK_START_HOURS;
const SATURDAY = 6;
const SUNDAY = 0;

class WorkScheduleFactory{

    createSchedule(workStartHours, workEndHours, saturday, sunday){
        return {
            //todo saturday sunday lekezelése, hogy ne számot kelljen beírni
            //todo később munkaszüneti napok 1 tömbbe dinamikusan
            workStartHours : workStartHours,
            workEndHours : workEndHours,
            saturday: saturday,
            sunday : sunday
        }
    }

    createBasicSchedule(){
        return {
            workStartHours : 9,
            workEndHours : 17,
            saturday: 6,
            sunday : 0
        }
    }
}

class DueToDateCalculator{

    constructor(workSchedule){
        if(!workSchedule){
            this.WORK_START_HOURS = 9;
            this.WORK_END_HOURS = 17;
            this.WORK_HOURS = WORK_END_HOURS - WORK_START_HOURS;
            this.SATURDAY = 6;
            this.SUNDAY = 0;
        }else{
            this.WORK_START_HOURS = workSchedule.workStartHours;
            this.WORK_END_HOURS = workSchedule.workEndHours;
            this.WORK_HOURS = this.WORK_END_HOURS - this.WORK_START_HOURS;
            this.SATURDAY = workSchedule.saturday;
            this.SUNDAY = workSchedule.sunday;
        }
    }

    ordCalculateDueDate(submitDate, turnAroundTime) {

        let a = new DueToDateCalculator();

        if (turnAroundTime < 0)
            throw new Error('Turnaround time must be >= 0');
        if (this.isWeekend(submitDate))
            throw new Error('Submit date is a weekend day');
        if (turnAroundTime === 0)
            return submitDate;
        if (this.isStillThisWorkday(submitDate, turnAroundTime)) {
            return this.addHours(submitDate, turnAroundTime);
        } else {
            return new Date(this.getOverLappingDate(submitDate, turnAroundTime));
        }
    }

    //todo: hide theese private functions????

    isStillThisWorkday(date, hoursToAdd) {

        let onTime = this.addHours(date, hoursToAdd).getHours() <= WORK_END_HOURS;
        let today = this.addHours(date, hoursToAdd).getDate() === date.getDate();

        return onTime && today;
    }

    addHours(date, hours) {
        return new Date(date.getTime() + hours * 60000 * 60);
    }

    getOverLappingDate(submitDate, turnAroundTime) {
        let daysToAdd = this.calculateDaysToAdd(submitDate, turnAroundTime);
        let hoursToAdd = this.calculateHoursToAdd(submitDate, turnAroundTime);

        return this.addHoursAndDaysToDate(submitDate, daysToAdd, hoursToAdd);
    }

    calculateDaysToAdd(date, hours) {
        let days = Math.floor((date.getHours() - WORK_START_HOURS + hours) / WORK_HOURS);
        let weekendDays = this.countWeekEndDays(date, hours);

        return days + weekendDays;
    }

    calculateHoursToAdd(date, hours) {
        return (date.getHours() - WORK_START_HOURS + hours) % WORK_HOURS;
    }

    addHoursAndDaysToDate(date, days, hours){
        let daysAdded = this.addDays(date, days);
        return daysAdded.setHours(WORK_START_HOURS + hours);
    }

    countWeekEndDays(date, hours) {
        let tempDate = new Date(date);
        let hoursToDays = Math.floor(hours / 8);
        let remainingHours = hours % 8;
        let weekEndDays = this.calculateWeekeendDaysByDays(tempDate, hoursToDays);
        weekEndDays += this.calculateWeekendByRemainingHours(tempDate, remainingHours);

        return weekEndDays;
    }

    calculateWeekeendDaysByDays(date, days) {
        let weekEndDays = 0;
        let tempDate = new Date(date);
        while (days !== 0) {
            tempDate = this.addDays(tempDate, 1);
            if (this.isWeekend(tempDate)) {
                weekEndDays += 2;
                tempDate = this.addDays(tempDate, 1);
            } else
                days--;
        }
        return weekEndDays;
    }

    calculateWeekendByRemainingHours(date, hours) {
        let weekEndDays = 0;
        date = this.addHours(date, hours);
        if (date.getHours() > 17) {
            date = this.addDays(date, 1);
            if (this.isWeekend(date))
                weekEndDays += 2;
        }
        return weekEndDays;
    }

    isWeekend(date) {
        let day = date.getDay();
        return day === SUNDAY || day === SATURDAY;
    }

    addDays(date, days) {
        let tempDate = new Date(date);
        return new Date(tempDate.setDate(tempDate.getDate() + days));
    }
}

let a = new DueToDateCalculator(WorkScheduleFactory.createBasicSchedule);

module.exports = {DueToDateCalculator, WorkScheduleFactory};