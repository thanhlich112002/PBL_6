var express = require("express");
var router = express.Router();
const voucherController = require("../controllers/voucherController");
const authController = require("../controllers/authController");
router.route("/store/:storeId").get(voucherController.getAllVouchersByStoreId);
router
  .route("")
  .all(authController.protect, authController.restrict("Owner"))
  .post(voucherController.createVoucher)
  .get(voucherController.getAllVouchersByOwnerId);
router
  .route("/:id")
  .get(voucherController.getVoucher)
  .put(
    authController.protect,
    authController.restrict("Owner"),
    voucherController.hideVoucher
  );
router.route("/:id/order/:orderId").put(
  authController.protect,
  authController.restrict("User"),
  // voucherController.checkUser,
  voucherController.useVoucher
);
router.route("/order/:orderId").put(voucherController.refund);
module.exports = router;
