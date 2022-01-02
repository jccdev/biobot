import sqlite3init from "sqlite3";
import fs from 'fs';

const dbDir = './db';

if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir);
}

const sqlite3 = sqlite3init.verbose();
const db = new sqlite3.Database('db/local.sqlite3');

db.serialize(() => {
  // These two queries will run sequentially.
  db.run(`
		CREATE TABLE IF NOT EXISTS kits (
			id UNSIGNED BIG INT PRIMARY KEY,
			label_id VARCHAR(100) NOT NULL,
			shipping_tracking_code VARCHAR(100) NOT NULL
		)
	`);
});