const express = require('express');
const router = express.Router();

// This stores a simple memory in the server (resets when server restarts)
// In a professional app, you'd save this to your SQLite database
let chatHistory = [];

router.post('/', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // 1. Add user message to history
    chatHistory.push({ role: "user", content: message });

    try {
        // NOTE: To make this "Real," you would connect to OpenAI/Anthropic here.
        // For now, we will create a "Simulated AI" response that uses the history.
        const aiReply = `I've noted your question about "${message}." As your Sapiens Assistant, I can help you synthesize the research we found in the other tab. What specific part of this should we dive deeper into?`;

        // 2. Add AI response to history
        chatHistory.push({ role: "assistant", content: aiReply });

        // Only keep last 10 messages for memory
        if (chatHistory.length > 10) chatHistory.shift();

        res.json({ reply: aiReply, history: chatHistory });
    } catch (err) {
        res.status(500).json({ error: "Chat failed" });
    }
});

module.exports = router;
