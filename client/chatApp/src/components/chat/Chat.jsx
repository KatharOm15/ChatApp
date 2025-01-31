import React from "react";
import io from "socket.io-client";
import ChatApp from "../chatapp/ChatApp";
import Profile from "../profile/Profile";

const socket = io("http://localhost:5000");

function Chat() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-200">
      <div className="flex rounded-lg items-center w-4/5 h-[95vh] flex-col bg-slate-400 shadow-lg">
        <Profile />
        <ChatApp socket={socket} />
      </div>
    </div>
  );
}

export default Chat;
