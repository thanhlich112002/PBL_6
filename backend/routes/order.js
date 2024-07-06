var express = require("express");
var router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
router.get("/after-checkout/payment", orderController.payment);
router.use(authController.protect);
router.post(
  "/user/:userId/store/:storeId",
  authController.restrict("User"),
  orderController.placeOrder
);
router.get(
  "/:id",
  authController.restrict("Owner", "Shipper", "User"),
  orderController.viewOrder
);
router.get(
  "/owner/:ownerId",
  authController.restrict("Owner"),
  orderController.refuseOrderWhenTimeOut,
  orderController.getOrdersByOwnerId
);
router.get(
  "/user/:userId",
  authController.restrict("User"),
  orderController.refuseOrderWhenTimeOut,
  orderController.getOrdersByUserId
);
router.get(
  "/shipper/:shipperId",
  authController.restrict("Shipper"),
  orderController.refuseOrderWhenTimeOut,
  orderController.getOrdersByShipperId
);
router.put(
  "/:id/cancel",
  authController.restrict("User"),
  orderController.cancelOrder
);
router.put(
  "/:id/shipper/:shipperId",
  authController.restrict("Shipper"),
  orderController.changeStatus
);
router.post(
  "/:orderId/store/:storeId/notice",
  authController.restrict("Owner"),
  orderController.notice
);
module.exports = router;
