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

  const emailHtml = pug.renderFile(emailTemplatePath, { alert });
  const emailOptions = {
    from: `GateKeeper Alerts <${process.env.ALERTS_EMAIL_ID}>`,
    to: alert.receivers.map(x => x.email.trim()),
    subject: `GateKeeper Alert: ${alert.alertName}`,
    html: emailHtml
  };
  await mailer.sendMail(emailOptions, err => {
    if (err) {
      throw new Error(err.message);
    }
  });
};

module.exports = emailControllers;
