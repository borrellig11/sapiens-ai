const axios = require('axios');

class AISearch {
    async getDetailedPage(query) {
        try {
            const config = { headers: { 'User-Agent': 'SapiensAI/1.0' } };

            // 1. Fetch from Wikipedia (Primary Context)
            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(query)}&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&format=json&origin=*`;
            
            // 2. Fetch from DuckDuckGo (General Web Snippet)
            const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;

            // 3. Fetch from CrossRef (Academic/Scholarly Records)
            const academicUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=3`;

            const [wikiRes, ddgRes, academicRes] = await Promise.allSettled([
                axios.get(wikiUrl, config),
                axios.get(ddgUrl, config),
                axios.get(academicUrl, config)
            ]);

            // --- PROCESS WIKIPEDIA DATA ---
            let title = query;
            let intro = "No general database entry found.";
            let detailed = "";
            let wikiLink = "#";

            if (wikiRes.status === 'fulfilled' && wikiRes.data.query) {
                const page = Object.values(wikiRes.data.query.pages)[0];
                title = page.title;
                const paragraphs = page.extract.split('\n').filter(p => p.length > 10);
                intro = paragraphs[0] || intro;
                detailed = paragraphs.slice(1, 6).join('\n\n');
                wikiLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
            }

            // --- PROCESS WEB/GENERAL DATA ---
            let webSummary = "";
            if (ddgRes.status === 'fulfilled' && ddgRes.data.AbstractText) {
                webSummary = ddgRes.data.AbstractText;
            }

            // --- PROCESS ACADEMIC DATA ---
            let academicList = [];
            if (academicRes.status === 'fulfilled' && academicRes.data.message.items) {
                academicList = academicRes.data.message.items.map(item => ({
                    title: item.title[0],
                    doi: item.URL
                }));
            }

            return {
                title,
                intro,
                webSummary,
                detailed,
                academicList,
                url: wikiLink
            };
        } catch (e) {
            console.error("Search Error:", e);
            return null;
        }
    }
}

module.exports = new AISearch();
