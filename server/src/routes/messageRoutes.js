const express = require("express");
const router = express.Router();
const Message = require("../models/messageSchema");


router.get("/getMessages", async (req, res) => {
  try {
    const { userId, receiverId } = req.query;

    if (!userId || !receiverId) {
      return res.status(400).json({ error: "Both userId and receiverId are required" });
    }

    // Fetch messages between the two users, sorted by timestamp
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ]
    }).sort({ timestamp: 1 }); // Sort by timestamp (ascending order)

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Send a new message
router.post("/sendMessage", async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: "All fields (sender, receiver, message) are required" });
    }

    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
