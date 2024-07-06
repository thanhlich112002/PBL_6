const Voucher = require("../models/voucher");
const Store = require("../models/store");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const moment = require("moment");
class voucherController {
  createVoucher = catchAsync(async (req, res, next) => {
    req.body.conditions.startDate = new Date(req.body.conditions.startDate);
    req.body.conditions.endDate = new Date(req.body.conditions.endDate);
    req.body.conditions.endDate.setDate(
      req.body.conditions.endDate.getDate() + 1
    );
    const voucher = await Voucher.create(req.body);
    const store = await Store.findOneAndUpdate(
      {
        ownerId: req.user._id,
      },
      { $push: { vouchers: voucher._id } },
      { new: true }
    );

    if (!store) return next(new appError("Không tìm thấy cửa hàng", 404));

    res.status(201).json({
      message: "success",
      data: voucher,
    });
  });
  getAllVouchersByStoreId = catchAsync(async (req, res, next) => {
    const exp = await Voucher.find();
    let data = await Store.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.storeId),
        },
      },
      {
        $project: {
          vouchers: 1,
        },
      },
      { $unwind: "$vouchers" },
      {
        $lookup: {
          from: "vouchers",
          localField: "vouchers",
          foreignField: "_id",
          as: "vouchers",
        },
      },
      { $unwind: "$vouchers" },
      {
        $match: {
          "vouchers.isAvailable": true,
        },
      },
      {
        $group: {
          _id: "$_id",
          vouchers: { $push: "$vouchers" },
        },
      },
    ]);
    // if (data == []) return next(new appError("Không tìm thấy cửa hàng", 404));
    let length = data[0] ? data[0].vouchers.length : 0;
    data = data[0] ? data[0].vouchers : [];
    res.status(200).json({
      message: "success",
      length,
      data,
    });
  });
  getAllVouchersByOwnerId = catchAsync(async (req, res, next) => {
    const exp = await Voucher.find();
    let data = await Store.aggregate([
      {
        $match: {
          ownerId: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $project: {
          vouchers: 1,
        },
      },
      { $unwind: "$vouchers" },
      {
        $lookup: {
          from: "vouchers",
          localField: "vouchers",
          foreignField: "_id",
          as: "vouchers",
        },
      },
      { $unwind: "$vouchers" },
      {
        $addFields: {
          "vouchers.numUsers": { $size: "$vouchers.user" },
        },
      },
      {
        $group: {
          _id: "$_id",
          vouchers: { $push: "$vouchers" },
        },
      },
    ]);
    let length = data[0] ? data[0].vouchers.length : 0;
    data = data[0] ? data[0].vouchers : [];
    res.status(200).json({
      message: "success",
      length,
      data,
    });
  });
  getVoucher = catchAsync(async (req, res, next) => {
    let data = await Voucher.findById(req.params.id);
    if (!data) return next(new appError("Không tìm thấy mã giảm giá", 404));
    res.status(200).json({
      message: "success",
      data,
    });
  });
  useVoucher = catchAsync(async (req, res, next) => {
    const obj = {
      userId: mongoose.Types.ObjectId(req.user._id),
      orderId: mongoose.Types.ObjectId(req.params.orderId),
    };

    const data = await Voucher.findByIdAndUpdate(
      req.params.id,
      { $push: { user: obj } },
      { new: true }
    );
    if (!data) return next(new appError("Không tìm thấy mã giảm giá", 404));
    res.status(200).json({
      message: "success",
      data,
    });
  });
  checkUser = catchAsync(async (req, res, next) => {
    const data = await Voucher.findById(req.params.id);
    if (!data) return next(new appError("Không tìm thấy mã giảm giá", 404));
    const user = data.user.map((user) => user.userId);
    if (user.includes(req.user._id))
      return next(new appError("Khách hàng đã dùng mã này", 404));
    console.log(user);
    req.voucher = data;
    next();
  });
  hideVoucher = catchAsync(async (req, res, next) => {
    const data = await Voucher.findByIdAndUpdate(
      req.params.id,
      {
        isAvailable: false,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "success",
      data,
    });
  });
  refund = catchAsync(async (req, res, next) => {
    await this.refundVoucher(req.params.orderId);
    res.status(200).json({ status: "success" });
  });
  async refundVoucher(orderId) {
    const voucher = await Voucher.findOne({
      "user.orderId": mongoose.Types.ObjectId(orderId),
    });
    if (voucher) {
      voucher.user = voucher.user.filter(
        (el) => el.orderId.toString() != orderId
      );
      // voucher.expireAt = moment()
      //   .add(7, "hours")
      //   .add(1, "day")
      //   .toDate();
      await voucher.save();
      // console.log(voucher.user);
    }
  }
}

module.exports = new voucherController();
