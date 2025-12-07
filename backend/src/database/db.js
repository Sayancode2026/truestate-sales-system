import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME ,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  
  
  max: 50, 
  min: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  maxUses: 7500, 
  allowExitOnIdle: false,
  
  
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('connect', (client) => {
  console.log('New database connection established');
});

pool.on('acquire', () => {
  console.log('Client acquired from pool');
});

pool.on('error', (err, client) => {
  console.error('Unexpected database pool error:', err);
  
});

pool.on('remove', () => {
  console.log('Client removed from pool');
});

(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

export default pool;
