var express = require("express");
var router = express.Router();
const mapController = require("../controllers/mapController");
router.route("/").get(mapController.setAddress);
router.route("/geocode").get(mapController.viewGeoCode);
router.route("/address").get(mapController.viewAddress);
router.route("/distance").get(mapController.viewDistanceAndDuration);
router.route("/store").get(mapController.findStore);
module.exports = router;
