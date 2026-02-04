const ordersRepo = require("../orders/orders.repo");
const { AppError } = require("../../shared/errors");
const { z } = require("zod");

async function getOrders(_req, res, next) {
  try {
    const orders = await ordersRepo.listRecentOrders();
    res.json(orders);
  } catch (e) {
    next(e);
  }
}

const StatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "completed", "cancelled"]),
});

async function patchStatus(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    if (!Number.isInteger(orderId)) throw new AppError("Invalid order id", 400);

    const parsed = StatusSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError("Invalid status", 400);

    const updated = await ordersRepo.updateStatus(orderId, parsed.data.status);
    if (!updated) throw new AppError("Order not found", 404);

    res.json(updated);
  } catch (e) {
    next(e);
  }
}

module.exports = { getOrders, patchStatus };
