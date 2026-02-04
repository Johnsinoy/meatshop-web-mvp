const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const productsRoutes = require("./modules/products/products.routes");
const ordersRoutes = require("./modules/orders/orders.routes");
const adminRoutes = require("./modules/admin/admin.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
