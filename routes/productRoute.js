const express = require("express");
const { createProduct, getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);
router.get("/getallproducts", protect, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/delete/:id", protect, deleteProduct);
router.patch("/update/:id", protect, upload.single("image"), updateProduct);

module.exports = router;