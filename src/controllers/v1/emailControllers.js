const mailer = require("../../helpers/mailer");
const path = require("path");
const pug = require("pug");
const moment = require("moment");

const emailControllers = {};

emailControllers.sendAlertEmail = async alert => {
  const emailTemplatePath = path.resolve(
    __dirname,
    "..",
    "..",
    "templates",
    "emailAlert.pug"
  );

  const alertDateTime = alert.alertLogs[0].alertDateTime;

  const emailHtml = pug.renderFile(emailTemplatePath, {
    name: alert.alertName,
    message: alert.alertMessage
  });
  const emailOptions = {
    from: `GateKeeper Alerts <${process.env.ALERTS_EMAIL_ID}>`,
    to: alert.receivers.map(x => x.email.trim()),
    subject: `GateKeeper Alert Notification: ${
      alert.alertName
    } generated at ${new Date().toString()}`,
    html: emailHtml
  };
  await mailer.sendMail(emailOptions, err => {
    if (err) {
      throw new Error(err.message);
    }
  });
};

module.exports = emailControllers;
