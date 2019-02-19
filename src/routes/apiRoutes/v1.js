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

router.post(
  "/alerts/send",
  bruteforce.prevent,
  celebrate({
    body: Joi.object().keys({
      alertName: Joi.string().required(),
      alertMessage: Joi.string().required(),
      deliveryMethods: Joi.array()
        .items(Joi.string().valid("sms", "email"))
        .required(),
      receivers: Joi.array()
        .items(
          Joi.object().keys({
            name: Joi.string(),
            email: Joi.string()
              .email()
              .required()
          })
        )
        .required()
    })
  }),
  async (req, res, next) => {
    try {
      const alert = req.body;
      await emailControllers.sendAlertEmail(alert);
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
