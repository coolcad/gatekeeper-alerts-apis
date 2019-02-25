const express = require("express");

const router = express.Router();
const logger = require("winston");
const emailControllers = require("../../controllers/v1/alerts/emailControllers");
const validators = require("./validators");

// POST /api/v1/alerts/send
router.post("/send", validators.alert(), async (req, res) => {
  try {
    const alerts = req.body;
    alerts.forEach(async alert => {
      await emailControllers.sendAlertEmail(alert);
    });
    return res.status(200).send({
      type: "SUCCESS",
      message: "Successfully sent email alert"
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).send({
      type: "ERROR",
      message: error.message
    });
  }
});

module.exports = router;
