const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Running express server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8002;
// route middlewares
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port} for Sibamart App`);
});
