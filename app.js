'use strict';

class WorkScheduleFactory {

    createSchedule(workStartHours, workEndHours, weekendDays) {
        let scheduleObject = {
            workStartHours: workStartHours,
            workEndHours: workEndHours,
        }
        scheduleObject.nonWorkingDays = weekendDays.map((day) => {
                return this._dayToDateCode(day);
        });

        console.log(scheduleObject);
        return scheduleObject;
    }

    createBasicSchedule() {
        return {
            workStartHours: 9,
            workEndHours: 17,
            nonWorkingDays: [this._dayToDateCode('saturday'), this._dayToDateCode('sunday')]
        }
    }

    _dayToDateCode(day) {
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
            const SATURDAY = 6, SUNDAY = 0;
            this.NONWORKINGDAYS = [SATURDAY, SUNDAY];
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
        if (this._isWeekend(submitDate))
            throw new Error('Submit date is a weekend day');
        if (turnAroundTime === 0)
            return submitDate;
        if (this._isStillThisWorkday(submitDate, turnAroundTime)) {
            return this._addHours(submitDate, turnAroundTime);
        } else {
            return new Date(this._getOverLappingDate(submitDate, turnAroundTime));
        }
    }

    _isStillThisWorkday(date, hoursToAdd) {

        let onTime = this._addHours(date, hoursToAdd).getHours() <= this.WORK_END_HOURS;
        let today = this._addHours(date, hoursToAdd).getDate() === date.getDate();

        return onTime && today;
    }

    _addHours(date, hours) {
        return new Date(date.getTime() + hours * 60000 * 60);
    }

    _getOverLappingDate(submitDate, turnAroundTime) {
        let daysToAdd = this._calculateDaysToAdd(submitDate, turnAroundTime);
        let hoursToAdd = this._calculateHoursToAdd(submitDate, turnAroundTime);

        return this._addHoursAndDaysToDate(submitDate, daysToAdd, hoursToAdd);
    }

    _calculateDaysToAdd(date, hours) {
        let days = Math.floor((date.getHours() - this.WORK_START_HOURS + hours) / this.WORK_HOURS);
        let weekendDays = this._countWeekEndDays(date, hours);

        return days + weekendDays;
    }

    _calculateHoursToAdd(date, hours) {
        return (date.getHours() - this.WORK_START_HOURS + hours) % this.WORK_HOURS;
    }

    _addHoursAndDaysToDate(date, days, hours) {
        let daysAdded = this._addDays(date, days);
        return daysAdded.setHours(this.WORK_START_HOURS + hours);
    }

    _countWeekEndDays(date, hours) {
        let tempDate = new Date(date);
        let hoursToDays = Math.floor(hours / 8);
        let remainingHours = hours % 8;
        let weekEndDays = this._calculateWeekeendDaysByDays(tempDate, hoursToDays);
        weekEndDays += this._calculateWeekendByRemainingHours(tempDate, remainingHours);

        return weekEndDays;
    }

    _calculateWeekeendDaysByDays(date, days) {
        let weekEndDays = 0;
        let tempDate = new Date(date);
        while (days !== 0) {
            tempDate = this._addDays(tempDate, 1);
            if (this._isWeekend(tempDate)) {
                weekEndDays += this.NONWORKINGDAYS.length;
                tempDate = this._addDays(tempDate, this.NONWORKINGDAYS.length - 1);
            } else
                days--;
        }

        return weekEndDays;
    }

    _calculateWeekendByRemainingHours(date, hours) {
        let weekEndDays = 0;
        date = this._addHours(date, hours);
        if (date.getHours() > 17) {
            date = this._addDays(date, 1);
            if (this._isWeekend(date))
                weekEndDays += this.NONWORKINGDAYS.length;
        }
        return weekEndDays;
    }

    _isWeekend(date) {
        let day = date.getDay();
        for (let i = 0; i < this.NONWORKINGDAYS.length; i++) {
            if (day === this.NONWORKINGDAYS[i])
                return true;
        }
        return false;
    }

    _addDays(date, days) {
        let tempDate = new Date(date);
        return new Date(tempDate.setDate(tempDate.getDate() + days));
    }
}

module.exports = {DueToDateCalculator, WorkScheduleFactory};