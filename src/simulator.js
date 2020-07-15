const accurateInterval = require("accurate-interval");
const Sensor = require("./sensor");

/**
 * Controls sensors and the simulation itself
 */
class Simulator {
    constructor(deviceId, config, output = false) {
        this.config = config;
        this.speed = this.config.speed;
        this.simulatedInterval = this.config.interval;
        this.deviceId = deviceId;

        this.runningInterval = false;
        this.elapsedSimulationTime = 0;
        this.output = output;
    }

    start() {
        this.sensors = {};
        let sensors = this.config.sensors;

        Object.keys(sensors).forEach((sensorName) => {
            let sensorConfig = sensors[sensorName];
            this.sensors[sensorName] = new Sensor(sensorName, sensorConfig);
        });

        this.startRealTime = Date();

        this.runInterval(this.simulatedInterval);
    }

    runInterval(simulatedIntervalSec) {
        this.realInterval = simulatedIntervalSec / this.speed;

        if (this.runningInterval) {
            clearInterval(this.runningInterval);
        }

        let self = this;

        this.runningInterval = accurateInterval(
            function () {
                self.generateCurrentSensorValues();
            },
            this.realInterval,
            {
                aligned: false,
                immediate: true,
            }
        );
    }

    generateCurrentSensorValues() {
        if (!this.startTime) {
            this.startTime = Date.now();
        }

        let elapsedTotal = this.elapsedSimulationTime;
        let elapsed = elapsedTotal % (60 * 60 * 24); //elapsed seconds since last midnight

        Object.keys(this.sensors).forEach((sensorName) => {
            let sensor = this.sensors[sensorName];
            let value = sensor.generateValue(elapsed);

            if (this.output) {
                this.output(this.formatEvent(sensorName, elapsedTotal, value));
            }
        });

        this.elapsedSimulationTime += this.simulatedInterval / 1000;
    }

    formatEvent(sensorName, elapsedTotal, value) {
        return {
            deviceId: this.deviceId,
            sensor: sensorName,
            value: value,
            date: this.getSimulatedDate(elapsedTotal),
        };
    }

    getSimulatedDate(elapsedTotal) {
        return new Date(this.startTime + elapsedTotal * 1000);
    }
}

module.exports = Simulator;
