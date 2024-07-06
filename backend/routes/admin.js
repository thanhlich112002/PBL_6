var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const shipperController = require("../controllers/shipperController");
const ownerController = require("../controllers/ownerController");
const userController = require("../controllers/userController");
const storeController = require("../controllers/storeController");

router.use(authController.protect, authController.restrict("Admin"));
//Export
router.get("/shipper/export", adminController.exportShippers);
router.get("/user/export", adminController.exportUsers);
router.get("/product/export", adminController.exportAllProducts);
router.get("/store/export", adminController.exportStores);
router.get("/owner/export", adminController.exportOwners);
router.get("/", adminController.getListAllAdmin);
// Manage Shipper
router.get("/shipper/approve", adminController.getListShipperAppove);
router.route("/shipper").get(shipperController.getAllShipper);
router
  .route("/shipper/:id")
  .patch(adminController.appoveShipperAccount)
  .get(shipperController.getShipperById);

// Manage Owner
router.get("/owner/approve", adminController.getListOwnerAppove);
router
  .route("/owner/:id")
  .patch(adminController.appoveOwnerAccount)
  .get(storeController.getStoreByOwnerId);

// Manage Store
router.route("/store").get(storeController.getAllStore);
router.route("/store/:id").get(adminController.getStoreByStoreId);

//Manage Users
router.route("/user").get(userController.getAllUser);

// Statistics
// router.route("/number-user/daily").get(adminController.getNumberUsersDaily);
// router.route("/number-user/weekly").get(adminController.getNumberUsersWeekly);
router.route("/user/monthly").get(adminController.getNumberUsersMonthly);
router.route("/user/quarterly").get(adminController.getNumbersUsersQuarterly);
router.route("/revenue/monthly").get(adminController.getRevenueMonthly);
router.route("/revenue/quarterly").get(adminController.getRevenueQuarterly);

//Exports
module.exports = router;
