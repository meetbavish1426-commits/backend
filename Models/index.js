 const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const contactRoutes = require("../routes/contact");
const signInRoutes = require("../routes/SignIn");
const loginRoutes = require("../routes/Login");
const adminRoutes = require("../routes/admin");
 
const app = express();

app.use(express.json());
app.use(cors());

const User = require("../Models/User");
 

app.use("/api/contact", contactRoutes);
app.use("/api/signin", signInRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect("mongodb://meetbavish1426_db_user:Meet1426@ac-97ebjn6-shard-00-00.mw6jx2z.mongodb.net:27017,ac-97ebjn6-shard-00-01.mw6jx2z.mongodb.net:27017,ac-97ebjn6-shard-00-02.mw6jx2z.mongodb.net:27017/home-automation?ssl=true&replicaSet=atlas-1fq203-shard-0&authSource=admin&appName=Cluster0")
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err));
 


// SIGNUP API
app.post("/signup", async (req,res)=>{

try{

const {username,phone,email,password,bhk} = req.body;

// Check if all fields filled
if(!username || !phone || !email || !password || !bhk){
  return res.json({
    success:false,
    message:"All fields are required"
  });
}

// Check existing email
const existingUser = await User.findOne({email});

if(existingUser){
  return res.json({
    success:false,
    message:"Email already registered"
  });
}

// Create new user
const user = new User({
username,
phone,
email,
password,
bhk
});

await user.save();

res.json({
success:true,
message:"User registered successfully"
});

}

catch(error){

console.log("Signup Error:",error);

res.json({
success:false,
message:"Server error"
});

}

});

/// LOGIN API
app.post("/login", async (req, res) => {
  try {

    const { phoneOrEmail, password } = req.body;

    console.log("Login data:", phoneOrEmail, password);

    const user = await User.findOne({
      $or: [
        { phone: phoneOrEmail },
        { email: phoneOrEmail }
      ]
    });

    // ✅ USER NOT FOUND CHECK
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ PASSWORD CHECK
    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Invalid password"
      });
    }

    // ✅ LOGIN SUCCESS
    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.json({
      success: false,
      message: "Server error"
    });

  }
});

// iot light demo api
let lightStatus = false;

// Toggle Light
// app.post("/api/light/toggle", (req, res) => {
//   lightStatus = !lightStatus;

//   console.log("Light Status:", lightStatus ? "ON" : "OFF");

//   res.json({
//     success: true,
//     status: lightStatus,
//     message: lightStatus ? "Light ON" : "Light OFF",
//   });
// });
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

// Get Light Status (ESP32 use)
app.get("/api/light/status", (req, res) => {
  res.json({
    success: true,
    status: lightStatus,
  });
});

// GET ALL USERS (Admin)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // your user model
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});
// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

 

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});