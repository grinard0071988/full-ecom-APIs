const db = require("./database");

exports.findAll = async () => {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
};

exports.create = async ({
  firstname,
  lastname,
  email,
  password,
  phone,
  role = "user",
}) => {
  const result = await db.query(
    "INSERT INTO users (firstname,lastname,email,password, phone,role) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *",
    [firstname, lastname, email, password, phone, role],
  );
  return result.rows[0];
};

exports.findByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email =$1`, [email]);
  return result.rows[0];
};
exports.findById = async (id) => {
  const result = await db.query(
    `SELECT id, firstname, lastname, email,password, phone, date_joined FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

exports.update = async (
  id,
  { firstname, lastname, email, password, phone },
) => {
  const result = await db.query(
    `UPDATE users
     SET firstname = $1,
         lastname = $2,
         email = $3,
         password = $4,
         phone = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING id, firstname, lastname, email, phone, date_joined, updated_at`,
    [firstname, lastname, email, password, phone, id],
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  await db.query(`DELETE FROM users WHERE id = $1`, [id]);
};
