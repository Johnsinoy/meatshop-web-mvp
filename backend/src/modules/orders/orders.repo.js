const db = require("../../db/neon");

async function createOrderWithItems({ orderNumber, customerName, phone, pickupTime, notes, subtotal, total, items }) {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const orderIns = await client.query(
      `INSERT INTO orders(order_number, customer_name, phone, pickup_time, notes, subtotal, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [orderNumber, customerName, phone, pickupTime || null, notes || null, subtotal, total]
    );

    const order = orderIns.rows[0];

    for (const it of items) {
      await client.query(
        `INSERT INTO order_items(order_id, product_id, qty, unit_price, item_notes)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, it.productId, it.qty, it.unitPrice, it.itemNotes || null]
      );
    }

    await client.query("COMMIT");
    return order;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function getOrderByNumber(orderNumber) {
  const o = await db.query("SELECT * FROM orders WHERE order_number=$1", [orderNumber]);
  const order = o.rows[0];
  if (!order) return null;

  const items = await db.query(
    `SELECT oi.*, p.name, p.unit
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id=$1
     ORDER BY oi.id ASC`,
    [order.id]
  );

  return { order, items: items.rows };
}

async function listRecentOrders(limit = 200) {
  const r = await db.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT $1", [limit]);
  return r.rows;
}

async function updateStatus(orderId, status) {
  const r = await db.query("UPDATE orders SET status=$1 WHERE id=$2 RETURNING *", [status, orderId]);
  return r.rows[0] || null;
}

module.exports = { createOrderWithItems, getOrderByNumber, listRecentOrders, updateStatus };
