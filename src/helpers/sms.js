const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require("twilio")(accountSid, authToken);

const sendSMS = async opts => {
  const { messageBody, phoneNumber } = opts;

  if (!messageBody) {
    throw new Error("Empty message should not be sent in SMS.");
  }

  if (!phoneNumber) {
    throw new Error("Phone Number is not provided.");
  }

  return twilioClient.messages.create({
    body: messageBody,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
};

module.exports = {
  sendSMS
};
