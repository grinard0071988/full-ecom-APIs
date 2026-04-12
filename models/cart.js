const db = require("./database");

class CartModel {
  async getOrCreateCart(user_id) {
    let result = await db.query(`SELECT * FROM cart WHERE user_id = $1`, [
      user_id,
    ]);

    if (result.rows.length === 0) {
      result = await db.query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`,
        [user_id],
      );
    }

    return result.rows[0];
  }
  // Get all items in a user's cart
  async getAllCart(cart_id) {
    const result = await db.query(
      `SELECT ci.*, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cart_id],
    );
    return result.rows;
  }
  //all items to cart
  async addItem(cart_id, product_id, quantity) {
    const result = await db.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [cart_id, product_id, quantity],
    );
    return result.rows[0];
  }
  //update item quantity
  async updateItem(id, quantity) {
    const result = await db.query(
      `UPDATE cart_items
         SET quantity = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
      [quantity, id],
    );
    return result.rows[0] || null;
  }
  //remove item
  async removeItem(id) {
    await db.query(`DELETE FROM cart_items WHERE id = $1`, [id]);
    return result.rowCount > 0;
  }
  //clear cart
  async clearCart(cart_id) {
    await db.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart_id]);
  }
}
module.exports = new CartModel();
