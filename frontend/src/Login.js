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

      {/* ✅ REGISTER OPTION */}
      <p style={{ marginTop: "15px" }}>
        Don't have an account?
      </p>

      <button
        onClick={() => setShowRegister(true)}
        style={{
          padding: "8px",
          backgroundColor: "#25D366",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Register
      </button>
    </div>
  );
}

export default Login;