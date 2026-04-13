import React, { useEffect, useState } from "react";
import Login from "./Login";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const getMessages = () => {
    fetch("http://localhost:5000/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  useEffect(() => {
    if (token) {
      getMessages();
    }
  }, [token]);

  const sendMessage = async () => {
    await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: "9876543210",
        message: text,
        sender: "admin"
      })
    });

    setText("");
    getMessages();
  };

  // 🔐 If not logged in → show login page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // 💬 After login → show chat UI
  return (
    <div className="container">
      <h2>WhatsApp Support</h2>

      <button onClick={() => setToken(null)}>Logout</button>

      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.sender === "admin" ? "msg admin" : "msg user"}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;