const db = require("./database");

exports.findAll = async () => {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
};

exports.create = async ({ firstname, lastname, email, password, phone }) => {
  const result = await db.query(
    "INSERT INTO users (firstname,lastname,email,password, phone) VALUES ($1, $2,$3,$4,$5) RETURNING *",
    [firstname, lastname, email, password, phone]
  );
  return result.rows[0];
};
