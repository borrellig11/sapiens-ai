async function doSearch() {
    const q = document.getElementById('q').value;
    const out = document.getElementById('output');
    const loader = document.getElementById('loader');
    
    if (!q.trim()) return;

    loader.className = ""; // Show loader
    out.style.opacity = "0"; // Prep for animation

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
        });
        const d = await res.json();
        loader.className = "hide";

        let academicHTML = d.academicList.length > 0 
            ? d.academicList.map(a => `<a href="${a.doi}" target="_blank" class="academic-link">↗ ${a.title.substring(0, 40)}...</a>`).join('')
            : "No academic papers found.";

        out.innerHTML = `
            <div class="report-card">
                <h2>${d.title}</h2>
                <p style="font-family:var(--font-sans); color:var(--text-muted); font-size:0.9rem">GEN_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} | SOURCE: GLOBAL_AGGREGATE</p>
                
                <h3>Abstract</h3>
                <p>${d.intro}</p>
                
                ${d.webSummary ? `<h3>Contextual Insights</h3><p>${d.webSummary}</p>` : ''}
                
                <h3>In-Depth Analysis</h3>
                <p>${d.detailed.replace(/\n/g, '<br><br>')}</p>
                
                <h3>Scholarly Bibliography</h3>
                <div class="academic-pills">${academicHTML}</div>
                
                <div style="margin-top:60px">
                    <a href="${d.url}" target="_blank" style="color:black; font-weight:bold; text-decoration:none; border-bottom: 2px solid black;">View Original Repository</a>
                </div>
            </div>
        `;
        out.style.opacity = "1";
        loadHistory();
    } catch (e) {
        loader.className = "hide";
        out.innerHTML = "<div class='report-card'>Error connecting to global archives.</div>";
    }
}

async function loadHistory() {
    try {
        const res = await fetch('/api/history');
        const d = await res.json();
        const histDiv = document.getElementById('hist');
        if (d.length > 0) {
            histDiv.innerHTML = d.map(h => `<span class="hpill" onclick="document.getElementById('q').value='${h.query}';doSearch()">${h.query}</span>`).join('');
        }
    } catch (e) {}
}

window.onload = loadHistory;
