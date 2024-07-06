var express = require("express");
var router = express.Router();
const storeController = require("../controllers/storeController");
const authController = require("../controllers/authController");
const ratingRoute = require("../routes/rating");

router.post(
  "/:ownerId",
  storeController.uploadStoreImages,
  storeController.createStore
);

router.get("/owner/:id", storeController.getStoreByOwnerId);
router.get("/:id", storeController.getStoreByStoreId);

router.put(
  "/:ownerId",
  storeController.uploadStoreImages,
  storeController.updateStore
);
router.patch("/lock/:ownerId", storeController.lockStore);
router.get("/city/:name", storeController.getStoreByCity);
router.get("/", storeController.getAllStore);
//Stat
router.get("/stat/category/:ownerId", storeController.mostCategory);
router.get("/stat/order/:ownerId", storeController.order);
router.get("/stat/cus-quantity/:ownerId", storeController.cusQuantity);
router.get("/stat/inc-cus/:ownerId", storeController.increaseCus);
router.get("/stat/cus-quantity-vip/:ownerId", storeController.cusQuantityVip);
// Order
router.get("/order/:ownerId", storeController.getAllOrder);
router.get("/order/:ownerId/:userId", storeController.viewOrder);
router.delete("/order/:ownerId/:userId", storeController.rejectOrder);
router.post("/order/:ownerId/:userId", storeController.acceptOrder);

router.use("/:storeId/rating", ratingRoute);

module.exports = router;
