const mongoose = require("mongoose");
const rolePermissionSchema = mongoose.Schema({

    role_name: {
        type: String,
        required: [true, "Please Name"],
        trim: true,
        unique: true,

    },

    permission_name: [{
        type: String,
        required: [true, "Please Name"],
        trim: true,

    }]
},
    {
        timestamps: true
    }
);
const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);
module.exports = RolePermission;