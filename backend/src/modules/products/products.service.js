const repo = require("./products.repo");

async function getCatalog() {
  return repo.listAvailable();
}

module.exports = { getCatalog };
