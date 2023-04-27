const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret  = bcrypt.genSaltSync(10);

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
      password: bcrypt.hashSync(password, salt),
      date: new Date().toLocaleString("en-US"),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async function (req, res) {
  const { username, password } = req.body;
  const userDoc = await User.findOne({username})
  const passOk = bcrypt.compareSync(password, userDoc.password);
  // res.json(userDoc);
  res.json(passOk);
  // if (passOk) {
  //   //logged in

  //   jwt.sign({username, id: userDoc._id}, secret )
  // } else {
  //   res.status(400).json('wrong credentials')
  // }
});

module.exports = router;
