const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
    {
      commentContent: String,
      commentAuthor: { type: Schema.Types.ObjectId, ref: "User" },
      post: { type: Schema.Types.ObjectId, ref: "Post" },
    },
    {
      timestamps: true,
    }
);

CommentSchema.index({ 
  commentContent: "text", 
});

const CommentModel = model("Comment", CommentSchema);

module.exports = CommentModel
