var express = require("express");
const router = express.Router({ mergeParams: true });
const ratingController = require("../controllers/ratingController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrict("User"),
    ratingController.updatePhoto,
    ratingController.ratingForShipper
  )
  .get(ratingController.getAllRatings);
router
  .route("/:id")
  .get(ratingController.getRatingById)
  .patch(
    authController.protect,
    authController.restrict("User"),
    ratingController.updatePhoto,
    ratingController.updateRating
  )
  .delete(
    authController.protect,
    authController.restrict("User", "Admin"),
    ratingController.deleteRating
  );
module.exports = router;
