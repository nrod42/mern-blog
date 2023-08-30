const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    postTitle: String,
    postSummary: String,
    postContent: String,
    postImg: String,
    postComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    postAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    postLikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ 
  postTitle: "text", 
  postSummary: "text", 
  postContent: "text", 
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
