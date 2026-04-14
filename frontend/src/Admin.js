import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const BASE_URL = "http://localhost:5000";

function Admin() {
  const [messages, setMessages] = useState([]);

  const getMessages = () => {
    fetch(`${BASE_URL}/api/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));
  };

  useEffect(() => {
    getMessages();
  }, []);

  // 📊 ANALYTICS
  const total = messages.length;
  const adminCount = messages.filter(m => m.sender === "admin").length;
  const userCount = messages.filter(m => m.sender === "user").length;

  const data = [
    { name: "Admin", value: adminCount },
    { name: "User", value: userCount }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Dashboard</h2>

      {/* STATS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div>📨 Total Messages: {total}</div>
        <div>🟢 Admin: {adminCount}</div>
        <div>🔵 User: {userCount}</div>
      </div>

      {/* CHART */}
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      {/* MESSAGE LIST */}
      <h3>All Messages</h3>

      {messages.map((msg) => (
        <div
          key={msg._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          <p><b>Message:</b> {msg.message}</p>
          <p><b>Sender:</b> {msg.sender}</p>

          <button onClick={async () => {
            await fetch(`${BASE_URL}/api/messages/${msg._id}`, {
              method: "DELETE"
            });
            getMessages();
          }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;