const sql = require('mssql');

const config = {
  user: 'ippl',
  password: '1Sampai8',
  server: 'parfumweb.database.windows.net',
  database: 'parfum',
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function getConnection() {
  if (pool) return pool;
  
  try {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('Connected to SQL Server');
    
    // Handle connection errors
    pool.on('error', err => {
      console.error('SQL Server connection error:', err);
      pool = null; // Force reconnection on next call
    });
    
    return pool;
  } catch (err) {
    console.error('Database Connection Failed:', err);
    throw err;
  }
}

module.exports = {
  getConnection,
  sql // Export sql for parameter types
};