require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const contactRoutes = require("../routes/contact");
const signInRoutes = require("../routes/SignIn");
const loginRoutes = require("../routes/Login");
const adminRoutes = require("../routes/admin");

const User = require("../Models/User");

const app = express();

app.use(express.json());

 

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://home-automation-ui-ruddy.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.get("/api/test-db", (req, res) => {
  res.json({
    readyState: mongoose.connection.readyState,
    mongoConnected: mongoose.connection.readyState === 1,
    dbName: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  });
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/signin", signInRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);


console.log("MONGO URI EXISTS:", !!process.env.MONGO_URI);
console.log(
  "MONGO URI START:",
  process.env.MONGO_URI?.substring(0, 25)
);
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error");
    console.error("MESSAGE:", err.message);
    console.error("NAME:", err.name);
    console.error("STACK:", err.stack);
  });


// SIGNUP API
app.post("/signup", async (req, res) => {
  try {
    const { username, phone, email, password, bhk } = req.body;

    if (!username || !phone || !email || !password || !bhk) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = new User({
      username,
      phone,
      email,
      password,
      bhk,
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Signup Error:", error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

// LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.json({
      success: false,
      message: "Server error",
    });
  }
});

// IOT LIGHT DEMO API
let lightStatus = false;

app.post("/api/light/set", (req, res) => {
  const { status } = req.body;

  lightStatus = status;

  console.log("Light Status:", lightStatus ? "ON" : "OFF");

  res.json({
    success: true,
    status: lightStatus,
    message: lightStatus ? "Light ON" : "Light OFF",
  });
});

app.get("/api/light/status", (req, res) => {
  res.json({
    success: true,
    status: lightStatus,
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();

    res.json({
      success: true,
      message: "MongoDB Connected",
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
});

// POST CONTACT FORM
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.json({
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

    res.json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {

    console.log("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
});
 
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.log("USERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
    });
  }
});

module.exports = app;