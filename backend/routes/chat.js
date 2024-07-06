var express = require("express");
var router = express.Router();
const chatController = require("../controllers/chatController");
const authController = require("../controllers/authController");
router.use(authController.protect);
router.post("/", chatController.createChat);
router.get("/user/:userId", chatController.findUserChats);
router.get("/:chatId", chatController.findChat);

module.exports = router;
