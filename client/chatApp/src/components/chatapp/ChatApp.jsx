import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";
import axios from "axios";
import { useLocation } from "react-router-dom";


const socket = io("http://localhost:3000");

function ChatApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Get Receiver ID from URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const receiverId = params.get("receiverId");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
  // Add a check to avoid duplication when receiving a message via socket
  socket.on("receiveMessage", (data) => {
    // Check if the message is already in the state before adding
    if (!messages.some(msg => msg._id === data._id)) {
      setMessages((prev) => [...prev, data]);
    }
  });

  return () => {
    socket.off("receiveMessage");
  };
}, [messages]);

  // ✅ Fetch Messages from API Server (Port 3000)
  useEffect(() => {
    if (!userId || !receiverId) return; // Ensure both user IDs exist

    axios
      .get(`http://localhost:3000/api/messages/getMessages?userId=${userId}&receiverId=${receiverId}`)
      .then((response) => {
        // Handle the case when response.data is null or undefined
        if (response.data) {
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      })
      .catch((error) => console.error("Error fetching messages:", error));

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]); // ✅ Fetch when userId or receiverId changes

  // ✅ Send Message via API Server (Port 3000)
  const sendMessage = async () => {
    if (!receiverId) {
      alert("No receiver selected!");
      return;
    }
    if (message.trim() !== "") {
      const newMessage = { sender: userId, receiver: receiverId, message };
      try {
        await axios.post("http://localhost:3000/api/messages/sendMessage", newMessage);
        socket.emit("sendMessage", newMessage); // Emit to WebSocket
        setMessages((prev) => [...prev, newMessage]); // ✅ Optimistic UI update
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="w-11/12 h-[550px] rounded-lg m-4 flex flex-col items-center justify-center">
      <div className="w-[90%] h-[90%] bg-slate-50 m-4 rounded-lg p-4 flex flex-col overflow-y-auto">
        {/* Safely map over messages array */}
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`w-max max-w-[75%] ${
                msg.sender === userId ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
              } font-semibold rounded-md px-3 py-2 m-2`}
            >
              {msg.message}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet.</div>
        )}
      </div>

      <div className="w-[90%] h-[90px] bg-slate-600 rounded-lg flex items-center p-2">
        <input
          type="text"
          className="w-full h-[70%] outline-none rounded-lg px-3"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="w-[10%] h-[70%] bg-blue-500 rounded-lg hover:bg-blue-800" onClick={sendMessage}>
          <SendIcon style={{ color: "white" }} />
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
