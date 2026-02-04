const service = require("./products.service");

async function getProducts(_req, res, next) {
  try {
    const products = await service.getCatalog();
    res.json(products);
  } catch (e) {
    next(e);
  }
}

module.exports = { getProducts };
