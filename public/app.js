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
function switchTab(tab) {
    if (tab === 'research') {
        document.getElementById('research-content').classList.remove('hidden');
        document.getElementById('chat-content').classList.add('hidden');
        document.getElementById('tab-research').classList.add('active-tab');
        document.getElementById('tab-chat').classList.remove('active-tab');
    } else {
        document.getElementById('research-content').classList.add('hidden');
        document.getElementById('chat-content').classList.remove('hidden');
        document.getElementById('tab-chat').classList.add('active-tab');
        document.getElementById('tab-research').classList.remove('active-tab');
    }
}

async function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value;
    if (!msg) return;

    const chatBox = document.getElementById('chatBox');
    
    // 1. Show user message
    chatBox.innerHTML += `<div class="chat-bubble user-msg">${msg}</div>`;
    input.value = "";

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();

        // 2. Show AI message
        chatBox.innerHTML += `<div class="chat-bubble ai-msg">${data.reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
        alert("Chat error");
    }
}
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

        // Convert the "Fake Markdown" from the backend into real HTML
        let formattedBody = data.response
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\n/g, '<br>');

        let html = `<div class="article-view">${formattedBody}</div>`;
        
        if (data.sources.length > 0) {
            html += `<div class="source-container"><h4>Verified Sources</h4>`;
            data.sources.forEach(src => {
                html += `<a class="source-link" href="${src.url}" target="_blank">↗ View Full Academic Record</a>`;
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
