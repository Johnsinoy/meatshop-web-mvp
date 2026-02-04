const { z } = require("zod");
const repo = require("./orders.repo");
const { AppError } = require("../../shared/errors");

const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  phone: z.string().min(6),
  pickupTime: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number().int(),
      qty: z.number().positive(),
      unitPrice: z.number().nonnegative(),
      itemNotes: z.string().optional(),
    })
  ).min(1),
});

function generateOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MS-${y}${m}${day}-${rand}`;
}

function calcSubtotal(items) {
  return items.reduce((sum, it) => sum + Number(it.qty) * Number(it.unitPrice), 0);
}

async function createPickupOrder(payload) {
  const parsed = CreateOrderSchema.safeParse(payload);
  if (!parsed.success) throw new AppError("Invalid order payload", 400);

  const data = parsed.data;
  const subtotal = Number(calcSubtotal(data.items).toFixed(2));
  const total = subtotal; // pickup-only MVP

  const orderNumber = generateOrderNumber();

  const order = await repo.createOrderWithItems({
    orderNumber,
    customerName: data.customerName,
    phone: data.phone,
    pickupTime: data.pickupTime,
    notes: data.notes,
    subtotal,
    total,
    items: data.items,
  });

  return { orderNumber: order.order_number, total: order.total };
}

async function trackOrder(orderNumber) {
  const data = await repo.getOrderByNumber(orderNumber);
  if (!data) throw new AppError("Order not found", 404);
  return data;
}

module.exports = { createPickupOrder, trackOrder };
