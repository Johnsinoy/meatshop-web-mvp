const db = require("../../db/neon");

async function listAvailable() {
  const r = await db.query(
    "SELECT * FROM products WHERE is_available=true ORDER BY category, name",
    []
  );
  return r.rows;
}

module.exports = { listAvailable };
