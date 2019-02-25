const { celebrate, Joi } = require("celebrate");

const validators = {};

validators.alert = () => {
  return celebrate({
    body: Joi.array().items(
      Joi.object().keys({
        alertName: Joi.string().required(),
        alertMessage: Joi.string().required(),
        deliveryMethods: Joi.array()
          .items(Joi.string().valid("sms", "email"))
          .required(),
        alertLogs: Joi.array().items(
          Joi.object().keys({
            alertDateTime: Joi.date()
              .iso()
              .required(),
            eventType: Joi.string().required(),
            computerName: Joi.string().required(),
            userName: Joi.string()
          })
        ),
        receivers: Joi.array()
          .items(
            Joi.object().keys({
              name: Joi.string(),
              email: Joi.string()
                .email()
                .required(),
              phoneNumber: Joi.string()
                .allow(null)
                .optional()
            })
          )
          .required()
      })
    )
  });
};

module.exports = validators;
