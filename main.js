const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const userRoutes = require("./routes/user");

// Running express server
const app = express();
app.use(cors());
const port = process.env.PORT || 8000;

// route middlewares
app.use("/api", userRoutes);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at http://localhost:${port} for Sibamart App`);
});
