# 🧠 Sapiens AI - Free Studying Platform

Sapiens AI is a free, open-source AI-powered studying platform similar to Perplexity. It provides intelligent search capabilities with comprehensive source attribution and a beautiful, user-friendly interface with navy blue background and scarlett red text in bold Times New Roman font.

## ✨ Features

- 🔍 **Intelligent Search** - Ask anything and get comprehensive answers
- 📚 **Multiple Sources** - Aggregates information from Wikipedia, MIT OpenCourseWare, Khan Academy, Arxiv, Google Scholar, and more
- 💾 **Search History** - Keep track of all your previous searches
- 🔖 **Save Responses** - Bookmark your favorite responses for later review
- 🎨 **Beautiful UI** - Navy blue (#001a3d) background with scarlett red (#dc143c) text in bold Times New Roman
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🚀 **No API Keys Required** - Completely free to use, no authentication needed
- 💪 **Robust Backend** - SQLite database for persistent data storage
- 📊 **Source Attribution** - Every answer includes sources with relevance scores and direct links

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Custom styling with navy blue & scarlett red theme)
- Vanilla JavaScript (No frameworks required)
- Font Awesome Icons

**Backend:**
- Node.js & Express.js
- SQLite3 (Lightweight database)
- Axios (HTTP requests)
- Express Session (Session management)

## 📋 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/borrellig11/sapiens-ai.git
   cd sapiens-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
sapiens-ai/
├── public/
│   ├── index.html          # Main HTML interface
│   ├── styles.css          # Styling (Navy blue & Scarlett red)
│   └── app.js              # Frontend JavaScript
├── db/
│   └── database.js         # SQLite database module
├── routes/
│   ├── search.js           # Search API endpoints
│   └── history.js          # History & saved responses endpoints
├── services/
│   └── aiSearch.js         # AI search service logic
├── server.js               # Main Express server
├── package.json            # Dependencies
├── .gitignore              # Git ignore file
└── README.md              # This file
```

## 🗄️ Database Schema

**Tables:**
- **users** - User sessions (id, session_id, created_at, last_active)
- **queries** - Search queries (id, user_id, query_text, created_at)
- **results** - Search results (id, query_id, result_text, sources, search_time, token_count)
- **sources** - Source citations (id, result_id, source_title, source_url, source_snippet, relevance_score)
- **saved_responses** - Bookmarked responses (id, user_id, query_id, result_id, saved_at)

## 🔌 API Endpoints

### Search
- **POST** `/api/search`
  - Body: `{ query: "your question" }`
  - Returns: Response, sources, search time, token count

### History
- **GET** `/api/history` - Get user's search history
- **POST** `/api/history/save` - Save a response
  - Body: `{ queryId: id, resultId: id }`
- **GET** `/api/history/saved` - Get saved responses

### Health Check
- **GET** `/api/health` - Server health status

## 🎨 Design & UI

**Color Scheme:**
- Primary Background: Navy Blue (`#001a3d`)
- Primary Text: Scarlett Red (`#dc143c`)
- Secondary Background: Lighter Navy (`#0d2966`)
- Font: **Bold Times New Roman** throughout

**Responsive Breakpoints:**
- Desktop: Full width up to 1400px
- Tablet: 768px and below
- Mobile: 480px and below

## 💡 How It Works

1. User enters a search query
2. Backend performs parallel searches across:
   - Wikipedia API (primary source)
   - Educational resources (MIT OCW, Khan Academy, etc.)
   - Academic databases (Google Scholar, Arxiv)
   - Reference libraries (Library of Congress, Project Gutenberg)
3. Results are synthesized into comprehensive answer
4. Sources are extracted and ranked by relevance
5. Everything is stored in SQLite database
6. Beautiful formatted response with sources is displayed
7. User can save responses or view history

## 🚀 Usage Examples

**Try searching for:**
- "How does photosynthesis work?"
- "Explain machine learning algorithms"
- "What is quantum mechanics?"
- "History of the internet"
- "Mitochondria function"
- "Climate change causes and solutions"

## 📊 Features in Detail

### 🔍 Search Functionality
- Real-time search across multiple authoritative sources
- Synthesized responses combining information from multiple sources
- No API keys required - completely free

### 📚 Source Attribution
Every response includes:
- Source title with link
- Direct URL to original source
- Content snippet preview
- Relevance score (0-100%)
- Source database name

### 💾 Search History
- Automatically saved to database
- Timestamped entries
- One-click replay of previous searches
- Up to 50 searches stored

### 🔖 Save Responses
- Bookmark important responses
- Persistent storage in database
- Quick access to saved material
- View all saved with timestamps

## 🔐 Privacy & Security

- ✅ No tracking or analytics
- ✅ No advertisements
- ✅ All data stored locally in SQLite
- ✅ No personal information collected
- ✅ Open source - code is fully transparent
- ✅ No API keys or credentials required

## 📦 Dependencies

All dependencies are in `package.json`:
- `express` - Web framework
- `sqlite3` - Database
- `axios` - HTTP client
- `cors` - Cross-origin support
- `express-session` - Session management
- `nodemon` - Development auto-reload

## 🚧 Future Enhancements

- [ ] Integration with additional APIs (Semantic Scholar, ProQuest)
- [ ] Advanced NLP for better answer synthesis
- [ ] User authentication & cloud sync
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Export responses as PDF/Word
- [ ] Share responses with unique links
- [ ] Advanced filters and search options
- [ ] Citation formatting (APA, MLA, Chicago)

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the **MIT License**.

## 📞 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Check existing issues for solutions
- Review documentation

## 🙏 Acknowledgments

- Wikipedia for educational content
- MIT OpenCourseWare for free educational materials
- Khan Academy for supplementary learning resources
- Arxiv for academic papers
- Google Scholar for scholarly literature
- All open educational platforms providing free, quality content

## 📈 Statistics

- **0** API keys required
- **∞** Free searches allowed
- **100%** Open source
- **Multiple** Educational sources
- **Fast** Response times (typically < 2 seconds)
- **Persistent** SQLite database

---

**Made with ❤️ for students and lifelong learners**

🧠 **Sapiens AI** © 2024 | Free & Open-Source Studying Platform

Happy learning! 📚✨
