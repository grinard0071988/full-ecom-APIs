const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  checkout,
  getUserOrders,
  getOrderDetails,
} = require("../controllers/order");

router.post("/checkout", auth, checkout);
router.get("/", auth, getUserOrders);
router.get("/:order_id", auth, getOrderDetails);

module.exports = router;
