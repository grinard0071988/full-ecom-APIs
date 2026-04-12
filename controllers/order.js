const cartModel = require("../models/cart");
const orderModel = require("../models/order");

exports.checkout = async (req, res) => {
  try {
    const user_id = req.userId;

    // 1. Get cart
    const cart = await cartModel.getOrCreateCart(user_id);
    const items = await cartModel.getAllCart(cart.id);

    if (items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.quantity * item.price; //
    }

    const tax = subtotal * 0.1;
    const shipping = 5.0;
    const total = subtotal + tax + shipping;

    // 3. Create order
    const order = await orderModel.createOrder(
      user_id,
      subtotal,
      tax,
      shipping,
      total,
    );

    // 4. Move cart items → order_items
    for (const item of items) {
      await orderModel.addOrderItem(
        order.id,
        item.product_id,
        item.quantity,
        item.price,
      );
    }

    // 5. Clear cart
    await cartModel.clearCart(cart.id);

    res.status(201).json({
      message: "Order placed successfully",
      order_id: order.id,
      total,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.userId;
    const orders = await orderModel.getOrdersByUser(user_id);
    res.json(orders);
  } catch (err) {
    console.error("getUserOrders error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;
    const details = await orderModel.getOrderDetails(order_id);

    if (!details.order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(details);
  } catch (err) {
    console.error("getOrderDetails error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
