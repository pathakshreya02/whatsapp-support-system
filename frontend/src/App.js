import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import sendSound from "./send.mp3"; // 🔔 ADD THIS FILE

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
  const [isTyping, setIsTyping] = useState(false);

  const getMessages = () => {
    fetch(`${BASE_URL}/api/messages`)
      .then((res) => res.json())
      .then((data) => {
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

  if (!user) {
    return showRegister ? (
      <Register setShowLogin={() => setShowRegister(false)} />
    ) : (
      <Login setUser={setUser} setShowRegister={() => setShowRegister(true)} />
    );
  }

  // 🔔 SEND MESSAGE + SOUND
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

    // 🔔 PLAY SOUND
    const audio = new Audio(sendSound);
    audio.play();

    setText("");
    getMessages();
  };

  const deleteMessage = async (id) => {
    await fetch(`${BASE_URL}/api/messages/${id}`, {
      method: "DELETE"
    });
    getMessages();
  };

  const editMessage = async (id, oldText) => {
    const newText = prompt("Edit message:", oldText);
    if (!newText) return;

    try {
      await fetch(`${BASE_URL}/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: newText })
      });

      getMessages();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <div className="avatar">S</div>
          <div>
            <div className="name">Support</div>
            <div className="status">online</div>
          </div>
        </div>

        <button
          onClick={() => setUser(null)}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* CHAT */}
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.sender === "admin" ? "msg admin" : "msg user"}
          >
            <div>{msg.message}</div>

            <small>
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : ""}
            </small>

            <div style={{ position: "absolute", bottom: "-5px", right: "5px" }}>
              <button
                className="delete-btn"
                onClick={() => deleteMessage(msg._id)}
              >
                🗑️
              </button>

              <button
                onClick={() => editMessage(msg._id, msg.message)}
                style={{
                  marginLeft: "5px",
                  background: "white",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 5px rgba(0,0,0,0.3)"
                }}
              >
                📝
              </button>
            </div>
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      {/* ⏳ TYPING INDICATOR */}
      {isTyping && (
        <div style={{ color: "#00a884", fontSize: "12px", marginLeft: "10px" }}>
          typing...
        </div>
      )}

      {/* INPUT */}
      <div className="input-box">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setIsTyping(true);

            setTimeout(() => setIsTyping(false), 1000);
          }}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default App;