const express = require("express");
const router = express.Router();
const Login = require("../Models/Login");

router.post("/", async (req, res) => {
  try {
    const data = new Login(req.body);
    await data.save();

    res.json({ success: true, message: "Request submitted" });
  } catch (error) {
    console.error("Login request save error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;