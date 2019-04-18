const nodemailer = require("nodemailer");
const logger = require("winston");
const config = require("../config/config");

// console.log("TCL: config.xoauth2Options", config.xoauth2Options);
// const oauthGenerator = xoauth2.createXOAuth2Generator({
//   user: config.xoauth2Options.user,
//   clientId: config.xoauth2Options.clientId,
//   clientSecret: config.xoauth2Options.clientSecret,
//   refreshToken: config.xoauth2Options.refreshToken,
//   accessToken: config.xoauth2Options.accessToken
// });

// oauthGenerator.on("token", token => {
//   logger.info("New token for %s: %s", token.user, token.accessToken);
// });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     xoauth2: oauthGenerator
//   }
// });

const transporter = nodemailer.createTransport({
  pool: true,
  service: "gmail",
  logger: true,
  auth: {
    type: "OAuth2",
    user: config.xoauth2Options.user,
    clientId: config.xoauth2Options.clientId,
    clientSecret: config.xoauth2Options.clientSecret,
    refreshToken: config.xoauth2Options.refreshToken,
    accessToken: config.xoauth2Options.accessToken
  }
});

// verify connection configuration
transporter.verify(function transportVerify(error) {
  if (error) {
    logger.error(error);
  } else {
    logger.info("Nodemailer transporter is ready to take our messages");
  }
});

const sendMail = (opts, cb) => {
  transporter.sendMail(opts, err => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`Email Alert sent to ${opts.to}`);
    }
    cb(err);
  });
};

const sendServerIssueEmail = (type = "SERVER_DOWN", issueInfo = "") => {
  // Send myself a notification email when server goes down
  let subject = "";
  let html = "";

  switch (type) {
    case "SERVER_DOWN": {
      subject = "gkchain-apis DB connection down";
      html = `<h3>${issueInfo}</h3>`;
      break;
    }
    case "UNCAUGHT_EXCEPTION": {
      subject = "gkchain-apis Uncaught Exception";
      html = `<h3>${issueInfo}</h3>`;
      break;
    }

    case "UNHANDLED_REJECTION": {
      subject = "gkchain-apis Unhandled Rejection";
      html = `<h3>${issueInfo}</h3>`;
      break;
    }
    default:
      break;
  }

  const opts = {
    from: `GateKeeper Reports <${process.env.ALERTS_EMAIL_ID}>`,
    to: "sai@gkaccess.com",
    subject,
    html
  };
  transporter.sendMail(opts, err => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`Email Alert sent to ${opts.to}`);
    }
  });
};

module.exports = {
  sendMail,
  sendServerIssueEmail
};
