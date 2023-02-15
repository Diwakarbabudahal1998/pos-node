const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
//Register User
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Fill all the required Fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password Must be upto 6 characters");
    }
    //Check if user email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("Email already registered");
    }

    //Encrypt Password before saving to db
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const user = await User.create({
        name,
        email,
        password,
    });
    //Generate Token
    const token = generateToken(user._id);
    //Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: "none",
        secure: true,
    });

    //Get the information back after created
    if (user) {
        const { _id, name, email, phone, photo, bio } = user;
        res.status(201).json({
            _id,
            name,
            email,
            phone,
            photo,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid User Data");
    }
});
//Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please Add Email and password");
    }
    //Check if user exist in database
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("User Not found please Sign Up");
    }
    //User Exist ,check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    //Generate Token
    const token = generateToken(user._id);
    //Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: "none",
        secure: true,
    });
    if (user && passwordIsCorrect) {
        const { _id, name, email, phone, photo, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            phone,
            photo,
            bio,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
});

//Logout User
const logout = asyncHandler(async (req, res) => {
    //Send HTTP-only cookie
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,
    });
    return res.status(200).json({
        message: "Successfully Logged Out",
    });
});

//Get user Data

// Get User Data
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
        });
    } else {
        res.status(400);
        throw new Error("User Not Found");
    }
});

//Get Login Status

const loginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true);
    }
    return res.json(false);
});

//Update User
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const { name, email, photo, phone, bio } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});

//Change password
const changePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { oldPassword, password } = req.body;
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }
    //validate
    if (!oldPassword || !password) {
        res.status(400);
        throw new Error("Please add old and new password");
    }
    //Match old password

    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);
    if (user && passwordIsCorrect) {
        user.password = password;
        await user.save();
        res.status(200).send("Password Change Successfully");
    } else {
        res.status(400);
        throw new Error("Old Password Is Incorrect");
    }
});
//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User does not exist");
    }
    //Delete Token If it Exists in DB
    let token = await Token.findOne({ userId: user._id });
    if (token) {
        await token.deleteOne();
    }
    //Create Reset Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    //Hash Token Before Saving To DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    //Save token to DB
    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000), // 30 mins
    }).save();
    //Construct Reset Url

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    //Reset Email
    const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the url below to reset your password</p>
    <p>This reset link is valid for only 30 mins</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    <p>Diwakar Dahal</p>
    `;
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({
            success: true,
            message: "Reset Email Sent",
        });
    } catch (error) {
        res.status(500);
        throw new Error("Email not sent,please try again");
    }
});
//Reset Password

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.params;
    //Hash Token,then compare to Token in DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    //Find Token In DB
    const userToken = await Token.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() },
    });
    if (!userToken) {
        res.status(404);
        throw new Error("Invalid or Expired Token");
    }

    //Find User
    const user = await User.findOne({
        _id: userToken.userId,
    });
    user.password = password;
    await user.save();
    res.status(200).json({
        message: "Password Reset successful please login",
    });
});
module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
};
