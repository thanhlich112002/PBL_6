var express = require("express");
var router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const ratingRoute = require("../routes/rating");

router.route("/").get(productController.viewProductsByCat);
router.route("/search").get(productController.searchProduct);
router.route("/recommend").get(productController.recommendProduct);
router.route("/:id").get(productController.viewProduct);
router.route("/store/:storeId").get(productController.getAllProductByStoreId);
router.use("/:productId/rating", ratingRoute);
router.use(authController.protect);
router
  .route("/owner/:ownerId")
  .all(authController.restrict("Owner", "User"))
  .get(productController.getAllProductByOwnerId)
  .post(productController.uploadProductImages, productController.addProduct);
router
  .route("/:id")
  .all(authController.restrict("Owner"))
  .delete(productController.deleteProduct)
  .put(productController.uploadProductImages, productController.updateProduct);

router.get(
  "/stat/favor-product/:ownerId",
  authController.restrict("Owner"),
  productController.favorProductQuantity
);
router.get(
  "/stat/no-sale-product/:ownerId",
  authController.restrict("Owner"),
  productController.noSaleProductQuantity
);
router.get(
  "/stat/product-quantity/:ownerId",
  authController.restrict("Owner"),
  productController.productQuantity
);
router.get(
  "/product-by-cat/:ownerId",
  authController.restrict("Owner"),
  productController.getProductByCat
);

module.exports = router;
