const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { errors } = require("celebrate");
const rateLimit = require("express-rate-limit");
const logger = require("winston");
const mongoose = require("mongoose");

mongoose.Promise = Promise;
const routes = require("./routes");
const config = require("./config/config");
const mailer = require("./helpers/mailer");

const app = express();

// Prevent common attacks from bad headers
app.use(helmet());

app.use(morgan("dev"));
require("./helpers/logger");

mongoose.connect(config.databaseUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000,
  poolSize: 10
});
const db = mongoose.connection;

db.on("error", () => {
  logger.error("connection error:");
});

db.once("open", () => {
  logger.info("Opened connection to mongo database");
});

db.on("connected", () => {
  logger.info("Connected to mongo database:");
});

db.on("reconnected", () => {
  logger.info("Reconnected to mongo database:");
});

db.on("disconnected", () => {
  logger.error("Disconnected from mongo database");
  mailer.sendServerIssueEmail("SERVER_DOWN", "GK API Server DB connection down.");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API Request rate limiter. Used to prevent brute-force attacks
const apiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // Max 100 requests from one IP in 10 minutes.
  max: 100 // Max 100 requests in windowMs time
});

app.use(apiRateLimiter);
app.use("/", routes);

// Use errors from celebrate(uses Joi validation) module
app.use(errors());

// 404 handler
app.use((req, res) => {
  return res.status(404).send("404: Invalid request route");
});

process.on("uncaughtException", err => {
  logger.error(`Caught exception: ${err.message}`);
  mailer.sendServerIssueEmail("UNCAUGHT_EXCEPTION", err.message);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  mailer.sendServerIssueEmail("UNHANDLED_REJECTION", err.message);
});

module.exports = app;
