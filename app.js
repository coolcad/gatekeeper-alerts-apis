const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRoutes = require("./routes/index");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
app.use(helmet());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRoutes);
app.use("/api", apiRoutes);

process.on("uncaughtException", function(err) {
  console.log("Caught exception: " + err);
});

module.exports = app;
