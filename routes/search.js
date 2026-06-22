const express = require('express');
const router = express.Router();
const ai = require('../services/aiSearch');
router.post('/', async (req, res) => {
  const data = await ai.getDetailedPage(req.body.query);
  const uid = await req.db.getOrCreateUser(req.sessionID);
  req.db.saveHistory(uid, req.body.query, data.title);
  res.json(data);
});
module.exports = router;
