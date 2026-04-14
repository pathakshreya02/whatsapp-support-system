const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// ✅ MongoDB
mongoose.connect("mongodb+srv://admin:admin123@cluster0.bx1ps47.mongodb.net/whatsappDB?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});