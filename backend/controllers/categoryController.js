const catchAsync = require("../utils/catchAsync");
const handleController = require("./handleController");
const Category = require("../models/category");
const Product = require("../models/product");
const Store = require("../models/store");
const fileUploader = require("../utils/uploadImage");
const cloudinary = require("cloudinary").v2;

class categoryController {
  getAllCategory = handleController.getAll(Category);
  addCategory = catchAsync(async (req, res, next) => {
    try {
      const doc = await Category.create({
        ...req.body,
        photo: req.file.path,
      });
      res.status(200).json({
        data: doc,
      });
    } catch (err) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename);
      }
      next(err);
    }
  });
  // Get all categories by Store
  getAllCategoryByStoreId = catchAsync(async (req, res, next) => {
    const products = await Product.find({ storeId: req.params.id });
    const catNames = [
      ...new Set(products.map((product) => product.category.catName)),
    ];
    const categories = await Category.find({ catName: { $in: catNames } });

    res.status(200).json({
      status: "success",
      length: categories.length,
      data: categories,
    });
  });
  getAllCategoryByOwnerId = catchAsync(async (req, res, next) => {
    const store = await Store.findOne({ ownerId: req.params.id });
    const products = await Product.find({ storeId: store._id });
    const catNames = [
      ...new Set(products.map((product) => product.category.catName)),
    ];
    const categories = await Category.find({ catName: { $in: catNames } });

    res.status(200).json({
      status: "success",
      length: categories.length,
      data: categories,
    });
  });
  uploadCategoryImage = fileUploader.single("photo");
}

module.exports = new categoryController();
