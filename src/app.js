const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const indexRouter = require("./routes");
const apiRoutes = require("./routes/apiRoutes");
const { errors } = require("celebrate");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(helmet());

const apiRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});

app.use(morgan("dev"));
require("./helpers/logger");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/", apiRateLimit);
app.use("/", indexRouter);
app.use("/api", apiRateLimit);
app.use("/api", apiRoutes);

app.use(errors());

process.on("uncaughtException", function(err) {
  console.log("Caught exception: " + err);
});

module.exports = app;
