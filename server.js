const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const path = require('path');
const { createPermission } = require("./controllers/permissionController");
const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);
//Routes
app.get("/", (req, res) => {
    res.send("Home Page");
});
//Error Middleware
app.use(errorHandler);
//Connect to DB and Start server
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            createPermission();
            console.log(`SERVER RUNNING ON PORT ${PORT}`);
        });
    })
    .catch((err) => console.log(err))