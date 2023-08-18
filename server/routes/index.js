const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
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
      .populate("postAuthor", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

router.post("/register", async function (req, res) {
  const { email, username, password, firstName, lastName } = req.body;

  try {
    const userDoc = await User.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
      firstName,
      lastName,
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
  const expiresIn = '1d';

  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, { expiresIn }, (err, token) => {
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
    if (err) {
      // If token is expired or invalid, clear the cookie
      res.clearCookie("token");
      return res.status(401).json("Unauthorized");
    }
    res.json(info);
  });
});

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const userInfo = await User.findById(id).populate({
    path: "posts",
    options: { sort: { createdAt: -1 } },
  });
  res.json(userInfo);
});

router.put(
  "/user/:id",
  uploadMiddleware.single("profilePic"), 
  async (req, res) => {
    const { id } = req.params;
    let newImgPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const fileExt = parts[parts.length - 1]; //in case there are multiple '.',the extension will be the last one
      newImgPath = `${path}.${fileExt}`;
      fs.renameSync(path, newImgPath);
    }

    
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { firstName, lastName, email, about } = req.body;
      const userInfo = await User.findById(id);
      const isUser = JSON.stringify(userInfo.id) === JSON.stringify(info.id);
      if (!isUser) {
        return res.status(400).json("You are NOT the user");
      }
      await User.updateOne(
        { _id: id },
        {
          firstName,
          lastName,
          email,
          about,
          profilePic: newImgPath ? newImgPath : userInfo.profilePic,
        }
      );

      res.json(userInfo);
    });
  }
);

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
      postAuthor: info.id,
    });

    // Update the user's posts array
    await User.updateOne({ _id: info.id }, { $push: { posts: postDoc._id } });

    res.json(postDoc);
  });
});

router.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id)
      .populate("postAuthor", ["username"])
      .populate({
        path: "postComments",
        populate: { path: "commentAuthor", select: "username" },
      });

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found." });
    }
  res.json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "An error occurred while fetching the post." });
  }
});

router.post("/post/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentContent, userInfo } = req.body;

    // Create a new comment
    const comment = await Comment.create({
      commentContent: commentContent,
      commentAuthor: userInfo.id,
      post: postId,
    });

    const updateResult = await Post.updateOne(
      { _id: postId },
      { $push: { postComments: comment._id } }
    );
    
    if (updateResult.nModified === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json(updateResult);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "An error occurred while adding the comment." });
  }
});

router.delete("/post/:postId/comments/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    await Post.findByIdAndUpdate(
      postId,
      { $pull: { postComments: commentId } }
    );

    res.json({ message: "Comment deleted successfully.", post });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "An error occurred while deleting the comment." });
  }
});

router.put(
  "/post/:id",
  uploadMiddleware.single("postImg"),
  async (req, res) => {
    const { id } = req.params;
    let newImgPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const fileExt = parts[parts.length - 1]; //in case there are multiple '.',the extension will be the last one
      newImgPath = `${path}.${fileExt}`;
      fs.renameSync(path, newImgPath);
    }
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { postTitle, postSummary, postContent } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.postAuthor) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("You are not the author!");
      }
      await Post.updateOne(
        { _id: id },
        {
          postTitle,
          postSummary,
          postContent,
          postImg: newImgPath ? newImgPath : postDoc.postImg,
        }
      );
      res.json(postDoc);
    });
  }
);

router.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id);

  // Get rid of post image from uploads folder
  fs.unlink(postDoc.postImg, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
  await postDoc.deleteOne({ _id: id });
  res.sendStatus(204);
});

router.get("/results/:query", async (req, res) => {
  const { query } = req.params;
  const results = await Post.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .populate("postAuthor", ["username"])
    .sort({ score: { $meta: "textScore" } });
  res.json(results);
});

module.exports = router;
