function tab(name) {
    document.getElementById('research-sec').style.display = name === 'research' ? 'block' : 'none';
    document.getElementById('chat-sec').style.display = name === 'chat' ? 'block' : 'none';
    
    document.getElementById('t1').className = name === 'research' ? 'active' : '';
    document.getElementById('t2').className = name === 'chat' ? 'active' : '';
}

async function doSearch() {
    const qInput = document.getElementById('q');
    const out = document.getElementById('output');
    
    if (!qInput.value.trim()) return alert("Please enter a topic");

    out.innerHTML = "<p><i>Consulting academic libraries...</i></p>";

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: qInput.value })
        });

        const d = await res.json();

        if (d.error) {
            out.innerHTML = `<p>Error: ${d.error}</p>`;
            return;
        }

        out.innerHTML = `
            <h1 style="font-size:2.8rem; margin-bottom:10px;">${d.title}</h1>
            <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem; color: #666; margin-bottom:40px;">Academic Synthesis Report</p>
            
            <h3 style="border-bottom: 1px solid #d1cdc4; padding-bottom:10px;">I. Introduction</h3>
            <p>${d.intro}</p>
            
            <h3 style="border-bottom: 1px solid #d1cdc4; padding-bottom:10px; margin-top:40px;">II. Historical Context</h3>
            <p>${d.background.replace(/\n/g, '<br><br>')}</p>
            
            <h3 style="border-bottom: 1px solid #d1cdc4; padding-bottom:10px; margin-top:40px;">III. Analysis & Concepts</h3>
            <p>${d.concepts.replace(/\n/g, '<br><br>')}</p>
            
            <hr style="margin-top:50px; border: 0; border-top: 1px solid #d1cdc4;">
            <a href="${d.url}" target="_blank" style="color:black; font-weight:bold; text-decoration:none;">↗ View Full Academic Record</a>
        `;
        
        loadHistory();
    } catch (err) {
        out.innerHTML = "<p>Connection error. Is the server running?</p>";
        console.error(err);
    }
}

async function doChat() {
    const mInput = document.getElementById('cm');
    const box = document.getElementById('chat-box');
    
    if (!mInput.value.trim()) return;

    const userMsg = mInput.value;
    box.innerHTML += `<div class="msg user"><b>You:</b><br>${userMsg}</div>`;
    mInput.value = "";

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg })
        });
        const d = await res.json();
        box.innerHTML += `<div class="msg ai"><b>Assistant:</b><br>${d.reply}</div>`;
        box.scrollTop = box.scrollHeight;
    } catch (err) {
        box.innerHTML += `<div class="msg ai">Connection lost.</div>`;
    }
}

async function loadHistory() {
    try {
        const res = await fetch('/api/history');
        const d = await res.json();
        const histDiv = document.getElementById('hist');
        if (d.length > 0) {
            histDiv.innerHTML = d.map(h => `<span style="cursor:pointer" onclick="document.getElementById('q').value='${h.query}';doSearch()">${h.query} • </span>`).join('');
        }
    } catch (e) {
        console.log("History could not load.");
    }
}

window.onload = loadHistory;
