const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
  const uid = await req.db.getOrCreateUser(req.sessionID);
  const rows = await req.db.getHistory(uid);
  res.json(rows);
});
module.exports = router;
