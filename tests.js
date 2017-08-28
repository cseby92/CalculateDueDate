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
            expect(calculator.calculate(data.startDate, data.hoursToAdd))
                .to.eql(data.toEql);
        });
    });
    let dataError =
    [
        {
            testText : 'should return an Error: "Submit date is a weekend day"',
            startDate :  new Date(2017, 7, 5, 16, 30),
            hoursToAdd : 123213,
            toEql : 'Submit date is a weekend day'
        },
        {
            testText : 'should return an Error: "Turnaround time must be >= 0"',
            startDate :  new Date(2017, 7, 5, 16, 30),
            hoursToAdd : -6,
            toEql : 'Turnaround time must be >= 0'
        }
    ]

    dataError.forEach((data) => {
        it(data.testText, () => {
            expect( () => {
                calculator.calculate(data.startDate, data.hoursToAdd);
            }).to.throw(Error, data.toEql);
        });
    });

    let calculator2 = new DueToDateCalculator(factory.createSchedule(8, 16, ['Saturday', 'Sunday']));

    it('should return the next working day plus 2 hours with new schedule', () => {
        expect(calculator2.calculate(new Date(2017,7,28,13,0),5)).to.eql(new Date(2017, 7, 29, 10, 0 ));
    });

    let calculator3 = new DueToDateCalculator(factory.createSchedule(9, 17, ['Saturday', 'Sunday', 'Monday']));


    it('should return the next wednesday with new schedule', () => {
        expect(calculator3.calculate(new Date(2017,7,16,13,0),4*8)).to.eql(new Date(2017, 7, 23, 13, 0 ));
    });

    it('should throw an error becouse monday is a non working day', () => {
        expect(() => {
            calculator3.calculate(new Date(2017,7,28,13,0), 2335234)
        }).to.throw(Error, 'Submit date is a weekend day');
    });

});

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}