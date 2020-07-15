const config = require("config");
const Simulator = require("./src/simulator");
const Output = require("./src/output");
const { Publisher, Subscriber } = require("./src/mqtt");
const { v4: uuidv4 } = require("uuid");

const deviceId = uuidv4();

//output to JSON files and stdout
const output = new Output(config.output.folder, config.output.consoleEnabled);

//handles simulation speed and sensors
const simulator = new Simulator(deviceId, config.simulator, (event) => {
  output.write(event.sensor, event);
  publisher.publish(
    config.mqtt.eventTopic + event.sensor,
    JSON.stringify(event)
  );
});

//setup MQTT communication
const publisher = new Publisher(config.mqtt.broker);
const subscriber = new Subscriber(config.mqtt.broker, simulator, output); //pass the simulator to change it's config on the run

//handle commands from MQTT broker
subscriber.listen(config.mqtt.eventTopic);

//start the simulation
simulator.start();
console.log(
  "Simulation has started, see " + config.output.folder + " for output."
);

process.on("SIGINT", function () {
  output.shutdown();
});
