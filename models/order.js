const db = require("./database");

class OrderModel {
  async createOrder(user_id, subtotal, tax, shipping, total) {
    const result = await db.query(
      `INSERT INTO orders (user_id, subtotal, tax, shipping, total)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
      [user_id, subtotal, tax, shipping, total],
    );
    return result.rows[0];
  }
  //add Order items
  async addOrderItem(order_id, product_id, quantity, price) {
    const result = await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
      [order_id, product_id, quantity, price],
    );
    return result.rows[0];
  }
  async getOrderByUser(user_id) {
    const result = await db.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id],
    );
    return result.rows;
  }
  async getOrderDetails(order_id) {
    const order = await db.query(`SELECT * FROM orders WHERE id = $1`, [
      order_id,
    ]);
    const items = await db.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order_id],
    );
    return { order: order.rows[0], items: items.rows };
  }
}
module.exports = new OrderModel();
