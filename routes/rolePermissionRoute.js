const express = require("express");
const router = express.Router();
const { getPermissions, createRolePermission } = require("../controllers/rolePermissionController");
const protect = require("../middleware/authMiddleware");
router.get("/get-permissions", protect, getPermissions);
router.post("/create", protect, createRolePermission);

module.exports = router;