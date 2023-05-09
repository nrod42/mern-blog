const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = "fbehjfbeafhbhebfe";

/* GET home page. */
router.get("/posts", async function (req, res) {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
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
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

router.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

router.post("/create", uploadMiddleware.single("postImg"), function (req, res) {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const fileExt = parts[parts.length - 1]; //in case there are multiple '.',the extension will be the last one
  const newImgPath = `${path}.${fileExt}`;
  fs.renameSync(path, newImgPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { postTitle, postSummary, postContent } = req.body;
    const postDoc = await Post.create({
      postTitle,
      postSummary,
      postContent,
      postImg: newImgPath,
      author: info.id,
    });
  });

  res.json(postDoc);
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

router.put("/post/", uploadMiddleware.single("postImg"), async (req, res) => {
  // const { id } = req.params;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const fileExt = parts[parts.length - 1]; //in case there are multiple '.',the extension will be the last one
    const newImgPath = `${path}.${fileExt}`;
    fs.renameSync(path, newImgPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, postTitle, postSummary, postContent } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not the author!");
    }
    await postDoc.update({ postTitle, postSummary, postContent });
  });
});
module.exports = router;
