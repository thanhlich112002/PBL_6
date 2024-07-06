const mongoose = require("mongoose");
const User = require("./userModel");
const ownerSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, "Tên ngân hàng là bắt buộc"],
  },
  bankNumber: {
    type: String,
    required: [true, "Số tài khoản là bắt buộc"],
  },
  frontImageCCCD: {
    type: String,
    required: [true, "Phía trước CCCD là bắt buộc"],
    select: false,
  },
  behindImageCCCD: {
    type: String,
    required: [true, "Phía sau CCCD là bắt buộc"],
    select: false,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
});

const Owner = User.discriminator("Owner", ownerSchema);

module.exports = Owner;
