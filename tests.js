'use strict';

const expect = require('chai').expect;
const ordCalculateDueDate = require('./app');

describe('CalculateDueDate ', function () {

    it('should return the same date for 0 hours', () => {
        let now = new Date();
        expect(ordCalculateDueDate(now,0)).to.eql(now);
    });

    it('should return the same date plus 1 hour for 1 hours (no overlap)', () => {
        let now = new Date(2017, 7, 3, 9+2, 30);
        expect(ordCalculateDueDate(now,1)).to.eql(addMinutes(now, 60));
    });

    it('should return the next day plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 3, 16+2, 30);
        expect(ordCalculateDueDate(now,3)).to.eql(new Date(2017, 7, 4, 11+2, 30));
    });

    it('should return the plus 2 days plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 2, 16+2, 30);
        expect(ordCalculateDueDate(now,11)).to.eql(new Date(2017, 7, 4, 11+2, 30));
    });

    it('should return the plus 1 day and skip the weekend plus the overlapping working hours', () => {
        let now = new Date(2017, 7, 4, 16+2, 30);
    expect(ordCalculateDueDate(now,3)).to.eql(new Date(2017, 7, 7, 11+2, 30));
});

});

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}