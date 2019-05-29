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

validators.onDemandReportStatus = () => {
  return celebrate({
    body: Joi.object().keys({
      success: Joi.boolean().required(),
      receivers: Joi.array()
        .items(
          Joi.object().keys({
            name: Joi.string()
              .allow(null)
              .optional(),
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
  });
};

validators.zendeskHelpSearch = () => {
  return celebrate({
    query: {
      category: Joi.string()
        .valid("hub", "client")
        .allow(null)
        .allow("")
        .optional(),
      query: Joi.string()
        .allow("")
        .required()
    }
  });
};

module.exports = validators;
