const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
  email: String,
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  about: String,
  profilePic: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  follows: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ 
  username: "text", 
  firstName: "text", 
  lastName: "text", 
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
