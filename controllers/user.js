const userModel = require("../models/user");

exports.getAllUsers = async (req, res) => {
  const users = await userModel.findAll();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const newUser = await userModel.create(req.body);
  res.status(201).json(newUser);
};
