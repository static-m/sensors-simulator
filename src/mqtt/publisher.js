const mqtt = require("mqtt");

/**
 * Handles publishing messages into MQTT broker
 */
class Publisher {
    constructor(broker) {
        this.broker = broker;
        this.client = false;
    }

    publish(topic, message) {
        if (!this.client) {
            this.client = mqtt.connect(this.broker);
        }

        this.client.publish(topic, message);
    }
}

module.exports = Publisher;
