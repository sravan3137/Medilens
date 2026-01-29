import React, { useEffect, useState,useContext } from "react";
import { io } from "socket.io-client";
import {useNavigate,useParams} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext.jsx';
import socket from './Socket.jsx';

export default function Chat() {
  const {targetId,roomId}= useParams();
  const {user} = useContext(AuthContext);
  const userId = user?.username;
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [hasUnread,setHasUnread] =useState(true);

  useEffect(() => {
    if (!user || !user.username || !roomId || !socket.connected) {
      
      return;
    }
    console.log("usefffect runs");
    // Load previous messages
    // console.log("RI: "+roomId+"SI: "+socket.id);
    socket.emit("get-previous-messages", { roomId, userId: user.username });
    socket.on("previous-messages", (msgs) => {
      // console.log("SI: "+socket.id);
      console.log("on previos messages runs");
      setChat(msgs);
      // console.log("msgs: ",msgs);
    });

    // Listen for new messages
    socket.on("receive-message", (msg) => {
      console.log("on receive-messages runs");
      setChat((prev) => [...prev, msg]);
    });

    socket.on("messages-read", ({ roomId:roommId, userId }) => {
      console.log("on messages-read runs");
        if (roommId === roomId && userId === user.username) {
          setHasUnread(false);
          console.log("on messafes-read if runs");
        }
      });

    return () => {
      socket.emit("user-offline",{userId:user.username});
      console.log("sockets in Chat.jsx off, due to unmount");
      socket.off("previous-messages");
      socket.off("receive-message");
      // socket.off("connect");
    };
  }, [roomId,user]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send-message", {
        roomId,
        sender: userId,
        receiver: targetId,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div style={{ width: 400, margin: "auto" }}>
      <h4>Chat between {userId} & {targetId}</h4>
      <div
        style={{
          border: "1px solid gray",
          height: "250px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {Array.isArray(chat) && chat.map((msg, i) => {
            const text = typeof msg === "string" ? msg : msg.message;
            const sender = typeof msg === "string" ? "System" : msg.sender;
            return (
                <p key={i} style={{ color: sender === userId ? "blue" : "black" }}>
                <b>{sender}: </b>{text}
                </p>
            );
        })}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type message..."
        style={{ width: "75%", marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
