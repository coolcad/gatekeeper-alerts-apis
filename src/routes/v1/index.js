const express = require("express");

const router = express.Router();

// Routes for /api/v1/alerts
router.use("/alerts", require("./alerts"));

module.exports = router;
