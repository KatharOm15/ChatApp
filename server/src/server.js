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

// ✅ Initialize Express App
const app = express();
const server = http.createServer(app); // Use HTTP server

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
app.use("/api", signupRouter);
app.use("/api", signinRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friend-requests", friendRoutes);

// ✅ WebSocket Server (Merged on Same Port)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Server is running!");
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

// ✅ Start the Server (Single Port)
const PORT =3000; // Use Render-assigned port
server.listen(PORT, () => {
  console.log(`Server running on port  ${PORT} 👍`);
});
