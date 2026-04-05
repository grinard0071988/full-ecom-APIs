const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

exports.getAllUsers = async (req, res) => {
  const users = await userModel.findAll();
  res.json(users);
};

exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      firstname,
      lastname,
      email,
      password: hashedPwd,
      phone,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.userById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
    console.error("ERROR:", err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await userModel.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }
    const { firstname, lastname, email, password, phone } = req.body;
    // Check if email is being changed and if it's already taken
    if (email && email !== existing.email) {
      const emailExists = await userModel.findByEmail(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }
    // Use existing values if new ones aren't provided
    const updatedData = {
      firstname: firstname ?? existing.firstname,
      lastname: lastname ?? existing.lastname,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      password: existing.password,
    };
    // Hash new password if provided
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    const updated = await userModel.update(id, updatedData);
    res.json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
    console.error("ERROR:", err);
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await userModel.findById(id);
    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    await userModel.remove(id);

    res.json({ message: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
    console.error("ERROR:", err);
  }
};
