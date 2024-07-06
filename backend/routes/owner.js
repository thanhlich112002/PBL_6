var express = require("express");
var router = express.Router();
const ownerController = require("../controllers/ownerController");
const authController = require("../controllers/authController");
const contactController = require("../controllers/contactController");
// router.get("/:id", storeController.getStoreById);
// router.get("/", storeController.getAllStore);
// router.put("/:id", storeController.updateStore);
// router.delete("/:id", storeController.deleteStore);
router.route("/").post(
  ownerController.uploadOwnerImages,
  contactController.createContact,
  ownerController.createOwner,
  // ownerController.createStore,
  authController.sendEmailVerify
);

router.post("/:email", ownerController.verifiedSignUp);
// router.use(authController.protect, authController.restrict("Owner"));
router
  .route("/:id")
  .get(contactController.getAllContact, ownerController.getOwnerById)
  .patch(contactController.updateDefaultContact, ownerController.updateOwner);
router.get("/store/:storeId/export-product", ownerController.exportProduct);
router.get("/store/:storeId/export-order", ownerController.exportOrder);
router.get("/:id/best-seller", ownerController.getBestSeller);
router.get("/:id/chart", ownerController.getInfoChart);
router.get("/:id/daily", ownerController.getOrdersDaily);
router.get("/:id/weekly", ownerController.getOrdersWeekly);
router.get("/:id/monthly", ownerController.getOrdersMonthly);
router.get("/:id/revenue-by-cat", ownerController.getRevenueByCat);
module.exports = router;
