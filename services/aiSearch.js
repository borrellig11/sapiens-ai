const axios = require('axios');

class AISearch {
    async getDetailedPage(query) {
        try {
            // A professional header tells the database we are a safe educational tool
            const config = { 
                headers: { 
                    'User-Agent': 'SapiensStudyApp/1.0 (Educational Research Tool; mailto:contact@example.com)' 
                },
                timeout: 10000 
            };

            // STEP 1: Search for the most accurate topic title
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
            const searchRes = await axios.get(searchUrl, config);
            
            if (!searchRes.data.query || searchRes.data.query.search.length === 0) {
                throw new Error("Topic not found");
            }

            const bestMatch = searchRes.data.query.search[0].title;

            // STEP 2: Get the high-speed "Summary" (Britannica Style)
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestMatch.replace(/ /g, '_'))}`;
            const summaryRes = await axios.get(summaryUrl, config);
            const data = summaryRes.data;

            // STEP 3: Get deeper content sections
            const contentUrl = `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(bestMatch.replace(/ /g, '_'))}`;
            const contentRes = await axios.get(contentUrl, config);
            
            // Extract the first few sections for "Analysis"
            const sections = contentRes.data.remaining.sections || [];
            const deepAnalysis = sections.slice(0, 3).map(s => `<h4>${s.line}</h4><p>${s.text.replace(/<[^>]*>/g, '').substring(0, 500)}...</p>`).join('');

            return {
                title: data.title,
                intro: data.extract,
                description: data.description || "General Academic Topic",
                detailed: deepAnalysis,
                url: data.content_urls.desktop.page
            };

        } catch (e) {
            console.error("STABLE_ENGINE_ERROR:", e.message);
            return {
                title: "Connection Alert",
                intro: "The database is currently unreachable. Please ensure you are connected to the internet and try again.",
                detailed: "Error details: " + e.message,
                url: "#"
            };
        }
    }
}

module.exports = new AISearch();
