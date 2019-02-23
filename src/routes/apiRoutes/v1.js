const express = require("express");
const router = express.Router();
const ExpressBrute = require("express-brute");
const pug = require("pug");
// const emailAlertTemplate = require("../../templates/emailAlert.pug");
const path = require("path");
const mailer = require("../../helpers/mailer");
const logger = require("winston");

const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);
const { celebrate, Joi, errors } = require("celebrate");
const emailControllers = require("../../controllers/v1/emailControllers");
const validators = require("./validators");

router.post(
  "/alerts/send",
  bruteforce.prevent,
  validators.alert(),
  async (req, res, next) => {
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
  }
);

module.exports = router;
