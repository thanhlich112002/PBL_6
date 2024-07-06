var express = require("express");
var router = express.Router();
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");
router
  .route(":/id")
  .post(contactController.createContact)
  .get(
    authController.protect,
    authController.restrict("User"),
    contactController.getAllContact
  );
router
  .route(":/id")
  .all(authController.protect, authController.restrict("User"))
  .put(contactController.updateContact)
  .delete(contactController.delContact);
module.exports = router;
