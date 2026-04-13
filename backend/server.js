const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// 🔥 MongoDB Atlas Connection
mongoose.connect("mongodb+srv://admin:admin123@cluster0.bx1ps47.mongodb.net/whatsappDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// routes
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});