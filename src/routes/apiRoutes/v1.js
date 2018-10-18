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

/* GET home page. */
router.get("/", bruteforce.prevent, (req, res, next) => {
  logger.info("Test");
  res.send("Welcome to GateKeeper v1 APIs");
});

router.post("/email", bruteforce.prevent, async (req, res, next) => {
  try {
    const alert = req.body;

    if (!alert) {
      res.status(400).send({
        type: "ERROR",
        message:
          "Please send alert with format {receiverEmail, receiverName, alertName, alertMessage} in body"
      });
      return;
    }

    const emailHtml = pug.renderFile(
      path.resolve(__dirname, "..", "..", "templates", "emailAlert.pug"),
      alert
    );

    const options = mailer.createEmailOptions({
      receiverEmail: alert.receiverEmail,
      subject: `GateKeeper Alert Notification: ${
        alert.alertName
      } generated at ${new Date().toString()}`,
      html: emailHtml
    });

    await mailer.sendMail(options, err => {
      if (!err) {
        res.status(200).send({
          type: "SUCCESS",
          message: `Email Alert sent to ${alert.receiverEmail}`
        });
        return;
      } else {
        res.status(400).send({
          type: "ERROR",
          message: err.message
        });
        return;
      }
    });
    // res.status(200).send({
    //   type: "SUCCESS",
    //   message: `Email Alert sent to ${alert.receiverEmail}`
    // });
    return;
  } catch (error) {
    res.status(400).send({
      type: "ERROR",
      message: error.message
    });
    return;
  }
});

module.exports = router;
