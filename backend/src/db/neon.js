const { Pool } = require("pg");
const { DATABASE_URL } = require("../config/env");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
  max: 10,
  idleTimeoutMillis: 30000,
});

module.exports = {
  pool,
  query(text, params) {
    return pool.query(text, params);
  },
};
