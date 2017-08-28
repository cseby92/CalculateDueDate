'use strict';

class WorkScheduleFactory {

    createSchedule(workStartHours, workEndHours, weekendDays) {
        let scheduleObject = {
            workStartHours: workStartHours,
            workEndHours: workEndHours,
        }
        scheduleObject.nonWorkingDays = weekendDays.map((day) => {
                return this.dayToDateCode(day);
        });

        console.log(scheduleObject);
        return scheduleObject;
    }

    createBasicSchedule() {
        return {
            workStartHours: 9,
            workEndHours: 17,
            nonWorkingDays: [this.dayToDateCode('saturday'), this.dayToDateCode('sunday')]
        }
    }

    dayToDateCode(day) {
        if (day.toLowerCase() === 'monday')
            return 1;
        if (day.toLowerCase() === 'tuesday')
            return 2;
        if (day.toLowerCase() === 'wednesday')
            return 3;
        if (day.toLowerCase() === 'thursday')
            return 4;
        if (day.toLowerCase() === 'friday')
            return 5;
        if (day.toLowerCase() === 'saturday')
            return 6;
        if (day.toLowerCase() === 'sunday')
            return 0;

        return 0;

    }
}

class DueToDateCalculator {

    constructor(workSchedule) {
        if (!workSchedule) {
            this.WORK_START_HOURS = 9;
            this.WORK_END_HOURS = 17;
            this.WORK_HOURS = this.WORK_END_HOURS - this.WORK_START_HOURS;
            this.NONWORKINGDAYS = [6, 0];//todo refactor
        } else {
            this.WORK_START_HOURS = workSchedule.workStartHours;
            this.WORK_END_HOURS = workSchedule.workEndHours;
            this.WORK_HOURS = this.WORK_END_HOURS - this.WORK_START_HOURS;
            this.NONWORKINGDAYS = workSchedule.nonWorkingDays;
            let filterDuplicates = function(elem, index, self) {
                return index == self.indexOf(elem);
            };
            this.NONWORKINGDAYS.filter(filterDuplicates);
        }

    }

    calculate(submitDate, turnAroundTime) {

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

        let onTime = this.addHours(date, hoursToAdd).getHours() <= this.WORK_END_HOURS;
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
        let days = Math.floor((date.getHours() - this.WORK_START_HOURS + hours) / this.WORK_HOURS);
        let weekendDays = this.countWeekEndDays(date, hours);

        return days + weekendDays;
    }

    calculateHoursToAdd(date, hours) {
        return (date.getHours() - this.WORK_START_HOURS + hours) % this.WORK_HOURS;
    }

    addHoursAndDaysToDate(date, days, hours) {
        let daysAdded = this.addDays(date, days);
        return daysAdded.setHours(this.WORK_START_HOURS + hours);
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
                weekEndDays += this.NONWORKINGDAYS.length;
                tempDate = this.addDays(tempDate, this.NONWORKINGDAYS.length - 1);
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
                weekEndDays += this.NONWORKINGDAYS.length;
        }
        return weekEndDays;
    }

    isWeekend(date) {
        let day = date.getDay();
        for (let i = 0; i < this.NONWORKINGDAYS.length; i++) {
            if (day === this.NONWORKINGDAYS[i])
                return true;
        }
        return false;
    }

    addDays(date, days) {
        let tempDate = new Date(date);
        return new Date(tempDate.setDate(tempDate.getDate() + days));
    }
}

module.exports = {DueToDateCalculator, WorkScheduleFactory};