'use strict';

const expect = require('chai').expect;
const ordCalculateDueDate = require('./app');

describe('CalculateDueDate ', function () {

    it('should return the same date for 0 hours', () => {
        let now = new Date();
        expect(ordCalculateDueDate(now,0)).to.eql(now);
    });

    it('should return the same date plus 1 hour for 1 hours (no overlap)', () => {
        let now = new Date(2017, 7, 3, 9, 30);
        expect(ordCalculateDueDate(now,1)).to.eql(addMinutes(now, 60));
    });

    it('should return the next day plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 3, 16, 30);
        expect(ordCalculateDueDate(now,3)).to.eql(new Date(2017, 7, 4, 11, 30));
    });

    it('should return the plus 2 days plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 2, 16, 30);
        expect(ordCalculateDueDate(now,11)).to.eql(new Date(2017, 7, 4, 11, 30));
    });

    it('should return plus 1 day and jump to the next month', () => {
        let now = new Date(2017, 7, 31, 16, 0);
        expect(ordCalculateDueDate(now,8)).to.eql(new Date(2017, 8, 1, 16, 0));
    });

    it('should return plus 1 day and jump to the next year and month', () => {
        let now = new Date(2015, 11, 31, 16, 0);
        expect(ordCalculateDueDate(now,8)).to.eql(new Date(2016, 0, 1, 16, 0));
    });

    it('should return the the next workday skip the weekend plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 4, 16, 30);
        expect(ordCalculateDueDate(now,3)).to.eql(new Date(2017, 7, 7, 11, 30));
    });

    it('should return the date plus 3 days and skip the weekend plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 4, 16, 30);
        expect(ordCalculateDueDate(now,3*8)).to.eql(new Date(2017, 7, 9, 16, 30));
    });

    it('should return the date plus 6 days and skip the weekend', () => {
        let now = new Date(2017, 7, 2, 16, 30);
        expect(ordCalculateDueDate(now,6*8)).to.eql(new Date(2017, 7, 10, 16, 30));
    });

    it('should return the date plus 16 days and skip the weekends', () => {
        let now = new Date(2017, 7, 2, 16, 30);
        expect(ordCalculateDueDate(now,16*8)).to.eql(new Date(2017, 7, 24, 16, 30));
    });


    it('should return the date plus 46 days and skip the weekends', () => {
        let now = new Date(2017, 7, 2, 16, 30);
        expect(ordCalculateDueDate(now,46*8)).to.eql(new Date(2017, 9, 5, 16, 30));
    });


    it('should return the date plus 46 days plus 3 hours and skip the weekends', () => {
        let now = new Date(2017, 7, 2, 16, 30);
        expect(ordCalculateDueDate(now,(46*8)+3)).to.eql(new Date(2017, 9, 6, 11, 30));
    });

    it('should return an Error: "Submit date is a weekend day"', () => {
        let now = new Date(2017, 7, 5, 16, 30);
        expect(function () {
            ordCalculateDueDate(now,123213);
        }).to.throw(Error, 'Submit date is a weekend day');
    });

    it('should return an Error: "Turnaround time must be >= 0"', () => {
        let now = new Date(2017, 7, 5, 16, 30);
        expect(function () {
            ordCalculateDueDate(now,-6);
        }).to.throw(Error, 'Turnaround time must be >= 0');
    });

});

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}