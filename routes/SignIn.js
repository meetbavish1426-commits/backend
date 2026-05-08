// const express = require("express");
// const router = express.Router();
// const User = require("../Models/User");

// router.post("/SignIn  ", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email, password });

//   if (user) {
//     res.json({ success: true, message: "SignIn successful" });
//   } else {
//     res.json({ success: false, message: "Invalid email or password" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../Models/User");

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({
        success: true,
        message: "SignIn successful",
        user: user
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password"
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;