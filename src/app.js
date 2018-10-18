const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const indexRouter = require("./routes/index");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
app.use(helmet());

app.use(morgan("dev"));
require("./helpers/logger");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/api", apiRoutes);

module.exports = app;
