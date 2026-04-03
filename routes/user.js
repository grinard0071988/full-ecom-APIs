const express = require("express");
const router = express.Router();
const { getAllUsers, createUser } = require("../controllers/user.js");

router.get("/", getAllUsers);
router.post("/", createUser);

module.exports = router;
