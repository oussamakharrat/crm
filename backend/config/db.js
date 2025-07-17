import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crmdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Test the connection at startup
pool.getConnection()
  .then(connection => {
    console.log('Database connected!');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export default pool;

