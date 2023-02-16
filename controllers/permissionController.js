const asyncHandler = require("express-async-handler");
const Permission = require("../models/permissionModel");
const data = require('../utils/permission')
console.log(data)
const createPermission = asyncHandler(async (req, res) => {
    data.forEach(element => {
        console.log(element)
        let newData = Permission.findOneAndUpdate({ name: element.name }, {
            $set: {
                name: element.name
            }
        }, {
            upsert: true,
        });
        // console.log(newData)
        // Permission.create({
        //     name: element.name
        // })
    });

});
module.exports = {
    createPermission,

}
