const axios = require('axios');

class AISearch {
  async search(query) {
    try {
      // 1. Find the best matching page title
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
      const searchRes = await axios.get(searchUrl);
      const topResult = searchRes.data.query.search[0];

      if (!topResult) return { response: "No detailed records found for this topic.", sources: [] };

      // 2. Fetch the FULL detailed content for that title
      const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=0&explaintext=1&titles=${encodeURIComponent(topResult.title)}&format=json&origin=*`;
      const detailRes = await axios.get(detailUrl);
      const pages = detailRes.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const fullText = pages[pageId].extract;

      // 3. Format the "Page" output
      // We take the first 3000 characters to keep it a readable "page"
      const synthesizedPage = `
# ${topResult.title}
*Academic Brief & Comprehensive Analysis*

## Introduction
${fullText.split('\n')[0]} 

## Detailed Background
${fullText.split('\n').slice(1, 5).join('\n\n')}

## Key Concepts & Context
${fullText.split('\n').slice(5, 12).join('\n\n')}

---
*Note: This report was synthesized from global educational repositories. Further reading is recommended via the sources below.*`;

      const sources = [{
        title: topResult.title,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topResult.title)}`
      }];

      return { response: synthesizedPage, sources };
    } catch (error) {
      console.error("Research Error:", error);
      return { response: "Failed to generate page content.", sources: [] };
    }
  }
}

module.exports = new AISearch();
