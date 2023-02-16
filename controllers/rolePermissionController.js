const asyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");
const getPermissions = asyncHandler(async (req, res) => {
    const permissions = await Permission.all().sort("-createdAt");
    res.status(201).json({
        permissions
    })
});
module.exports = {
    getPermissions,
};