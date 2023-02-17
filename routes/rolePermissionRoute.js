const express = require("express");
const router = express.Router();
const { getPermissions, createRolePermission } = require("../controllers/rolePermissionController");
router.get("/get-permissions", getPermissions);
router.post("/create", createRolePermission);

module.exports = router;