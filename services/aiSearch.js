const axios = require('axios');

class AISearch {
    async getDetailedPage(query) {
        try {
            const config = { 
                headers: { 'User-Agent': 'SapiensAI/1.0' },
                timeout: 8000 // 8 second timeout
            };

            // STEP 1: Find the most relevant Wikipedia Title
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            const searchRes = await axios.get(searchUrl, config);
            
            let targetTitle = query;
            if (searchRes.data.query && searchRes.data.query.search.length > 0) {
                targetTitle = searchRes.data.query.search[0].title;
            }

            // STEP 2: Fetch Data from 3 Sources in Parallel
            // Wikipedia Content
            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(targetTitle)}&format=json&origin=*`;
            // Web Snippet
            const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
            // Academic Papers
            const academicUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`;

            const [wikiDetail, ddgDetail, academicDetail] = await Promise.allSettled([
                axios.get(wikiUrl, config),
                axios.get(ddgUrl, config),
                axios.get(academicUrl, config)
            ]);

            // --- EXTRACT WIKIPEDIA ---
            let intro = "Academic records for this specific query are currently being synthesized. Please check back shortly or refine your search parameters.";
            let detailed = "";
            let url = `https://en.wikipedia.org/wiki/${encodeURIComponent(targetTitle)}`;

            if (wikiDetail.status === 'fulfilled' && wikiDetail.data.query) {
                const pages = wikiDetail.data.query.pages;
                const page = Object.values(pages)[0];
                if (page.extract) {
                    const parts = page.extract.split('\n').filter(p => p.trim().length > 20);
                    intro = parts[0] || intro;
                    detailed = parts.slice(1, 8).join('\n\n');
                }
            }

            // --- EXTRACT WEB ---
            let webSummary = "";
            if (ddgDetail.status === 'fulfilled' && ddgDetail.data.AbstractText) {
                webSummary = ddgDetail.data.AbstractText;
            }

            // --- EXTRACT ACADEMIC ---
            let academicList = [];
            if (academicDetail.status === 'fulfilled' && academicDetail.data.message && academicDetail.data.message.items) {
                academicList = academicDetail.data.message.items.map(item => ({
                    title: item.title ? item.title[0] : "Untitled Paper",
                    link: item.URL || "#"
                }));
            }

            return {
                title: targetTitle,
                intro,
                webSummary,
                detailed,
                academicList,
                url
            };

        } catch (e) {
            console.error("CRITICAL SEARCH ERROR:", e);
            return {
                title: "System Error",
                intro: "The connection to global research databases was interrupted.",
                detailed: "Please ensure your server has active internet access.",
                academicList: [],
                url: "#"
            };
        }
    }
}

module.exports = new AISearch();
