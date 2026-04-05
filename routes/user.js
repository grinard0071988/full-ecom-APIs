const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllUsers,
  createUser,
  loginUser,
  profile,
  updateUser,
  removeUser,
  userById,
} = require("../controllers/user.js");
const {
  registerValidator,
  updateValidator,
} = require("../middleware/userValidator.js");
const validate = require("../middleware/validate.js");
const admin = require("../middleware/admin.js");

router.get("/", getAllUsers);
router.post("/register", registerValidator, validate, createUser);
router.post("/login", loginUser);
router.get("/profile", auth, profile);
router.get("/:id", userById);
router.put("/:id", updateValidator, validate, updateUser);
router.delete("/:id", auth, admin, removeUser);

module.exports = router;
