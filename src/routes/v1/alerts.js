const express = require("express");

const router = express.Router();
const logger = require("winston");
const emailControllers = require("../../controllers/v1/alerts/emailControllers");
const smsControllers = require("../../controllers/v1/alerts/smsControllers");
const validators = require("./validators");

// POST /api/v1/alerts/send
router.post("/send", validators.alert(), async (req, res) => {
  try {
    const alerts = req.body;
    const alertDeliveryActions = alerts.map(async alert => {
      // Send Email, SMS only if email/sms is passed in request
      if (alert.deliveryMethods.includes("email")) {
        await emailControllers.sendAlertEmail(alert);
      }
      if (alert.deliveryMethods.includes("sms")) {
        await smsControllers.sendAlertSMS(alert);
      }
    });
    await Promise.all(alertDeliveryActions);
    return res.status(200).send({
      type: "SUCCESS",
      message: "Successfully sent alert"
    });
  } catch (error) {
    // This catch block catches errors from the controllers of both email, sms at any depth.
    // Do not write duplicate catch blocks in methods that are called from this middleware
    logger.error(error.message);
    return res.status(400).send({
      type: "ERROR",
      message: error.message
    });
  }
});

module.exports = router;
