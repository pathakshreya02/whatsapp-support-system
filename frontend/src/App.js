import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Admin from "./Admin";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://whatsapp-support-system.onrender.com";

// 🤖 SMART BOT
const getBotReply = (msg) => {
  msg = msg.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello 😊 How can I assist you today?";
  }
  if (msg.includes("price") || msg.includes("cost")) {
    return "Our pricing depends on your requirements. Please contact support 📞";
  }
  if (msg.includes("help") || msg.includes("issue")) {
    return "I'm here to help! Please describe your issue in detail.";
  }
  if (msg.includes("course")) {
    return "We offer multiple courses. Which one are you interested in?";
  }
  if (msg.includes("thank")) {
    return "You're welcome! 😊";
  }
  if (msg.includes("bye")) {
    return "Goodbye! Have a great day 👋";
  }

  return "Sorry, I didn't understand that. Can you rephrase?";
};

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // GET MESSAGES
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

  // ✅ ADMIN ROUTE (CORRECT PLACE)
  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

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

  // SEND MESSAGE + BOT + SOUND
  const sendMessage = async () => {
    if (!text) return;

    const userMessage = text;

    await fetch(`${BASE_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: "9876543210",
        message: userMessage,
        sender: "admin"
      })
    });

    // 🔔 SOUND
    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
    audio.play().catch(() => {});

    setText("");
    getMessages();

    // 🤖 BOT REPLY
    setTimeout(async () => {
      const reply = getBotReply(userMessage);

      await fetch(`${BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: "9876543210",
          message: reply,
          sender: "user"
        })
      });

      getMessages();
    }, 1000);
  };

  // DELETE
  const deleteMessage = async (id) => {
    await fetch(`${BASE_URL}/api/messages/${id}`, {
      method: "DELETE"
    });
    getMessages();
  };

  // EDIT
  const editMessage = async (id, oldText) => {
    const newText = prompt("Edit message:", oldText);
    if (!newText) return;

    await fetch(`${BASE_URL}/api/messages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: newText })
    });

    getMessages();
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

        {/* ADMIN BUTTON */}
        <button
          onClick={() => (window.location.href = "/admin")}
          style={{
            marginLeft: "10px",
            background: "#00a884",
            border: "none",
            color: "white",
            padding: "5px 10px",
            cursor: "pointer"
          }}
        >
          Admin
        </button>

        {/* LOGOUT */}
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
                  cursor: "pointer"
                }}
              >
                📝
              </button>
            </div>
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>

      {/* TYPING */}
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