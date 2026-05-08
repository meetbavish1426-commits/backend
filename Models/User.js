const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  phone: String,
  email: String,
  password: String,
  bhk: String,
});

module.exports = mongoose.model("User", UserSchema);