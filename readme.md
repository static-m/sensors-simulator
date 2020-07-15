## Sensors output simulator
NodeJS app simulating the output of weather conditions sensors' in sped-up time.

### Installation

    npm install
### Usage
    node app.js
By default, the simulated values are logged into a JSON file in the `out` folder and sent into a MQTT broker (default topic: `/sensors/<sensor-name>`).

### Configuration
Example config file is located in `config/default.json`. We differentiate _real time_ (user's point of view) and _simulated time_ (sensor's point of view).
*  `simulator`
   *  `speed`:`float` How many times faster the _simulated time_ is running compared to the _real time_ (`24` by default, where one simulated day takes an hour in _real time_)
   *  `interval`:`int` Sampling interval (_simulated time_, default `60000` - once a minute)
   *  `sensors` List of simulated sensors in the format`name:attributesObj`, where the attributes are:
      *  `minValue`:`float` Minimum possible sensor value
      *  `minHour`:`float` The hour when the minimum value occurs
      *  `maxValue`:`float`  Maximum possible sensor value
      *  `maxHour`:`float` The hour when the maximum value occurs
      *  `maxDeviation`:`float` Maximum deviation from the exact value on the interpolation function 
      *  `precision`:`int` Number of decimal places of the generated values
*  `mqtt`
   *  `broker`:`string` URL of the MQTT broker
   *  `eventTopic`:`string` Topic for sending the generated values (default `/sensors/`)
*  `output`
   *  `folder`:`string` Filepath for the output JSON files (will be created if it does not exist, default `out/`)
   *  `consoleEnabled`:`bool` Enable std out logging (default `true`)

### Notes
*  The simulation works by interpolating the given minimum and maximum values during the day and adding a random deviation from the given interval
*  The library [accurate-interval](https://www.npmjs.com/package/accurate-interval) had been used as `setInterval` does not guarantee accuracy

### TO-DO
*  Config validation
*  Unit tests
*  Universal solution for more than 2 points for interpolation
*  Differentiate private methods