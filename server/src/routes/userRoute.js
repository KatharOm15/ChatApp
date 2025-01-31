const express = require("express");
const router = express.Router();
const User = require("../models/signupSchema");

// ✅ Get All Users (excluding self)
router.get("/", async (req, res) => {
    
  try {
      const { exclude } = req.query;
      const loggedInUser = await User.findById(exclude);

      if (!loggedInUser) {
          return res.status(404).json({ message: "User not found" });
      }

      // Find users who are NOT the logged-in user and have NOT received a request from them
      const users = await User.find({
          _id: { $ne: exclude, $nin: loggedInUser.following } // Exclude users in following list (sent requests)
      }).select("-password");
      
      res.json(users);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


// ✅ Get Sent Friend Requests
router.get("/sent/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("following", "name _id");
        res.json(user.following);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get Accepted Friends
router.get("/accepted/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("following");
        res.json(user.following);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/getName/:id",async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
   
})

module.exports = router;