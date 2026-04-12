const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart");

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:id", auth, updateCartItem);
router.delete("/:id", auth, removeCartItem);
router.delete("/", auth, clearCart);

module.exports = router;
