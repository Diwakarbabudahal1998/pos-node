const express = require("express");
const router = express.Router();
const { getPermissions } = require("../controllers/rolePermissionController");
router.get("/permissions", getPermissions);
module.exports = router;