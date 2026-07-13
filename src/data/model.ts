import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync('./data.db');

const initDatabase = `
CREATE TABLE IF NOT EXISTS Trade (
  id INTEGER PRIMARY KEY,
  price INTEGER
)`

database.exec(initDatabase);

export default database;