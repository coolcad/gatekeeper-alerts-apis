const express = require("express");

const router = express.Router();

const logger = require("winston");
const reportControllers = require("../../controllers/v1/notifications/reportControllers");
const validators = require("./validators");

// POST /api/v1/notifications/on-demand-report-status

router.post("/on-demand-report-status", validators.onDemandReportStatus(), async (req, res) => {
  try {
    const report = req.body;
    await reportControllers.sendOnDemandReportStatusEmail(report);

    return res.status(200).send({
      type: "SUCCESS",
      message: "Successfully sent report status notification"
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
