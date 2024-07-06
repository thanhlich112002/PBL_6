var express = require("express");
var router = express.Router();
const favouriteController = require("../controllers/favouriteController");
const authController = require("../controllers/authController");
router
  .route("/:userId/:productId")
  .post(
    authController.protect,
    authController.restrict("User"),
    favouriteController.favourProduct
  );
router
  .route("/user/:userId")
  .get(
    authController.protect,
    authController.restrict("User"),
    favouriteController.getFavouritesByUserId
  );
router
  .route("/product/:productId")
  .get(
    authController.protect,
    authController.restrict("Owner"),
    favouriteController.getFavouritesByProductId
  );
module.exports = router;
