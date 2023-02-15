const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a Name"]
    },
    email: {
        type: String,
        required: [true, "Please add Email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: [6, "Password must be upto six characters"],
        //maxLength: [23, "Password must not be more than 23 characters"],
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
        type: String,
        default: "9842706856",
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "bio",
    },


}, {
    timestamps: true
});


//Encrypt Password before saving to db
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;