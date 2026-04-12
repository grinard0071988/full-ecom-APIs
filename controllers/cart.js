const cartModel = require("../models/cart");

exports.getCart = async (req, res) => {
  try {
    const user_id = req.userId;
    if (!user_id) return res.status(401).json({ error: "Unauthorized" });

    const cart = await cartModel.getOrCreateCart(user_id);
    const items = await cartModel.getAllCart(cart.id);

    res.json({ cart_id: cart.id, items });
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const user_id = req.userId;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res
        .status(400)
        .json({ error: "product_id and quantity required" });
    }

    const cart = await cartModel.getOrCreateCart(user_id);
    const item = await cartModel.addItem(cart.id, product_id, quantity);

    res.status(201).json({ message: "Item added", item });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updated = await cartModel.updateItem(id, quantity);

    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item updated", item: updated });
  } catch (err) {
    console.error("updateCartItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await cartModel.removeItem(id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("removeCartItem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user_id = req.userId;

    const cart = await cartModel.getOrCreateCart(user_id);
    await cartModel.clearCart(cart.id);

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
