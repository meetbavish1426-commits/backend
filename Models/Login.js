const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  name: String,
  phone: String,
  service: String
});

module.exports = mongoose.model("Login", LoginSchema);