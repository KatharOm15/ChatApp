const mongoose = require('mongoose');

const signupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Signup",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Signup",
    }],
    pendingRequests: [{
         type: mongoose.Schema.Types.ObjectId,
          ref: "Signup" 
    }]
});

module.exports = mongoose.model("Signup", signupSchema);
