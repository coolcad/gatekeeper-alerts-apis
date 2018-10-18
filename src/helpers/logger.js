const winston = require("winston");
const { combine, timestamp, label, prettyPrint } = winston.format;
require("winston-daily-rotate-file");

const rotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/gkalerts-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

rotateTransport.on("rotate", function(oldFilename, newFilename) {
  console.log(new Date(), oldFilename, newFilename);
});

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [rotateTransport, new winston.transports.Console({ json: true })],
  exitOnError: false
});

// winston.add(winston.transports.DailyRotateFile, {
//   filename: require("path").join(__dirname, "..", "..", "logs", "GKAlertsLogs"),

//   // Exception handling
//   handleExceptions: true,
//   humanReadableUnhandledException: true
// });

// Log exceptions to console with error metadata as json
// winston.handleExceptions(new winston.transports.Console({ json: true }));

winston.add(logger);

module.exports = logger;
