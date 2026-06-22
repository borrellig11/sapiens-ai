const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
  const reply = `Regarding "${req.body.message}": In an academic context, we should look at the primary evidence and how it relates to the synthesis we just generated in the research tab.`;
  res.json({ reply });
});
module.exports = router;
