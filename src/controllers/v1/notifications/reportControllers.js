const path = require("path");
const pug = require("pug");
const mailer = require("../../../helpers/mailer");

const reportControllers = {};

reportControllers.sendOnDemandReportStatusEmail = async report => {
  const emailTemplatePath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "templates",
    "onDemandReportStatus.pug"
  );

  // Generate Html from pug template file with alert info.
  const emailHtml = pug.renderFile(emailTemplatePath, { report });

  // Options for nodemailer
  const emailOptions = {
    from: `GateKeeper Reports <${process.env.ALERTS_EMAIL_ID}>`,
    to: report.receivers.map(x => x.email.trim()),
    subject: `GateKeeper Report generated`,
    html: emailHtml
  };
  await mailer.sendMail(emailOptions, err => {
    if (err) {
      // This error is caught at route catch block
      throw new Error(err.message);
    }
  });
};

module.exports = reportControllers;
