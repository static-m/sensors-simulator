var fs = require("fs");

/**
 * JSON files and stdout data output
 */
class Output {
    constructor(outputFolder, consoleEnabled) {
        this.outputFolder = outputFolder;
        this.consoleEnabled = consoleEnabled;

        this.fileHandles = {};

        if (!fs.existsSync(this.outputFolder)) {
            fs.mkdirSync(this.outputFolder);
        }
    }

    enableConsole(enable = true) {
        this.consoleEnabled = enable;
    }

    write(file, data) {
        if (this.consoleEnabled) {
            console.log(data.sensor + ": " + data.value);
        }

        let handle = this.getFileHandle(file);
        handle.write(JSON.stringify(data) + "\n");
    }

    getFileHandle(file) {
        if (this.fileHandles.hasOwnProperty(file)) {
            return this.fileHandles[file];
        }

        let handle = fs.createWriteStream(this.outputFolder + file + ".json", {
            flags: "a",
        });

        this.fileHandles[file] = handle;
        return handle;
    }

    shutdown() {
        Object.keys(this.fileHandles).forEach((file) => {
            let handle = this.fileHandles[file];
            handle.end();
        });

        process.exit();
    }
}

module.exports = Output;
