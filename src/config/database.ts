import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'insurancedb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
