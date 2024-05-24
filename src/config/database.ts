import { createPool } from 'mysql2/promise';

console.log("INSIDE src/config/database.ts...");
//console.log("DB Host (before trimming): ", process.env.DB_HOST);
//console.log("DB User:", process.env.DB_USER);
//console.log("DB Password:", process.env.DB_PASS);
//console.log("DB Name:", process.env.DB_NAME);

process.env.DB_HOST = process.env.DB_HOST?.replace(":3306", "");
//console.log("DB Host (after trimming): ", process.env.DB_HOST);

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'insuranceDB',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
