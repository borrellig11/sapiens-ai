const express = require('express');
const router = express.Router();
const AISearch = require('../services/aiSearch');

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const sessionId = req.sessionID;
    const user = await req.db.getOrCreateUser(sessionId);
    const queryId = await req.db.saveQuery(user.id, query);

    const aiSearch = new AISearch();
    const searchResult = await aiSearch.search(query);

    const resultId = await req.db.saveResult(
      queryId,
      searchResult.response,
      JSON.stringify(searchResult.sources),
      searchResult.searchTime,
      searchResult.tokenCount
    );

    if (searchResult.sources && searchResult.sources.length > 0) {
      await req.db.saveSources(resultId, searchResult.sources);
    }

    const formattedResponse = formatResponse(
      searchResult.response,
      searchResult.sources,
      searchResult.searchTime,
      searchResult.tokenCount
    );

    res.json({
      success: true,
      queryId: queryId,
      resultId: resultId,
      response: searchResult.response,
      sources: searchResult.sources,
      searchTime: searchResult.searchTime,
      tokenCount: searchResult.tokenCount,
      formatted: formattedResponse
    });

  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

function formatResponse(response, sources, searchTime, tokenCount) {
  let formatted = response;

  if (sources && sources.length > 0) {
    formatted += `\n\n---\n\n## 📚 Sources & References\n\nFound ${sources.length} authoritative sources:\n\n`;

    sources.forEach((source, index) => {
      formatted += `**[${index + 1}] ${source.title}**\n`;
      formatted += `URL: ${source.url}\n`;
      if (source.snippet) {
        formatted += `Snippet: ${source.snippet.slice(0, 200)}...\n`;
      }
      if (source.source) {
        formatted += `Source Database: ${source.source}\n`;
      }
      formatted += `Relevance Score: ${(source.relevance_score * 100).toFixed(1)}%\n\n`;
    });
  }

  formatted += `---\n\n### Search Metadata\n`;
  formatted += `- **Search Time**: ${searchTime.toFixed(2)} seconds\n`;
  formatted += `- **Tokens Used**: ${tokenCount}\n`;
  formatted += `- **Sources Cited**: ${sources ? sources.length : 0}\n`;
  formatted += `- **Status**: ✅ Search Completed Successfully\n`;

  return formatted;
}

module.exports = router;
