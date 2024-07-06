const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
  name: {
    type: String,
    require: [true, "Tên mã giảm giá là bắt buộc"],
  },
  amount: {
    type: Number,
    require: [true, "Giá tiền giảm là bắt buộc"],
  },
  expireAt: {
    type: Date,
    require: true,
    index: { expires: -7 * 60 * 60 * 1000 },
  },
  // check once user only 1 voucher
  user: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    },
  ],
  conditions: {
    minValues: {
      type: Number,
      require: [true, "Giá tối thiểu là bắt buộc"],
    },
    startDate: {
      type: Date,
      require: [true, "Thời gian bắt đầu là bắt buộc"],
    },
    endDate: {
      type: Date,
      require: [true, "Thời gian kết thúc là bắt buộc"],
    },
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});
voucherSchema.pre("save", async function(next) {
  this.expireAt = this.conditions.endDate;
  next();
});
voucherSchema.pre("find", async function(next) {
  await this.model.deleteMany({
    expireAt: {
      $lt: moment()
        .add(7, "hours")
        .toDate(),
    },
  });
  next();
});
module.exports = mongoose.model("Voucher", voucherSchema);
