const axios = require('axios');

class AISearch {
    async getDetailedPage(query) {
        try {
            // Mimic a standard Chrome browser to ensure the connection is never blocked
            const config = { 
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                },
                timeout: 5000 // 5 second timeout limit
            };

            // 1. Get General Web Summary from DuckDuckGo (Extremely Reliable)
            const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
            const ddgRes = await axios.get(ddgUrl, config);

            // 2. Get Detailed Facts from Wikipedia's simplest API
            const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`;
            let wikiData = null;
            try {
                const wikiRes = await axios.get(wikiUrl, config);
                wikiData = wikiRes.data;
            } catch (e) {
                // If direct link fails, try a quick search
                const search = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`, config);
                if (search.data.query.search[0]) {
                    const retryTitle = search.data.query.search[0].title;
                    const retryRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(retryTitle.replace(/ /g, '_'))}`, config);
                    wikiData = retryRes.data;
                }
            }

            // --- BUILD THE RESPONSE ---
            const title = wikiData?.title || ddgRes.data.Heading || query;
            const intro = wikiData?.extract || ddgRes.data.AbstractText || "No immediate summary available for this topic.";
            
            // Collect related "General Web" links
            const academicList = ddgRes.data.RelatedTopics ? ddgRes.data.RelatedTopics.slice(0, 5).map(t => ({
                title: t.Text ? t.Text.substring(0, 50) + "..." : "Related Resource",
                link: t.FirstURL || "#"
            })).filter(t => t.link !== "#") : [];

            return {
                title: title,
                intro: intro,
                webSummary: ddgRes.data.AbstractSource ? `Source: ${ddgRes.data.AbstractSource}` : "Source: General Web Archive",
                detailed: wikiData?.description || "Categorized as General Knowledge.",
                academicList: academicList,
                url: wikiData?.content_urls?.desktop?.page || `https://www.google.com/search?q=${encodeURIComponent(query)}`
            };

        } catch (e) {
            console.error("STABLE ENGINE ERROR:", e.message);
            return {
                title: "Research Offline",
                intro: "The system is having trouble reaching the internet. Please check your connection and try again.",
                detailed: "Connection Log: " + e.message,
                academicList: [],
                url: "#"
            };
        }
    }
}

module.exports = new AISearch();
