const express = require("express");
const router = express.Router();
const pug = require("pug");
const path = require("path");
const mailer = require("../../helpers/mailer");
const logger = require("winston");
const { celebrate, Joi, errors } = require("celebrate");
const emailControllers = require("../../controllers/v1/emailControllers");
const validators = require("./validators");

router.post("/alerts/send", validators.alert(), async (req, res, next) => {
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
