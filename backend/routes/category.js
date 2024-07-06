var express = require("express");
var router = express.Router();
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");
router
  .route("/")
  .get(categoryController.getAllCategory)
  .post(
    authController.protect,
    authController.restrict("Admin", "Owner"),
    categoryController.uploadCategoryImage,
    categoryController.addCategory
  );
router.route("/store/:id").get(categoryController.getAllCategoryByStoreId);
router.route("/owner/:id").get(categoryController.getAllCategoryByOwnerId);

module.exports = router;
