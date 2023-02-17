const asyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");
const RolePermission = require("../models/rolePermissionModel");
const getPermissions = asyncHandler(async (req, res) => {
    const permissions = await Permission.find({}).sort("-createdAt");
    res.status(201).json({
        permissions
    })
});
const createRolePermission = asyncHandler(async (req, res) => {
    const { role_name, permission_name } = req.body;
    const data = { role_name, permission_name };
    const findRole = await RolePermission.findOne({ role_name: data.role_name })
    if (!findRole) {
        const RolePermissions = await new RolePermission(data).save();
        res.status(200).json({
            message: "Role Permission Created",
            RolePermissions
        })
    } else {
        res.status(409);
        throw new Error("Role Already Exists");
    }

});
module.exports = {
    getPermissions,
    createRolePermission
};