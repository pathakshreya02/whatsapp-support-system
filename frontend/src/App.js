import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://whatsapp-support-system.onrender.com";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // GET MESSAGES
  const getMessages = () => {
    fetch(`${BASE_URL}/api/messages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        else setMessages([]);
      });
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // LOGIN / REGISTER
  if (!user) {
    return showRegister ? (
      <Register setShowLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        setUser={setUser}
        setShowRegister={() => setShowRegister(true)}
      />
    );
  }

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!text) return;

    await fetch(`${BASE_URL}/api/messages`, {
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

  // DELETE MESSAGE
const deleteMessage = async (id) => {
  await fetch(`${BASE_URL}/api/messages/${id}`, {
    method: "DELETE"
  });
  getMessages();
};
  return (
    <div className="container">
      <h2>WhatsApp Support System</h2>

      <button onClick={() => setUser(null)}>Logout</button>

      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.sender === "admin" ? "msg admin" : "msg user"}
          >
            <div>{msg.message}</div>

            <small>
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString()
                : ""}
            </small>

            {/* DELETE BUTTON */}
       <button className="delete-btn" onClick={() => deleteMessage(msg._id)}>
  🗑️
</button>
          </div>
        ))}
        <div ref={chatEndRef}></div>
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