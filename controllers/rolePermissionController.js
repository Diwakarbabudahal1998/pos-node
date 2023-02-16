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
    console.log(req.body)
    req.map((index, element) => {
        RolePermission.create({
            role_name: index.role_name,
            permission_name: index.permission_name
        })
    })

});
module.exports = {
    getPermissions,
    createRolePermission
};