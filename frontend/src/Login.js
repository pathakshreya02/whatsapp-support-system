import React, { useState } from "react";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://whatsapp-support-system.onrender.com";

function Login({ setUser, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log(data); // ✅ see response

    if (res.ok) {
      alert("Login successful");
      setUser(data);
    } else {
      alert(data.error || "Login failed");
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

 return (
  <div className="login-container">
    <div className="login-box">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p onClick={() => setShowRegister(true)} style={{ cursor: "pointer", marginTop: "10px", color: "#00a884" }}>
        Don't have an account? Register
      </p>
    </div>
  </div>
);