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
            <div class="report-card">
                <h2>${d.title}</h2>
                <p style="opacity:0.4; font-size:0.7rem; margin-bottom:40px;">// ACADEMIC_DOSSIER_GEN_3</p>
                
                <h3>I. Introduction</h3>
                <p>${d.intro}</p>
                
                ${d.background ? `<h3>II. Historical Context</h3><p>${d.background}</p>` : ''}
                
                ${d.concepts ? `<h3>III. Comprehensive Analysis</h3><p>${d.concepts.replace(/\n/g, '<br><br>')}</p>` : ''}
                
                <hr style="margin-top:50px; border:0; border-top:1px solid #eee">
                <a href="${d.url}" target="_blank" style="color:black; font-weight:bold; text-decoration:none">↗ View Verified Record</a>
            </div>
        `;
        loadHistory();
    } catch (e) {
        loader.classList.add('hide');
        out.innerHTML = "<p>Connection error. Please try again.</p>";
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
