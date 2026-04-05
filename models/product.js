const db = require("./database");

exports.findAllProduct = async () => {
  const result = await db.query("SELECT * FROM products");
  return result.rows;
};

exports.createProduct = async ({ name, description, price, img }) => {
  const result = await db.query(
    "INSERT INTO products (name,description,price,img) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, description, price, img],
  );
  return result.rows[0];
};

exports.findProductById = async (id) => {
  const result = await db.query(
    "SELECT id,name,description,price,img FROM products WHERE id =$1",
    [id],
  );
  return result.rows[0];
};
exports.updateProduct = async (id, { name, description, price, img }) => {
  const result = await db.query(
    `UPDATE products 
    SET name=$1,
    description=$2,
    price=$3,
    img=$4 
    WHERE id=$5 RETURNING *`,
    [name, description, price, img, id],
  );
  return result.rows[0];
};

exports.deleteProduct = async (id) => {
  await db.query(`DELETE FROM products WHERE id = $1`, [id]);
};
