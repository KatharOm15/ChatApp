const express = require("express");
const dbconn = require("./config/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");



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

// ✅ Routes
app.use("/", signupRouter);
app.use("/", signinRoute);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);
app.use("/friend-requests", friendRoutes);
// ✅ Start API Server on PORT 3000
app.listen(3000, () => {
  console.log("API Server running on port 3000");
});

// ✅ Separate Chat Server on PORT 5000
const chatApp = express();
const chatServer = http.createServer(chatApp);


const io = new Server(chatServer, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"],
  },
});

// ✅ Import Message Model
const Message = require("./models/messageSchema");

// ✅ Socket Handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();
      io.emit("receiveMessage", data); // Broadcast message
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Start Chat Server on PORT 5000
chatServer.listen(5000, () => {
  console.log("Chat Server running on port 5000");
});
