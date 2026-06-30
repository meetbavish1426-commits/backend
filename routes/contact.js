const express = require("express");
const router = express.Router();

const Contact = require("../Models/Contact");

// POST: Save Contact Message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    console.log("📩 New Contact Saved:", newContact);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      contact: newContact,
    });
  } catch (error) {
    console.error("❌ CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error: String(error),
    });
  }
});

// GET: All Contact Messages
router.get("/", async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ GET CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error: String(error),
    });
  }
});

// DELETE Contact Message
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error: String(error),
    });
  }
});

module.exports = router;