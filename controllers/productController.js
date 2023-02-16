const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");



//Create Product
const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, price, quantity, description, category } = req.body;

    //Validation 
    if (!name || !category || !quantity || !price || !description) {
        res.status(400);
        throw new Error("Please Fill all the required Fields");
    }

    //Handle Image Upload
    let fileData = {};
    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),

        }
    }
    //Create Product
    const product = await Product.create({
        user: req.user.id,
        name,
        price,
        quantity,
        description,
        category,
        sku,
        image: fileData
    });
    res.status(201).json({
        message: "Product Created Successfully",
        product
    })
});


//Get all product
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id }).sort("-createdAt");
    res.status(201).json({
        products
    })
});
//Get Single Product
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product Not found");
    }
    //Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User Not Authorized");
    }
    res.status(200).json({
        product
    });
});
//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product Not found");
    }
    //Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User Not Authorized");
    }
    await product.remove();
    res.status(200).json({
        message: "Successfully deleted"
    });
});
//Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, quantity, description, category } = req.body;
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error("Product Not found");
    }
    //Match product to its user
    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User Not Authorized");
    }
    //Handle Image Upload
    let fileData = {};
    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),

        }
    }
    //Update Product
    const updateProduct = await Product.findByIdAndUpdate({ _id: id }, {
        name,
        price,
        quantity,
        description,
        category,
        // image: Object.keys(fileData).length === 0 ? product?.image : fileData
    },
        {
            new: true,
            runValidators: true
        }
    );
    res.status(200).json({
        message: "Product Updated Successfully",
        updateProduct
    })
});
module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct
}