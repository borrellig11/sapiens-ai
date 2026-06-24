const axios = require('axios');

class AISearch {
    async getDetailedPage(query) {
        try {
            const config = { headers: { 'User-Agent': 'SapiensAI/1.0' } };

            // 1. Find the best matching title
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            const searchRes = await axios.get(searchUrl, config);
            
            if (!searchRes.data.query || searchRes.data.query.search.length === 0) {
                return { title: "No Result", intro: "Topic not found.", background: "", concepts: "", url: "#" };
            }
            const topTitle = searchRes.data.query.search[0].title;

            // 2. Get the full detailed extract
            const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(topTitle)}&format=json&origin=*`;
            const detailRes = await axios.get(detailUrl, config);
            const pages = detailRes.data.query.pages;
            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId].extract || "";

            const paragraphs = extract.split('\n').filter(p => p.trim().length > 20);

            return {
                title: topTitle,
                intro: paragraphs[0] || "No summary available.",
                background: paragraphs.slice(1, 4).join('\n\n'),
                concepts: paragraphs.slice(4, 10).join('\n\n'),
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topTitle)}`
            };
        } catch (e) {
            console.error("Search Error:", e);
            return { title: "Error", intro: "Connection failed.", background: "", concepts: "", url: "#" };
        }
    }
}

module.exports = new AISearch();
