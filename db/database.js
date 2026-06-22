const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, 'sapiens.db');
    this.db = null;
  }

  initialize() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Database opening error: ', err);
      } else {
        console.log('✅ Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_id INTEGER NOT NULL,
        result_text TEXT NOT NULL,
        sources TEXT,
        search_time REAL,
        token_count INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(query_id) REFERENCES queries(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        result_id INTEGER NOT NULL,
        source_title TEXT,
        source_url TEXT,
        source_snippet TEXT,
        relevance_score REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(result_id) REFERENCES results(id) ON DELETE CASCADE
      )`,

      `CREATE TABLE IF NOT EXISTS saved_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        query_id INTEGER,
        result_id INTEGER,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(query_id) REFERENCES queries(id) ON DELETE CASCADE,
        FOREIGN KEY(result_id) REFERENCES results(id) ON DELETE CASCADE
      )`
    ];

    queries.forEach((query) => {
      this.db.run(query, (err) => {
        if (err) {
          console.error('Error creating table: ', err);
        }
      });
    });
  }

  getOrCreateUser(sessionId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE session_id = ?',
        [sessionId],
        (err, row) => {
          if (err) reject(err);
          if (row) {
            resolve(row);
          } else {
            this.db.run(
              'INSERT INTO users (session_id) VALUES (?)',
              [sessionId],
              function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, session_id: sessionId });
              }
            );
          }
        }
      );
    });
  }

  saveQuery(userId, queryText) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO queries (user_id, query_text) VALUES (?, ?)',
        [userId, queryText],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  saveResult(queryId, resultText, sources, searchTime, tokenCount) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO results (query_id, result_text, sources, search_time, token_count) VALUES (?, ?, ?, ?, ?)',
        [queryId, resultText, sources, searchTime, tokenCount],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  saveSources(resultId, sources) {
    return Promise.all(
      sources.map(source => {
        return new Promise((resolve, reject) => {
          this.db.run(
            'INSERT INTO sources (result_id, source_title, source_url, source_snippet, relevance_score) VALUES (?, ?, ?, ?, ?)',
            [resultId, source.title, source.url, source.snippet, source.relevance_score || 0.9],
            function(err) {
              if (err) reject(err);
              else resolve(this.lastID);
            }
          );
        });
      })
    );
  }

  getSources(resultId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM sources WHERE result_id = ? ORDER BY relevance_score DESC',
        [resultId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  getUserHistory(userId, limit = 20) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT q.*, r.result_text, r.search_time, r.token_count 
         FROM queries q 
         LEFT JOIN results r ON q.id = r.query_id 
         WHERE q.user_id = ? 
         ORDER BY q.created_at DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  saveResponse(userId, queryId, resultId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO saved_responses (user_id, query_id, result_id) VALUES (?, ?, ?)',
        [userId, queryId, resultId],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  getSavedResponses(userId, limit = 50) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT sr.*, q.query_text, r.result_text, r.search_time 
         FROM saved_responses sr 
         JOIN queries q ON sr.query_id = q.id 
         JOIN results r ON sr.result_id = r.id 
         WHERE sr.user_id = ? 
         ORDER BY sr.saved_at DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = Database;
