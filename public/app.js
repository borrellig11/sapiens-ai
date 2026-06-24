async function doSearch() {
    const q = document.getElementById('q').value;
    const out = document.getElementById('output');
    const loader = document.getElementById('loader');
    
    if (!q.trim()) return;

    loader.className = ""; // Show loader
    out.innerHTML = "";

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q })
        });
        const d = await res.json();
        loader.className = "hide";

        let academicHTML = d.academicList.length > 0 
            ? d.academicList.map(a => `<a href="${a.doi}" target="_blank" class="academic-item">📖 ${a.title}</a>`).join('')
            : "No academic papers found.";

        out.innerHTML = `
            <h2>${d.title}</h2>
            <p><i>Global Academic synthesis for "${q}"</i></p>
            
            <h3>I. Overview</h3>
            <p>${d.intro}</p>
            
            ${d.webSummary ? `<h3>II. General Context</h3><p>${d.webSummary}</p>` : ''}
            
            <h3>III. Detailed Analysis</h3>
            <p>${d.detailed.replace(/\n/g, '<br><br>')}</p>
            
            <h3>IV. Scholarly References</h3>
            <div style="margin-bottom:50px">${academicHTML}</div>
            
            <hr style="border:0; border-top:1px solid #dcd9d0">
            <a href="${d.url}" target="_blank" style="color:black; font-weight:bold; text-decoration:none">↗ Full Record</a>
        `;
    } catch (e) {
        loader.className = "hide";
        out.innerHTML = "Error connecting to global servers.";
    }
}
