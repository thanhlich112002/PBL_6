var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");
router.route("/:email").post(userController.verifiedUser);
router
  .route("/")
  .post(
    contactController.createContact,
    userController.signUpUser,
    userController.sendEmail
  );

router.use(authController.protect);
router
  .route("/")
  .get(authController.restrict("Admin"), userController.getAllUser);

router
  .route("/:id")
  .get(
    authController.restrict("User", "Owner", "Shipper"),
    contactController.getAllContact,
    userController.getUserById
  )
  .patch(
    authController.restrict("User"),
    contactController.updateDefaultContact,
    userController.updateUser
  )
  .delete(
    authController.restrict("Admin"),
    contactController.delAllContact,
    userController.deleteUser
  );
router.post("/change-pass/:id", userController.changePass);
router.put(
  "/add-contact/:id",
  authController.restrict("User"),
  contactController.addContact,
  userController.addContact
);
router.get(
  "/get-default-contact/:userId",
  authController.restrict("User"),
  userController.getDefaultContact
);
router.delete(
  "/del-contact/:userId/:contactId",
  authController.restrict("User"),
  userController.delContact,
  contactController.delContact
);
router.post(
  "/set-default-contact/:userId/:contactId",
  authController.restrict("User"),
  userController.setDefaultContact
);
router.patch(
  "/:userId/contact/:contactId",
  authController.restrict("User"),
  contactController.updateContact
);
router.get(
  "/:userId/store/:storeId",
  authController.restrict("User"),
  userController.getInfoCart
);
router.patch(
  "/:id/photo",
  authController.restrict("User"),
  userController.updatePhoto,
  userController.updateUserPhoto
);

module.exports = router;
