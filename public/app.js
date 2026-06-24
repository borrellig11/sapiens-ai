async function doSearch() {
    const qInput = document.getElementById('q');
    const q = qInput.value.trim();
    const out = document.getElementById('output');
    const loader = document.getElementById('loader');
    
    if (!q) return;

    loader.classList.remove('hide');
    out.innerHTML = "";
    out.style.opacity = "0";

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
        });

        if (!res.ok) throw new Error("Server response failed");

        const d = await res.json();
        loader.classList.add('hide');

        // Layout the Academic bibliography
        let academicHTML = d.academicList && d.academicList.length > 0 
            ? d.academicList.map(a => `<a href="${a.link}" target="_blank" class="academic-link">↗ ${a.title.substring(0, 50)}...</a>`).join('')
            : "<p style='font-size:0.8rem; opacity:0.5'>No scholarly citations currently indexed for this query.</p>";

        // Construct the Magazine-style Report
        out.innerHTML = `
            <div class="report-card">
                <p style="font-size:0.7rem; letter-spacing:3px; opacity:0.5; margin-bottom:10px">RESEARCH_DOSSIER // ${new Date().getFullYear()}</p>
                <h2>${d.title}</h2>
                
                <h3>I. Abstract</h3>
                <p>${d.intro}</p>
                
                ${d.webSummary ? `<h3>II. General Synthesis</h3><p>${d.webSummary}</p>` : ''}
                
                ${d.detailed ? `<h3>III. Comprehensive Analysis</h3><p>${d.detailed.replace(/\n/g, '<br><br>')}</p>` : ''}
                
                <h3>IV. Bibliography & Academic Citations</h3>
                <div class="academic-pills">${academicHTML}</div>
                
                <div style="margin-top:60px; border-top:1px solid #e8e4db; padding-top:20px;">
                    <a href="${d.url}" target="_blank" style="color:black; font-weight:bold; text-decoration:none; border-bottom: 2px solid black;">ACCESS FULL REPOSITORY</a>
                </div>
            </div>
        `;
        
        // Trigger Fade-In
        setTimeout(() => { out.style.opacity = "1"; }, 50);
        loadHistory();
    } catch (e) {
        loader.classList.add('hide');
        out.innerHTML = `<div class="report-card"><h3>Connection Failed</h3><p>Could not retrieve data. Check your terminal for errors.</p></div>`;
        out.style.opacity = "1";
    }
}

async function loadHistory() {
    try {
        const res = await fetch('/api/history');
        const d = await res.json();
        const histDiv = document.getElementById('hist');
        if (d && d.length > 0) {
            histDiv.innerHTML = d.map(h => `<span class="hpill" onclick="document.getElementById('q').value='${h.query}';doSearch()">${h.query}</span>`).join('');
        }
    } catch (e) {}
}

window.onload = loadHistory;
