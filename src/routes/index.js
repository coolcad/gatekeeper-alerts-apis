const express = require("express");
const router = express.Router();
const ExpressBrute = require("express-brute");

const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);

/* GET home page. */
router.get("/", bruteforce.prevent, function(req, res, next) {
  res.send("Welcome to GateKeeper");
});

module.exports = router;
