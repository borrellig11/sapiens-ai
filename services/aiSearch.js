const axios = require('axios');

class AISearch {
  async getDetailedPage(query) {
    try {
      // 1. Search for the topic
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
      const searchRes = await axios.get(searchUrl);
      
      if (!searchRes.data.query || searchRes.data.query.search.length === 0) {
        return { title: "No results", intro: "We couldn't find an academic match for this topic.", background: "", concepts: "", url: "#" };
      }

      const top = searchRes.data.query.search[0];

      // 2. Get the full text
      const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(top.title)}&format=json&origin=*`;
      const detailRes = await axios.get(detailUrl);
      const pages = detailRes.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract || "No detailed summary available.";

      // 3. Split text safely into sections
      const paragraphs = extract.split('\n').filter(p => p.trim().length > 0);

      return {
        title: top.title,
        intro: paragraphs[0] || "No introduction available.",
        background: paragraphs.slice(1, 4).join('\n\n') || "No background data found.",
        concepts: paragraphs.slice(4, 10).join('\n\n') || "No further analysis available.",
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(top.title)}`
      };
    } catch (e) {
      console.error("Wikipedia API Error:", e);
      return { title: "Error", intro: "Failed to connect to academic databases.", background: "", concepts: "", url: "#" };
    }
  }
}

module.exports = new AISearch();
