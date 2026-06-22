const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessionId = req.sessionID;
    const user = await req.db.getOrCreateUser(sessionId);
    const history = await req.db.getUserHistory(user.id, 50);

    res.json({
      success: true,
      count: history.length,
      history: history
    });
  } catch (error) {
    console.error('History route error:', error);
    res.status(500).json({ error: 'Failed to fetch history', message: error.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { queryId, resultId } = req.body;
    const sessionId = req.sessionID;
    const user = await req.db.getOrCreateUser(sessionId);

    const savedId = await req.db.saveResponse(user.id, queryId, resultId);

    res.json({
      success: true,
      savedId: savedId,
      message: 'Response saved successfully'
    });
  } catch (error) {
    console.error('Save response error:', error);
    res.status(500).json({ error: 'Failed to save response', message: error.message });
  }
});

router.get('/saved', async (req, res) => {
  try {
    const sessionId = req.sessionID;
    const user = await req.db.getOrCreateUser(sessionId);
    const saved = await req.db.getSavedResponses(user.id, 100);

    res.json({
      success: true,
      count: saved.length,
      saved: saved
    });
  } catch (error) {
    console.error('Get saved error:', error);
    res.status(500).json({ error: 'Failed to fetch saved responses', message: error.message });
  }
});

module.exports = router;
