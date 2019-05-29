const express = require("express");

const router = express.Router();

const logger = require("winston");
const zendeskControllers = require("../../controllers/v1/zendesk/zendeskControllers");
const validators = require("./validators");

// GET /api/v1/zendesk/help?category=hub&query=how%20to%20add%20users

router.get("/help", validators.zendeskHelpSearch(), async (req, res) => {
  try {
    const results = await zendeskControllers.searchZendesk(req.query);

    return res.status(200).send({
      type: "SUCCESS",
      data: results
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).send({
      type: "ERROR",
      message: error.message
    });
  }
});

module.exports = router;
