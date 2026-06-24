async function doSearch() {
    const q = document.getElementById('q').value;
    const out = document.getElementById('output');
    const loader = document.getElementById('loader');
    
    if (!q.trim()) return;

    loader.classList.remove('hide');
    out.innerHTML = "";

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
        });
        const d = await res.json();
        loader.classList.add('hide');

        out.innerHTML = `
            <div class="report-view">
                <h2>${d.title}</h2>
                <p class="desc">${d.description}</p>
                
                <h3>I. Abstract Synthesis</h3>
                <p>${d.intro}</p>
                
                <h3>II. Detailed Academic Analysis</h3>
                <div>${d.detailed}</div>
                
                <hr style="margin-top:60px; border:0; border-top:1px solid #eee">
                <a href="${d.url}" target="_blank" style="color:black; font-weight:bold; text-decoration:none">↗ Access Verified Knowledge Base</a>
            </div>
        `;
        loadHistory();
    } catch (e) {
        loader.classList.add('hide');
        out.innerHTML = "<p style='text-align:center'>Connection error. Please restart your server.</p>";
    }
}

async function loadHistory() {
    try {
        const res = await fetch('/api/history');
        const d = await res.json();
        const histDiv = document.getElementById('hist');
        histDiv.innerHTML = d.map(h => `<span class="hpill" onclick="document.getElementById('q').value='${h.query}';doSearch()">${h.query}</span>`).join('');
    } catch (e) {}
}

window.onload = loadHistory;
