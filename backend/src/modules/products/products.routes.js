const router = require("express").Router();
const { getProducts } = require("./products.controller");

router.get("/", getProducts);

module.exports = router;
