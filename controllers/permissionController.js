const asyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");
const data = require('../utils/permission')
const createPermission = asyncHandler(async (req, res) => {
    await Permission.deleteMany();
    let newData = data.forEach((item, index) => {
        Permission.findOneAndUpdate({ name: item.name }, { $set: item }, { upsert: true })
            .then()
            .catch((err) => {
                console.log(err)
            })
    });
});
module.exports = {
    createPermission
}
