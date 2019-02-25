const express = require("express");

const router = express.Router();

/* GET home page. Using this route only for testing */
router.get("/", (req, res) => {
  return res.send("Welcome to GateKeeper");
});

// V1 api routes
router.use("/api/v1", require("./v1"));

module.exports = router;
