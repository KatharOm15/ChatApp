const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId,
          ref: "Signup",
           required: true 
          },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId,
            ref: "Signup",
    required: true 
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);

