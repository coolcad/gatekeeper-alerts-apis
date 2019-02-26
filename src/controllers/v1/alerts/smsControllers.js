const smsHelper = require("../../../helpers/sms");

const smsControllers = {};

smsControllers.sendAlertSMS = async alert => {
  // Generate SMS message.
  const messageBody = `GateKeeper Alert: ${alert.alertName}. Check alert logs in GateKeeper Hub.`;

  const alertSendActions = alert.receivers.map(async receiver => {
    if (receiver.phoneNumber) {
      const smsOptions = {
        messageBody,
        phoneNumber: receiver.phoneNumber
      };
      await smsHelper.sendSMS(smsOptions);
    }
  });
  await Promise.all(alertSendActions);
};

module.exports = smsControllers;
