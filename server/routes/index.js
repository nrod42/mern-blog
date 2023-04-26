const express = require("express");
const router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res) {
  res.json("test ok");
});

router.post("/register", async function (req, res) {
  const { email, username, password } = req.body;

  try {
    const userDoc = await User.create({
      email,
      username,
      password,
      date: new Date().toLocaleString("en-US"),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", function (req, res) {
  res.json("login");
});

module.exports = router;
