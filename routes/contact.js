 const express = require("express");
const router = express.Router();

const Contact = require("../Models/Contact");

// POST: Save Contact Message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // validation
    if (!name || !email || !subject || !message) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    console.log("📩 New Contact:", newContact);

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.log("Contact Error:", error);

    res.json({
      success: false,
      message: "Server error"
    });
  }
});

// GET: All messages (admin use)
router.get("/", async (req, res) => {
  const data = await Contact.find().sort({ createdAt: -1 });
  res.json(data);
});
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.log("Delete Error:", error);

    res.json({
      success: false,
      message: "Delete failed"
    });
  }
});

module.exports = router;