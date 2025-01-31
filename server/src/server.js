const express = require("express");
const dbconn = require("./config/config");
const bodyParser = require("body-parser");
const cors = require("cors");

const signupRouter = require("./routes/signupRoute");
const signinRoute = require("./routes/signinRoute");
const userRoutes = require("./routes/userRoute");
const friendRoutes = require("./routes/friendRoute");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ✅ API Routes
app.use("/", signupRouter);
app.use("/", signinRoute);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);
app.use("/friend-requests", friendRoutes);

// ✅ Default Route for Testing
app.get("/", (req, res) => {
  res.send("Server is running on Vercel!");
});

// ✅ Export app for Vercel
module.exports = app;
