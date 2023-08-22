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

// Get home page
router.get("/posts", async function (req, res) {
  // Fetch posts with author's username, sort by createdAt, and limit to 20
  res.json(
    await Post.find()
      .populate("postAuthor", ["username"])
      .sort({ createdAt: -1 })

  );
});

// Get logged-in users following list
router.get("/posts/:loggedInUserId/following", async (req, res) => {
  try {
    const {loggedInUserId} = req.params;
    if (!loggedInUserId) {
      return
    }
    const loggedInUser = await User.findById(loggedInUserId).select("follows");
    const posts = await Post.find({ postAuthor: { $in: loggedInUser.follows } })
      .populate("postAuthor", ["username"])
      .sort({ createdAt: -1 })
    res.json(posts);
  } catch (error) {
    console.error("Error fetching following posts:", error);
    res.status(500).json({ error: "An error occurred while fetching following posts." });
  }
});

// Register a new user
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

// User login
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

// Get user profile
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

// Get user information
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const userInfo = await User.findById(id).populate({
    path: "posts",
    options: { sort: { createdAt: -1 } },
  });
  res.json(userInfo);
});

// Update user information
router.put(
  "/user/:id",
  uploadMiddleware.single("profilePic"),
  async (req, res) => {
    const { id } = req.params;
    let newImgPath = null;
    if (req.file) {
      // Rename and update profile picture if provided
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const fileExt = parts[parts.length - 1];
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

// Follow a user
router.post('/user/:userId/follow', async (req, res) => {
  try {
    const { userId } = req.params;
    const { loggedInUserId } = req.body; // You can pass the logged-in user's ID in the request body

    const user = await User.findById(userId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!user || !loggedInUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the logged-in user is already following the target user
    if (loggedInUser.follows.includes(userId)) {
      return res.status(400).json({ error: "User is already following." });
    }

    // Update the logged-in user's follows array using updateOne
    await User.updateOne(
      { _id: loggedInUserId },
      { $push: { follows: userId } }
    );

    res.json({ message: "User followed successfully." });
  } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ error: "An error occurred while following the user." });
  }
});

// Unfollow a user
router.delete('/user/:userId/unfollow', async (req, res) => {
  try {
    const { userId } = req.params;
    const { loggedInUserId } = req.body; // You can pass the logged-in user's ID in the request body

    const user = await User.findById(userId);
    const loggedInUser = await User.findById(loggedInUserId);

    if (!user || !loggedInUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the logged-in user is following the target user
    if (!loggedInUser.follows.includes(userId)) {
      return res.status(400).json({ error: "User is not following." });
    }

    // Update the logged-in user's follows array using updateOne
    await User.updateOne(
      { _id: loggedInUserId },
      { $pull: { follows: userId } }
    );

    res.json({ message: "User unfollowed successfully." });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "An error occurred while unfollowing the user." });
  }
});

// Create a new post
router.post("/create", uploadMiddleware.single("postImg"), function (req, res) {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const fileExt = parts[parts.length - 1];
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

// Get a specific post
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

// Create a comment
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

// Update a comment
router.put("/post/:postId/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentContent } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { commentContent },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.json({ message: "Comment updated successfully.", comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "An error occurred while updating the comment." });
  }
});

// Delete a comment
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

// Update a post
router.put(
  "/post/:id",
  uploadMiddleware.single("postImg"),
  async (req, res) => {
    const { id } = req.params;
    let newImgPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const fileExt = parts[parts.length - 1];
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

// Delete a post
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

router.post('/post/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { loggedInUserId } = req.body;

    const loggedInUser = await User.findById(loggedInUserId);
    
    if (loggedInUser.likes.includes(postId)) {
      return res.status(400).json({error: "Post already liked"})
    }

    await User.updateOne(
      {_id: loggedInUser },
      { $push: { likes: postId } }
    );

    res.json({ message: "Post liked successfully." });
  } catch(error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "An error occurred while liking the post." });
  }
});

router.delete('/post/:postId/unlike', async (req, res) => {
  try {
    const { postId } = req.params;
    const { loggedInUserId } = req.body;

    const loggedInUser = await User.findById(loggedInUserId);
    
    if (!loggedInUser.likes.includes(postId)) {
      return res.status(400).json({error: "Post already liked"})
    }

    await User.updateOne(
      {_id: loggedInUser },
      { $pull: { likes: postId } }
    );

    res.json({ message: "Post unliked successfully." });
  } catch(error) {
    console.error("Error unlike post:", error);
    res.status(500).json({ error: "An error occurred while unliking the post." });
  }
});

// Search posts by query
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
