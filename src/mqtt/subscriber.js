const mqtt = require("mqtt");

/**
 * Subscribing to messages from MQTT broker
 * and configuring simulator based on settings in those
 */
class Subscriber {
    constructor(broker, simulator, output) {
        this.broker = broker;
        this.simulator = simulator;
        this.output = output;

        this.client = false;
    }

    listen() {
        if (!this.client) {
            this.client = mqtt.connect(this.broker);
        }

        this.client.on("connect", () => {
            this.client.subscribe("/settings/+"); //listen to change of settings
        });

        this.client.on("message", (topic, message) => {
            let parsedMessage = JSON.parse(message);

            switch (topic) {
                case "/settings/interval":
                    this.simulator.runInterval(parsedMessage);
                    break;
                case "/settings/function":
                    this.callFunction(parsedMessage);
            }
        });
    }

    callFunction(message) {
        let enable = message.enable;
        let functionName = message.functionName;

        switch (functionName) {
            case "logger":
                this.output.enableConsole(enable);
                break;
            case "shutdown":
                if (enable) {
                    this.output.shutdown();
                    break;
                }
        }
    }
}

module.exports = Subscriber;
