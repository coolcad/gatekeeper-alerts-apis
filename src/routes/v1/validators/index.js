const { celebrate, Joi } = require("celebrate");

const validators = {};

validators.alert = () => {
  return celebrate({
    body: Joi.array().items(
      Joi.object().keys({
        alertName: Joi.string().required(),
        alertDescription: Joi.string()
          .optional()
          .allow("")
          .allow(null),
        isSystemAlert: Joi.boolean().required(),
        deliveryMethods: Joi.array()
          .items(Joi.string().valid("sms", "email"))
          .required(),
        alertLogs: Joi.array().items(
          Joi.object().keys({
            alertDateTime: Joi.date()
              .iso()
              .required(),
            alertMessage: Joi.string()
              .optional()
              .when("isSystemAlert", {
                is: true,
                then: Joi.string().required()
              })
              .allow(null)
              .allow("")
              .default("N/A"),
            eventType: Joi.string().required(),
            computerName: Joi.string()
              .required()
              .allow(null),
            userName: Joi.string().allow(null)
          })
        ),
        receivers: Joi.array()
          .items(
            Joi.object().keys({
              name: Joi.string().allow(null),
              email: Joi.string()
                .email()
                .required(),
              phoneNumber: Joi.string()
                .allow(null)
                .allow("")
                .optional()
            })
          )
          .required()
      })
    )
  });
};

module.exports = validators;
