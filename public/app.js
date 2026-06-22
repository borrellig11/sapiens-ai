async function performSearch() {
    const query = document.getElementById('userInput').value;
    if (!query) return;

    const loader = document.getElementById('loader');
    const output = document.getElementById('outputArea');

    loader.classList.remove('hidden');
    output.style.opacity = "0.5";

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await res.json();
        loader.classList.add('hidden');
        output.style.opacity = "1";

        // Render Clean Result
        let html = `<h2>${query}</h2>`;
        html += `<p style="white-space: pre-wrap;">${data.response}</p>`;
        
        // Render Source Buttons
        if (data.sources.length > 0) {
            html += `<div class="source-container"><h4>Verified Sources</h4>`;
            data.sources.forEach(src => {
                html += `<a class="source-link" href="${src.url}" target="_blank">↗ ${src.title}</a>`;
            });
            html += `</div>`;
        }

        output.innerHTML = html;
        loadHistory();
    } catch (err) {
        loader.classList.add('hidden');
        output.innerHTML = "Error connecting to service.";
    }
}

async function loadHistory() {
    const res = await fetch('/api/history');
    const data = await res.json();
    const list = document.getElementById('historyList');
    
    list.innerHTML = data.map(item => `
        <div class="history-item">
            <span>${item.query_text}</span>
            <small style="color:#999">${new Date(item.created_at).toLocaleDateString()}</small>
        </div>
    `).join('');
}

window.onload = loadHistory;
