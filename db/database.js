const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() { this.db = new sqlite3.Database(path.join(__dirname, 'sapiens.db')); }
  initialize() {
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, sid TEXT UNIQUE)`);
      this.db.run(`CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, query TEXT, response TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    });
  }
  getOrCreateUser(sid) {
    return new Promise(res => {
      this.db.get("SELECT id FROM users WHERE sid = ?", [sid], (err, row) => {
        if (row) res(row.id);
        else this.db.run("INSERT INTO users (sid) VALUES (?)", [sid], function() { res(this.lastID); });
      });
    });
  }
  saveHistory(uid, q, r) { this.db.run("INSERT INTO history (uid, query, response) VALUES (?,?,?)", [uid, q, r]); }
  getHistory(uid) {
    return new Promise(res => { this.db.all("SELECT * FROM history WHERE uid = ? ORDER BY created_at DESC LIMIT 5", [uid], (err, rows) => res(rows || [])); });
  }
}
module.exports = Database;
