import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit("login", "demoUser"); // replace with actual user
    socket.on("receive_message", data => {
      setChat(prev => [...prev, data]);
    });
    return () => socket.off();
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", { user: "demoUser", text: message });
    setMessage("");
  };

  return (
    <div>
      <h2>Real-Time Chat</h2>
      <div>
        {chat.map((msg, i) => (
          <div key={i}><b>{msg.user}:</b> {msg.text}</div>
        ))}
      </div>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
