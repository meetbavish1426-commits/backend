const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Contact = require("../Models/Contact");
const Login = require("../Models/Login");

// GET: all registered users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: all contact messages
router.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error("Admin contacts fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: all login requests / signin data if stored in Login model
router.get("/logins", async (req, res) => {
  try {
    const logins = await Login.find().sort({ _id: -1 });
    res.json({ success: true, logins });
  } catch (error) {
    console.error("Admin logins fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: all admin data in one response
router.get("/all", async (req, res) => {
  try {
    const [users, contacts, logins] = await Promise.all([
      User.find().sort({ _id: -1 }),
      Contact.find().sort({ createdAt: -1 }),
      Login.find().sort({ _id: -1 })
    ]);

    res.json({ success: true, users, contacts, logins });
  } catch (error) {
    console.error("Admin all-data fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
