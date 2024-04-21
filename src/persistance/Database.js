import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  connection = null;

  config = null;

  constructor(config) {
    this.config = config;
  }

  async connect() {
    if (this.config === null) {
      throw new Error('Database config is not set');
    }
    if (this.connection !== null) {
      throw new Error('Database is already connected');
    }
    this.connection = mysql.createConnection(this.config).promise();
  }

  disconnect() {
    if (this.connection === null) {
      throw new Error('Database is not connected');
    }
    this.connection.end();
    this.connection = null;
  }

  async query(sql) {
    return this.connection.query(sql);
  }
}

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const db = new Database(config);

export default db;
