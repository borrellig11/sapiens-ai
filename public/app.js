const state = {
  currentQuery: '',
  currentResult: null,
  currentSources: [],
  queryId: null,
  resultId: null
};

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchSection = document.getElementById('searchSection');
const loadingState = document.getElementById('loadingState');
const resultsSection = document.getElementById('resultsSection');
const responseContent = document.getElementById('responseContent');
const sourcesList = document.getElementById('sourcesList');
const resultQuery = document.getElementById('resultQuery');
const historySection = document.getElementById('historySection');
const savedSection = document.getElementById('savedSection');

searchForm.addEventListener('submit', handleSearch);

async function handleSearch(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search query');
    return;
  }
  await searchQuery(query);
}

async function searchQuery(query) {
  state.currentQuery = query;
  
  searchSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  historySection.classList.add('hidden');
  savedSection.classList.add('hidden');
  loadingState.classList.remove('hidden');

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query })
    });

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    state.currentResult = data.response;
    state.currentSources = data.sources;
    state.queryId = data.queryId;
    state.resultId = data.resultId;

    displayResults(data);

  } catch (error) {
    console.error('Search error:', error);
    alert('Error performing search: ' + error.message);
  } finally {
    loadingState.classList.add('hidden');
    resultsSection.classList.remove('hidden');
  }
}

function displayResults(data) {
  resultQuery.textContent = `Search: "${state.currentQuery}"`;
  const formattedResponse = parseMarkdown(data.response);
  responseContent.innerHTML = formattedResponse;
  displaySources(data.sources);
  document.getElementById('searchTime').textContent = data.searchTime.toFixed(2);
  document.getElementById('sourceCount').textContent = data.sources.length;
  document.getElementById('tokenCount').textContent = data.tokenCount;
}

function displaySources(sources) {
  sourcesList.innerHTML = '';
  if (!sources || sources.length === 0) {
    sourcesList.innerHTML = '<p style="color: rgba(220, 20, 60, 0.8);">No sources available</p>';
    return;
  }

  sources.forEach((source, index) => {
    const sourceItem = document.createElement('div');
    sourceItem.className = 'source-item';
    sourceItem.innerHTML = `
      <div class="source-title">[${index + 1}] ${escapeHtml(source.title)}</div>
      <a href="${escapeHtml(source.url)}" target="_blank" class="source-url">${escapeHtml(source.url)}</a>
      ${source.snippet ? `<div class="source-snippet">${escapeHtml(source.snippet.substring(0, 200))}</div>` : ''}
      ${source.relevance_score ? `<div class="source-score">Relevance: ${(source.relevance_score * 100).toFixed(0)}%</div>` : ''}
    `;
    sourcesList.appendChild(sourceItem);
  });
}

function parseMarkdown(markdown) {
  let html = markdown;
  html = html.replace(/^### (.*?)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/^---$/gm, '<hr>');
  return html;
}

async function saveCurrentResponse() {
  if (!state.queryId || !state.resultId) {
    alert('No response to save');
    return;
  }

  try {
    const response = await fetch('/api/history/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryId: state.queryId, resultId: state.resultId })
    });

    if (response.ok) {
      alert('Response saved successfully!');
    } else {
      alert('Failed to save response');
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving response: ' + error.message);
  }
}

function copyToClipboard() {
  const text = state.currentResult || '';
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Response copied to clipboard!');
    }).catch(err => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Response copied to clipboard!');
}

async function showHistory() {
  historySection.classList.remove('hidden');
  searchSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  savedSection.classList.add('hidden');

  try {
    const response = await fetch('/api/history');
    const data = await response.json();

    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (data.history.length === 0) {
      historyList.innerHTML = '<p style="color: rgba(220, 20, 60, 0.8);">No search history yet</p>';
      return;
    }

    data.history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'list-item';
      historyItem.innerHTML = `
        <div class="list-item-title">${escapeHtml(item.query_text)}</div>
        <div class="list-item-meta">${new Date(item.created_at).toLocaleString()} | ${item.search_time ? item.search_time.toFixed(2) + 's' : 'N/A'}</div>
      `;
      historyItem.style.cursor = 'pointer';
      historyItem.onclick = () => {
        searchInput.value = item.query_text;
        searchQuery(item.query_text);
      };
      historyList.appendChild(historyItem);
    });
  } catch (error) {
    console.error('History error:', error);
    alert('Error loading history: ' + error.message);
  }
}

async function showSaved() {
  savedSection.classList.remove('hidden');
  searchSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  historySection.classList.add('hidden');

  try {
    const response = await fetch('/api/history/saved');
    const data = await response.json();

    const savedList = document.getElementById('savedList');
    savedList.innerHTML = '';

    if (data.saved.length === 0) {
      savedList.innerHTML = '<p style="color: rgba(220, 20, 60, 0.8);">No saved responses yet</p>';
      return;
    }

    data.saved.forEach(item => {
      const savedItem = document.createElement('div');
      savedItem.className = 'list-item';
      savedItem.innerHTML = `
        <div class="list-item-title">${escapeHtml(item.query_text)}</div>
        <div class="list-item-meta">Saved: ${new Date(item.saved_at).toLocaleString()} | ${item.search_time ? item.search_time.toFixed(2) + 's' : 'N/A'}</div>
        <div style="margin-top: 0.8rem; color: var(--light-text); font-size: 0.9rem; max-height: 100px; overflow: hidden;">${escapeHtml(item.result_text.substring(0, 150))}...</div>
      `;
      savedItem.style.cursor = 'pointer';
      savedItem.onclick = () => {
        searchInput.value = item.query_text;
        searchQuery(item.query_text);
      };
      savedList.appendChild(savedItem);
    });
  } catch (error) {
    console.error('Saved error:', error);
    alert('Error loading saved responses: ' + error.message);
  }
}

function newSearch() {
  searchInput.value = '';
  searchSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  historySection.classList.add('hidden');
  savedSection.classList.add('hidden');
  searchInput.focus();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🧠 Sapiens AI loaded successfully');
  searchInput.focus();
});
