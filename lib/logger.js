import winston from "winston";

// Create Log path and files:
const fs = require("fs");
// const env = "development";
const logDir = "log";

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const timeFormat = () => new Date();

// Create seperate exception logger:
winston.handleExceptions(
  new winston.transports.File({ filename: `${logDir}/-errors.log` })
);

// Create custom logger and export as default
const logger = new winston.Logger({
  transports: [
    // colorize the output to the console
    new winston.transports.Console({
      timestamp: timeFormat,
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      level: "debug"
    }),

    // we place a “-” before “results.log”, that appears in a format like: 2016-06-09-results
    new (require("winston-daily-rotate-file"))({
      filename: `${logDir}/-results.log`,
      timestamp: timeFormat,
      datePattern: "yyyy-MM-dd",
      prepend: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      level: "debug",
      json: false
      /* formatter: function (options) {
                // Return string will be passed to logger.
                return options.timestamp() + "-" + (options.message ? options.message : " ") + " " + options.level.toUpperCase();
            }*/
    })
  ]
});

export default logger;
