const fs = require("fs");
const path = require("path");
const productModel = require("../models/product");

exports.getAllProducts = async (req, res) => {
  const products = await productModel.findAllProduct();
  res.json(products);
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Multer stores the file info in req.file
    const img = req.file ? req.file.filename : null;

    const product = await productModel.createProduct({
      name,
      description,
      price,
      img,
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.productById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await productModel.findProductById(id);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//     console.error("ERROR:", err);
//   }
// };

exports.productById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await productModel.findProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price } = req.body;

    // New uploaded file (if any)
    const newImg = req.file ? req.file.filename : null;

    // Get existing product to know old image
    const existing = await productModel.findProductById(id);
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If new image uploaded → delete old image
    if (newImg && existing.img) {
      const oldPath = path.join("uploads", existing.img);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Update DB
    const updated = await productModel.updateProduct(id, {
      name,
      description,
      price,
      img: newImg || existing.img,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Get product to know which image to delete
    const product = await productModel.findProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete image file if exists
    if (product.img) {
      const imgPath = path.join("uploads", product.img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    // Delete DB row
    await productModel.deleteProduct(id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
