const express = require("express");
const router = express.Router();
const User = require("../models/signupSchema");

// ✅ Send Friend Request
router.post("/send", async (req, res) => {
    try {
        const { from, to } = req.body;
        const sender = await User.findById(from);
        const receiver = await User.findById(to);

        if (!sender || !receiver) return res.status(404).json({ message: "User not found" });

        // Prevent duplicate requests
        if (receiver.pendingRequests.includes(from)) {
            return res.status(400).json({ message: "Request already sent!" });
        }

        receiver.pendingRequests.push(from);
        await receiver.save();
        res.json({ message: "Friend request sent!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ✅ Accept Friend Request
router.post("/accept", async (req, res) => {
    try {
        const { from, to } = req.body;
        const sender = await User.findById(from);
        const receiver = await User.findById(to);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Convert ObjectId to String before comparison
        const hasPendingRequest = receiver.pendingRequests.some(
            (id) => id.toString() === from
        );

        if (!hasPendingRequest) {
            return res.status(400).json({ message: "No pending request found!" });
        }

        // ✅ Prevent duplicate followers
        if (!sender.followers.includes(to)) {
            sender.followers.push(to);
        }
        if (!receiver.followers.includes(from)) {
            receiver.followers.push(from);
        }

        // ✅ Ensure `following` is updated correctly
        if (!sender.following.includes(to)) {
            sender.following.push(to);
        }
        if (!receiver.following.includes(from)) {
            receiver.following.push(from);
        }

        // ✅ Remove `from` from `pendingRequests`
        receiver.pendingRequests = receiver.pendingRequests.filter(
            (id) => id.toString() !== from
        );

        await sender.save();
        await receiver.save();

        res.json({ message: "Friend request accepted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// ✅ Reject Friend Request
router.post("/reject", async (req, res) => {
    try {
        const { from, to } = req.body;
        const receiver = await User.findById(to);

        if (!receiver) return res.status(404).json({ message: "User not found" });

        receiver.pendingRequests = receiver.pendingRequests.filter(id => id.toString() !== from);

        await receiver.save();
        res.json({ message: "Friend request rejected!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get Pending Friend Requests
router.get("/pending/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("pendingRequests", "name _id");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.pendingRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Cancel Friend Request
router.delete("/cancel", async (req, res) => {
    try {
        const { from, to } = req.body;
        const receiver = await User.findById(to);

        if (!receiver) return res.status(404).json({ message: "User not found" });

        // ✅ Remove request from pendingRequests
        receiver.pendingRequests = receiver.pendingRequests.filter(id => id.toString() !== from);

        await receiver.save();
        res.json({ message: "Friend request canceled!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
