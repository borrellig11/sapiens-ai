function tab(name) {
    document.getElementById('research-sec').className = name==='research' ? '' : 'hide';
    document.getElementById('chat-sec').className = name==='chat' ? '' : 'hide';
    document.getElementById('t1').className = name==='research' ? 'active' : '';
    document.getElementById('t2').className = name==='chat' ? 'active' : '';
}

async function doSearch() {
    const q = document.getElementById('q').value;
    const out = document.getElementById('output');
    out.innerHTML = "Consulting libraries...";
    const res = await fetch('/api/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({query: q}) });
    const d = await res.json();
    out.innerHTML = `
        <h1 style="font-size:2.5rem">${d.title}</h1>
        <p><i>Synthesis of Academic Records</i></p>
        <h3>Introduction</h3><p>${d.intro}</p>
        <h3>Background</h3><p>${d.background}</p>
        <h3>Analysis</h3><p>${d.concepts}</p>
        <hr><a href="${d.url}" target="_blank" style="color:black">↗ View Original Source</a>
    `;
    loadHistory();
}

async function doChat() {
    const m = document.getElementById('cm').value;
    const box = document.getElementById('chat-box');
    box.innerHTML += `<div class="msg user">${m}</div>`;
    const res = await fetch('/api/chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({message: m}) });
    const d = await res.json();
    box.innerHTML += `<div class="msg ai">${d.reply}</div>`;
    document.getElementById('cm').value = "";
}

async function loadHistory() {
    const res = await fetch('/api/history');
    const d = await res.json();
    document.getElementById('hist').innerHTML = d.map(h => `<span>${h.query} • </span>`).join('');
}
window.onload = loadHistory;
