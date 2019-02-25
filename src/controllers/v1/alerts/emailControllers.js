const path = require("path");
const pug = require("pug");
const mailer = require("../../../helpers/mailer");

const emailControllers = {};

emailControllers.sendAlertEmail = async alert => {
  const emailTemplatePath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    "emailAlert.pug"
  );

  // Generate Html from pug template file with alert info.
  const emailHtml = pug.renderFile(emailTemplatePath, { alert });

  // Options for nodemailer
  const emailOptions = {
    from: `GateKeeper Alerts <${process.env.ALERTS_EMAIL_ID}>`,
    to: alert.receivers.map(x => x.email.trim()),
    subject: `GateKeeper Alert: ${alert.alertName}`,
    html: emailHtml
  };
  await mailer.sendMail(emailOptions, err => {
    if (err) {
      // This error is caught at route catch block
      throw new Error(err.message);
    }
  });
};

module.exports = emailControllers;
