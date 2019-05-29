const express = require("express");

const router = express.Router();

// Routes for /api/v1/alerts
router.use("/alerts", require("./alerts"));
router.use("/notifications", require("./notifications"));
router.use("/zendesk", require("./zendesk"));

module.exports = router;
