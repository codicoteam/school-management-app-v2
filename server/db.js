require('dotenv').config();

// Cloud hosts like Render provide a single DATABASE_URL connection string
// and require SSL; the discrete DB_* vars remain the local-dev fallback.
const connection = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'school_management',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

const knex = require('knex')({
  client: 'pg',
  connection,
  pool: { min: 0, max: 10 },
});

module.exports = knex;
