const axios = require('axios');

class AISearch {
    async getDetailedPage(query) {
        try {
            // Professional Header to prevent being blocked by databases
            const config = { 
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json'
                },
                timeout: 10000 
            };

            // 1. Search for the best Wikipedia Title
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            const searchRes = await axios.get(searchUrl, config);
            
            let targetTitle = query;
            if (searchRes.data.query && searchRes.data.query.search.length > 0) {
                targetTitle = searchRes.data.query.search[0].title;
            }

            // 2. Fetch Data from Wiki, DuckDuckGo, and CrossRef
            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(targetTitle)}&format=json&origin=*`;
            const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
            const academicUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`;

            const [wikiDetail, ddgDetail, academicDetail] = await Promise.allSettled([
                axios.get(wikiUrl, config),
                axios.get(ddgUrl, config),
                axios.get(academicUrl, config)
            ]);

            let intro = "Academic synthesis failed to generate. Please verify your internet connection.";
            let detailed = "";
            let url = `https://en.wikipedia.org/wiki/${encodeURIComponent(targetTitle)}`;

            if (wikiDetail.status === 'fulfilled' && wikiDetail.data.query) {
                const page = Object.values(wikiDetail.data.query.pages)[0];
                if (page.extract) {
                    const parts = page.extract.split('\n').filter(p => p.trim().length > 20);
                    intro = parts[0] || intro;
                    detailed = parts.slice(1, 10).join('\n\n');
                }
            }

            let webSummary = "";
            if (ddgDetail.status === 'fulfilled' && ddgDetail.data.AbstractText) {
                webSummary = ddgDetail.data.AbstractText;
            }

            let academicList = [];
            if (academicDetail.status === 'fulfilled' && academicDetail.data.message?.items) {
                academicList = academicDetail.data.message.items.map(item => ({
                    title: item.title ? item.title[0] : "Scholarly Publication",
                    link: item.URL || "#"
                }));
            }

            return { title: targetTitle, intro, webSummary, detailed, academicList, url };

        } catch (e) {
            console.error("CONNECTION ERROR:", e.message);
            return {
                title: "System Error",
                intro: "The connection to global research databases was interrupted. Please ensure your machine has active internet access.",
                detailed: "Terminal Log: " + e.message,
                academicList: [],
                url: "#"
            };
        }
    }
}

module.exports = new AISearch();
