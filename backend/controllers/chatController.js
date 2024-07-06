const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
class chatController {
  createChat = catchAsync(async (req, res, next) => {
    const { senderId, receiverId } = req.body;

    const chat = await Chat.findOne({ members: { senderId, receiverId } });

    if (chat) {
      return res.status(200).json(chat);
    }
    const newChat = await Chat.create({
      members: {
        senderId,
        receiverId,
      },
    });
    res.status(201).json(newChat);
  });

  findUserChats = catchAsync(async (req, res, next) => {
    const chats = await Chat.find({ members: { $in: [req.params.userId] } });
    console.log(chats);
    const chatUserData = Promise.all(
      chats.members.map(async (chat) => {
        const receiverId = chat.members.find(
          (member) => member !== req.user._id
        );
        const user = User.findById(receiverId);
        return {
          user: {
            receiverId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.photo,
          },
        };
      })
    );
    console.log(chatUserData);
    res.status(200).json({
      length: chatUserData.length,
      data: chatUserData,
    });
  });

  findChat = catchAsync(async (req, res, next) => {
    const { chatId } = req.params;
    const chat = await Chat.findById({ _id: chatId });
    res.status(200).json(chat);
  });
}

module.exports = new chatController();
