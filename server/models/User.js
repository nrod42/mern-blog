const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  date: { type: Date },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
