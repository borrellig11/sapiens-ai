const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // This makes the chatbot search Wikipedia for a quick answer 
        // instead of just saying that same boring sentence.
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(userMessage)}&format=json&origin=*`;
        const response = await axios.get(wikiUrl);
        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract;

        let reply = "";

        if (pageId === "-1" || !extract) {
            reply = `I couldn't find a direct academic record for "${userMessage}" in my database. Could you rephrase your question?`;
        } else {
            reply = extract.split('.')[0] + ". " + extract.split('.')[1] + "."; 
        }

        res.json({ reply: reply });

    } catch (err) {
        res.json({ reply: "I'm having trouble connecting to my knowledge base right now." });
    }
});

module.exports = router;
