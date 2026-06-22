const express = require('express');
const router = express.Router();
const ai = require('../services/aiSearch');

router.post('/', async (req, res) => {
    try {
        const query = req.body.query;
        if (!query) return res.status(400).json({ error: "No query provided" });

        const data = await ai.getDetailedPage(query);
        
        // Database is optional - if it fails, we still show the result
        try {
            const uid = await req.db.getOrCreateUser(req.sessionID);
            req.db.saveHistory(uid, query, data.title);
        } catch (dbErr) {
            console.log("Database save skipped:", dbErr.message);
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
