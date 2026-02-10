const { Kysely, PostgresDialect } = require('kysely');
const { Pool } = require('pg');

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'workplace',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    }),
  }),
});

module.exports = { db };
