const mongoose = require("mongoose");
const permissionSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Name"],
        trim: true,
        unique: true,
    }
}, {
    timestamps: true
}
);
const Permission = mongoose.model("Permission", permissionSchema);
module.exports = Permission;