const axios = require('axios');
class AISearch {
  async getDetailedPage(query) {
    try {
      const sUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`;
      const sRes = await axios.get(sUrl);
      const top = sRes.data.query.search[0];
      if (!top) return { title: "No results", body: "Could not find data." };

      const dUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${top.title}&format=json&origin=*`;
      const dRes = await axios.get(dUrl);
      const page = Object.values(dRes.data.query.pages)[0];
      const text = page.extract.split('\n');

      return {
        title: top.title,
        intro: text[0],
        background: text.slice(1, 5).join('\n\n'),
        concepts: text.slice(5, 12).join('\n\n'),
        url: `https://en.wikipedia.org/wiki/${top.title}`
      };
    } catch (e) { return null; }
  }
}
module.exports = new AISearch();
