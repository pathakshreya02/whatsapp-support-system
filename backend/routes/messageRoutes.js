const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// CREATE MESSAGE
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    res.json({ message: "Message saved successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL MESSAGES
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE MESSAGE
router.put("/:id", async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Message updated successfully",
      data: updatedMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE MESSAGE
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;