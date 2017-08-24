'use strict';

const expect = require('chai').expect;
const workScheduleMethods = require('./app');
const WorkScheduleFactory = workScheduleMethods.WorkScheduleFactory;
const DueToDateCalculator = workScheduleMethods.DueToDateCalculator;
describe('CalculateDueDate ', function() {

    let testData = [
        {
            testText : 'should return the same date for 0 hours',
            startDate : new Date(),
            hoursToAdd : 0,
            toEql : new Date()
        },
        {
            testText : 'should return the plus 2 days plus the overlapping working hours',
            startDate : new Date(2017, 7, 2, 16, 30),
            hoursToAdd : 11,
            toEql : new Date(2017, 7, 4, 11, 30)
        },
        {
            testText : 'should return the next day plus the overlapping working hours',
            startDate : new Date(2017, 7, 3, 16, 30),
            hoursToAdd : 3,
            toEql : new Date(2017, 7, 4, 11, 30)
        },
        {
            testText : 'should return the plus 2 days plus the overlapping working hours',
            startDate : new Date(2017, 7, 2, 16, 30),
            hoursToAdd : 11,
            toEql : new Date(2017, 7, 4, 11, 30)
        },        {
            testText : 'should return plus 1 day and jump to the next month',
            startDate : new Date(2017, 7, 31, 16, 0),
            hoursToAdd : 8,
            toEql : new Date(2017, 8, 1, 16, 0)
        },
        {
            testText : 'should return the the next workday skip the weekend plus the overlapping working hours',
            startDate : new Date(2017, 7, 4, 16, 30),
            hoursToAdd : 3,
            toEql : new Date(2017, 7, 7, 11, 30)
        },
        {
            testText : 'should return the date plus 3 days and skip the weekend plus the overlapping working hours',
            startDate : new Date(2017, 7, 4, 16, 30),
            hoursToAdd : 3 * 8,
            toEql : new Date(2017, 7, 9, 16, 30)
        },
        {
            testText : 'should return the date plus 6 days and skip the weekend',
            startDate : new Date(2017, 7, 2, 16, 30),
            hoursToAdd : 6 * 8,
            toEql : new Date(2017, 7, 10, 16, 30)
        },
        {
            testText : 'should return the date plus 16 days and skip the weekends',
            startDate : new Date(2017, 7, 2, 16, 30),
            hoursToAdd : 16 * 8,
            toEql : new Date(2017, 7, 24, 16, 30)
        },
        {
            testText : 'should return the date plus 46 days and skip the weekends',
            startDate : new Date(2017, 7, 2, 16, 30),
            hoursToAdd : 46 * 8,
            toEql : new Date(2017, 9, 5, 16, 30)
        },
        {
            testText : 'should return the date plus 46 days plus 3 hours and skip the weekends',
            startDate : new Date(2017, 7, 2, 16, 30),
            hoursToAdd : (46 * 8) + 3,
            toEql : new Date(2017, 9, 6, 11, 30)
        }
    ];

    let factory = new WorkScheduleFactory();
    let calculator = new DueToDateCalculator(factory.createBasicSchedule());

    testData.forEach((data) => {
        it(data.testText, () => {
            expect(calculator.ordCalculateDueDate(data.startDate, data.hoursToAdd))
                .to.eql(data.toEql);
        });
    });

    it('should return the date plus 46 days plus 3 hours and skip the weekends', () => {
        let now = new Date(2017, 7, 2, 16, 30);
        expect(calculator.ordCalculateDueDate(now, (46 * 8) + 3)).to.eql(new Date(2017, 9, 6, 11, 30));
    });

    it('should return an Error: "Submit date is a weekend day"', () => {
        let now = new Date(2017, 7, 5, 16, 30);
        expect(function() {
            calculator.ordCalculateDueDate(now, 123213);
        }).to.throw(Error, 'Submit date is a weekend day');
    });

    it('should return an Error: "Turnaround time must be >= 0"', () => {
        let now = new Date(2017, 7, 5, 16, 30);
        expect(function() {
            calculator.ordCalculateDueDate(now, -6);
        }).to.throw(Error, 'Turnaround time must be >= 0');
    });
});

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}