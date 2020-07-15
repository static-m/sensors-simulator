/**
 * Holds sensor configuration, handles randomized data simulation
 */

class Sensor {
    constructor(name, config) {
        this.name = name;
        this.config = config;

        this.setup();
    }

    setup() {
        let config = this.config;

        //whether given config values average are on increase during midnight
        let midnightIncrease = config.minHour > config.maxHour;

        let stationaryPoints; //turning points in increase/decrease
        let stationaryPointsValues; //values in those points

        let valueDiff = config.maxValue - config.minValue; //difference between daily config min and max values
        let increaseTimeDiffHours = config.maxHour - config.minHour; //difference between daily min and max daytime in hours

        if (midnightIncrease) {
            //if maximum occurs first, make it positive (diff trough midnight)
            increaseTimeDiffHours += 24;
            stationaryPoints = [config.maxHour, config.minHour];
            stationaryPointsValues = [config.maxValue, config.minValue];
        } else {
            stationaryPoints = [config.minHour, config.maxHour];
            stationaryPointsValues = [config.minValue, config.maxValue];
        }

        //convert stationary points hours to seconds
        stationaryPoints = stationaryPoints.map((hours) => hours * 60 * 60);

        let decreaseTimeDiffHours = 24 - increaseTimeDiffHours;

        //how much should value change per second in average
        let increasePerSec = valueDiff / (increaseTimeDiffHours * 60 * 60);
        let decreasePerSec =
            -1 * (valueDiff / (decreaseTimeDiffHours * 60 * 60));

        let midnightValue;

        if (midnightIncrease) {
            midnightValue =
                config.maxValue - stationaryPoints[0] * increasePerSec;
        } else {
            midnightValue =
                config.minValue - stationaryPoints[0] * decreasePerSec;
        }

        //add midnight as first stationary point
        stationaryPoints = [0].concat(stationaryPoints);
        stationaryPointsValues = [midnightValue].concat(stationaryPointsValues);

        this.midnightIncrease = midnightIncrease;
        this.stationaryPoints = stationaryPoints;
        this.stationaryPointsValues = stationaryPointsValues;
        this.increasePerSec = increasePerSec;
        this.decreasePerSec = decreasePerSec;
    }

    generateValue(elapsed = 0) {
        //find out which part of the day it is
        let currentPhase =
            this.stationaryPoints.filter((value) => {
                return elapsed >= value;
            }).length - 1;

        //whether in current part of day the value should be on increase
        let currentlyIncreasing =
            (currentPhase + (this.midnightIncrease ? 0 : 1)) % 2 === 0;

        //most recent value from config, or midnight
        let lastStationaryPointValue = this.stationaryPointsValues[
            currentPhase
        ];

        //exact value based on distance from last value from config (or from midnight)
        let exactValue =
            lastStationaryPointValue +
            (currentlyIncreasing ? this.increasePerSec : this.decreasePerSec) *
                (elapsed - this.stationaryPoints[currentPhase]);

        return this.randomizeValue(exactValue);
    }

    randomizeValue(value) {
        let maxDeviation = this.config.maxDeviation;

        //randomize number by maxDeviation, however, do not cross hard limits from config
        let lowerLimit = Math.max(this.config.minValue, value - maxDeviation);
        let upperLimit = Math.min(this.config.maxValue, value + maxDeviation);

        return (Math.random() * (upperLimit - lowerLimit) + lowerLimit).toFixed(
            this.config.precision
        );
    }
}

module.exports = Sensor;
