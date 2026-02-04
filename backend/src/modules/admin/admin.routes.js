const router = require("express").Router();
const { getOrders, patchStatus } = require("./admin.controller");

router.get("/orders", getOrders);
router.patch("/orders/:id/status", patchStatus);

module.exports = router;
