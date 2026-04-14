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

  // EDIT MESSAGE
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
      <h2>🟢 WhatsApp Support System</h2>

      <button onClick={() => setUser(null)}>Logout</button>

      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={msg.sender === "admin" ? "msg admin" : "msg user"}
          >
            <div>{msg.message}</div>

            {/* TIME (CLEAN FORMAT) */}
            <small>
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : ""}
            </small>

            {/* BUTTONS */}
            <div style={{ position: "absolute", bottom: "-5px", right: "5px" }}>
              {/* DELETE */}
              <button
                className="delete-btn"
                onClick={() => deleteMessage(msg._id)}
              >
                🗑️
              </button>

              {/* EDIT */}
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

      <div className="input-box">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default App;