const winston = require("winston");

const { combine, timestamp, prettyPrint, printf } = winston.format;
require("winston-daily-rotate-file");

// Define your custom format with printf.
const myFormat = printf(info => `${new Date(info.timestamp)}: ${info.level}: ${info.message}`);

const rotateTransport = new winston.transports.DailyRotateFile({
  filename: "../logs/%DATE%.log.txt",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  handleExceptions: true,
  level: "info"
});

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint(), myFormat),
  transports: [rotateTransport, new winston.transports.Console({ handleExceptions: true })],
  exitOnError: false
});

rotateTransport.on("rotate", (oldFilename, newFilename) => {
  logger.info(new Date(), oldFilename, newFilename);
});

winston.add(logger);

module.exports = logger;
