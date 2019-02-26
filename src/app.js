const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { errors } = require("celebrate");
const rateLimit = require("express-rate-limit");
const logger = require("winston");
const routes = require("./routes");

const app = express();

// Prevent common attacks from bad headers
app.use(helmet());

app.use(morgan("dev"));
require("./helpers/logger");

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
  return res.send(404, "404: Invalid request route");
});

process.on("uncaughtException", err => {
  logger.error(`Caught exception: ${err.message}`);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
