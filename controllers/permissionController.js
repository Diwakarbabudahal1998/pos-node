const asyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");
const data = require('../utils/permission')
const createPermission = asyncHandler(async (req, res) => {
    await Permission.deleteMany();
    data.map((index, element) => {
        let newDate = Permission.findOneAndUpdate(
            { name: index.name },
            { $set: index },
            { upsert: true })
            .then()
            .catch()
    })

});
module.exports = {
    createPermission,

}
