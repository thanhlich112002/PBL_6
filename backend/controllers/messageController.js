const Message = require("../models/messageModel");
const catchAsync = require("../utils/catchAsync");
class messageController {
  createMessage = catchAsync(async (req, res, next) => {
    const { text, chatId } = req.body;
    const senderId = req.user.id;
    const newMessage = await Message.create({
      text,
      senderId,
      chatId,
    });
    res.status(201).json(newMessage);
  });

  getMessage = catchAsync(async (req, res, next) => {
    const { chatId } = req.params;
    const message = await Message.find({ chatId });
    res.status(200).json(message);
  });
}

module.exports = new messageController();
