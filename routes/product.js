const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const productController = require("../controllers/product");

router.get("/", productController.getAllProducts);
router.post("/add", upload.single("img"), productController.createProduct);
router.get("/:id", productController.productById);
// router.put("/:id", productController.updateProduct);
router.put("/:id", upload.single("img"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
