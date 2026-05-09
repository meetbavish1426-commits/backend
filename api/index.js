require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const contactRoutes = require("../routes/contact");
const signInRoutes = require("../routes/SignIn");
const loginRoutes = require("../routes/Login");
const adminRoutes = require("../routes/admin");

const User = require("../Models/User");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/signin", signInRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err));

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

// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
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
 

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});