const Contact = require("../models/contact");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const Store = require("../models/store");
const User = require("../models/userModel");
const Shipper = require("../models/shipper");
const catchAsync = require("../utils/catchAsync");
const mapUtils = require("../utils/mapUtils");
const appError = require("../utils/appError");
const ApiFeatures = require("../utils/ApiFeatures");
const request = require("request");
const moment = require("moment");
const mongoose = require("mongoose");
const crypto = require("crypto");
const firebase = require("../utils/firebase");
const voucherController = require("./voucherController");
require("dotenv").config();
process.env.TZ = "Asia/Ho_Chi_Minh";
class orderController {
  placeOrder = catchAsync(async (req, res, next) => {
    const { userId, storeId } = req.params;
    const { shipCost, cart, totalPrice, contact } = req.body;
    const order = await Order.create({
      user: userId,
      store: storeId,
      cart,
      totalPrice,
      shipCost,
      contact,
      status: "Pending",
      dateOrdered: new Date(Date.now() + process.env.UTC * 60 * 60 * 1000),
    });
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let env = process.env;

    let tmnCode = env.vnp_TmnCode;
    let secretKey = env.vnp_HashSecret;
    let vnpUrl = env.vnp_Url;
    let returnUrl = env.vnp_ReturnUrl;
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = order._id;
    vnp_Params["vnp_OrderInfo"] = `Thanh toan cho mã đơn hàng:${order._id}`;
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Amount"] = order.totalPrice * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = "VNBANK";

    vnp_Params = sortObject(vnp_Params);
    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({
      status: "success",
      data: order,
      url: vnpUrl,
    });
  });

  // after check out, system create transaction
  payment = catchAsync(async (req, res, next) => {
    const vnp_Params = req.query;
    const transaction = await Transaction.findOne({
      vnp_TxnRef: vnp_Params.vnp_TxnRef,
    });
    if (req.query.vnp_TransactionStatus != "00") {
      await Order.findByIdAndDelete(req.query.vnp_TxnRef);
      return next(new appError("Thanh toán không thành công!"), 404);
    }
    if (!transaction) await Transaction.create(vnp_Params);
    let order = await Order.findById(vnp_Params.vnp_TxnRef);
    if (order.status == "Pending") {
      order.status = "Waiting";
      order.dateCheckout = new Date(
        Date.now() + process.env.UTC * 60 * 60 * 1000
      );
    }
    await order.save();
    res.status(200).json({
      status: "success",
      data: vnp_Params,
    });
  });
  viewOrder = catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    const order = await Order.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "store",
          foreignField: "_id",
          as: "store",
        },
      },
      {
        $unwind: "$store",
      },
      {
        $lookup: {
          from: "contacts",
          localField: "contact",
          foreignField: "_id",
          as: "contact",
        },
      },
      {
        $unwind: "$contact",
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "users",
          localField: "shipper",
          foreignField: "_id",
          as: "shipper",
        },
      },
      {
        $unwind: {
          path: "$shipper",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: "$cart",
      },
      {
        $lookup: {
          from: "products",
          localField: "cart.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $addFields: {
          "cart.product.name": "$product.name",
          "cart.product._id": "$product._id",
          "cart.product.images": "$product.images",
          "cart.product.ratingsAverage": "$product.ratingsAverage",
        },
      },
      {
        $group: {
          _id: "$_id",
          cart: { $push: "$cart" },
          storeLocation: { $first: "$storeLocation" },
          shipCost: { $first: "$shipCost" },
          totalPrice: { $first: "$totalPrice" },
          status: { $first: "$status" },
          user: { $first: "$user" },
          store: { $first: "$store" },
          contact: { $first: "$contact" },
          dateOrdered: { $first: "$dateOrdered" },
          dateCheckout: { $first: "$dateCheckout" },
          datePrepared: { $first: "$datePrepared" },
          shipper: { $first: "$shipper" },
          dateDeliveried: { $first: "$dateDeliveried" },
          dateFinished: { $first: "$dateFinished" },
          dateRefused: { $first: "$dateRefused" },
          dateCancelled: { $first: "$dateCancelled" },
        },
      },
      {
        $project: {
          product: 1,
          storeLocation: {
            coordinates: { $reverseArray: "$storeLocation.coordinates" },
          },
          shipCost: 1,
          totalPrice: 1,
          status: 1,
          user: {
            email: 1,
            firstName: 1,
            lastName: 1,
          },
          store: {
            _id: 1,
            name: 1,
            address: 1,
            image: 1,
          },
          shipper: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            contact: {
              phoneNumber: 1,
            },
            photo: 1,
            ratingAverage: 1,
            vehicleNumber: 1,
            vehicleType: 1,
          },
          cart: {
            quantity: 1,
            _id: 1,
            images: 1,
            price: 1,
            name: 1,
            ratingsAverage: 1,
          },
          cart: 1,
          contact: 1,
          dateOrdered: 1,
          dateCancelled: 1,
          dateCheckout: 1,
          datePrepared: 1,
          dateDeliveried: 1,
          dateFinished: 1,
          dateRefused: 1,
          depreciationShip: {
            $cond: {
              if: {
                $in: ["$status", ["Cancelled", "Refused"]],
              },
              then: "$shipCost",
              else: {
                $multiply: ["$shipCost", process.env.percentShipper / 100],
              },
            },
          },
          revenue: {
            $cond: {
              if: {
                $in: ["$status", ["Cancelled", "Refused"]],
              },
              then: 0,
              else: {
                $multiply: ["$shipCost", 1 - process.env.percentShipper / 100],
              },
            },
          },
        },
      },
    ]);
    if (order[0] == null)
      return next(new appError("Không tìm thấy đơn hàng"), 404);
    res.status(200).json({
      status: "success",
      data: order[0],
    });
  });
  // refuse order when time out
  refuseOrderWhenTimeOut = catchAsync(async (req, res, next) => {
    const orders = await Order.find();
    if (orders) {
      for (let order of orders) {
        let t = (Date.now() - order.createdAt) / 60000;
        if (order.status == "Waiting" && t > process.env.time_refused) {
          order.status = "Refused";
          let dateOrdered = new Date(order.dateOrdered);
          order.dateRefused = new Date(
            dateOrdered.getTime() + process.env.time_refused * 1000 * 60
          );
          await this.refundOrder(req, order._id, next);
          await voucherController.refundVoucher(order._id);
          await order.save();
        }
        if (order.status == "Pending" && t > process.env.time_refused)
          await Order.findByIdAndDelete(order._id);
      }
    }
    next();
  });
  // Cancel order
  cancelOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (order.status != "Waiting")
      return next(new appError("Không thể huỷ đơn hàng!", 404));
    order.status = "Cancelled";
    order.dateCancelled = new Date(
      Date.now() + process.env.UTC * 60 * 60 * 1000
    );
    await this.refundOrder(req, order._id, next);
    await order.save();
    res.status(200).json({ status: "success", data: order });
  });
  refund = catchAsync(async (req, res, next) => {
    await this.refundOrder(req, req.params.id, next);
    res.status(200).json({ status: "success" });
  });
  changeStatus = catchAsync(async (req, res, next) => {
    const { id, shipperId } = req.params;
    const order = await Order.findById(id);
    if (!order) return next(new appError("Không tìm thấy đơn hàng"), 404);
    let message;
    if (order.shipper != shipperId && order.shipper)
      return next(new appError("Đã xuất hiện lỗi khi giao hàng"), 404);

    switch (order.status) {
      case "Waiting":
        // when shipper confirmed order and store prepare
        order.shipper = shipperId;
        order.status = "Preparing";
        order.datePrepared = new Date(
          Date.now() + process.env.UTC * 60 * 60 * 1000
        );
        message = "Shipper has confirmed the delivery";
        console.log(order.store);
        console.log(order._id);
        await firebase.notify(`${order.store}`, `${order._id}`);
        break;
      case "Preparing":
        // when shipper delivery order
        order.status = "Delivering";
        order.dateDeliveried = new Date(
          Date.now() + process.env.UTC * 60 * 60 * 1000
        );
        message = "Shipper is delivering the order";
        break;

      case "Delivering":
        // when shipper deliveried
        order.status = "Finished";
        order.dateFinished = new Date(
          Date.now() + process.env.UTC * 60 * 60 * 1000
        );
        message = "Shipper has successfully delivered the order";
        break;
    }
    await order.save();
    return res.status(200).json({
      success: "success",
      message,
      data: order,
    });
  });
  async refundOrder(req, id, next) {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const transaction = await Transaction.findOne({
      vnp_TxnRef: `${id}`,
    });
    if (!transaction) return next(new appError("Không tìm thấy đơn hàng"), 404);
    let date = new Date();

    let vnp_TmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnp_Api = process.env.vnp_Api;

    let vnp_TxnRef = transaction.vnp_TxnRef;
    let vnp_TransactionDate = transaction.vnp_PayDate;
    let vnp_Amount = transaction.vnp_Amount;
    let vnp_TransactionType = "02";
    let vnp_CreateBy = "Falth";

    let currCode = "VND";

    let vnp_RequestId = moment(date).format("HHmmss");
    let vnp_Version = "2.1.0";
    let vnp_Command = "refund";
    let vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef;

    let vnp_IpAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    let vnp_TransactionNo = "0";

    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TransactionType +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_Amount +
      "|" +
      vnp_TransactionNo +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateBy +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac
      .update(new Buffer.from(data, "utf-8"))
      .digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    request(
      {
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj,
      },
      function(error, response, body) {
        if (error) {
          return next(new appError("Xuất hiện lỗi hoàn tiền", 404));
        }
      }
    );
    // res.status(200).json({
    //   status: "success",
    //   data: transaction,
    // });
  }

  getOrdersByOwnerId = catchAsync(async (req, res, next) => {
    const store = await Store.findOne({ ownerId: req.params.ownerId });
    if (!store) return next(new appError("Không tìm thấy cửa hàng"), 404);
    const limit = +req.query.limit || 10;
    const page = +req.query.page || 1;

    let start, end;

    if (!req.query.start)
      start = moment()
        .subtract(30, "days")
        .add(process.env.UTC, "hours")
        .toDate();
    else
      start = moment(req.query.start, "DD-MM-YYYY")
        .add(process.env.UTC, "hours")
        .toDate();

    if (!req.query.end)
      end = moment()
        .add(process.env.UTC, "hours")
        .toDate();
    else
      end = moment(req.query.end, "DD-MM-YYYY")
        .add(31, "hours")
        .toDate();
    let obj = {
      store: store._id,
      dateOrdered: {
        $gte: start,
        $lt: end,
      },
    };
    if (req.query.status)
      obj = {
        ...obj,
        status: req.query.status,
      };

    const orders = await Order.aggregate([
      {
        $match: obj,
      },
      {
        $project: {
          status: 1,
          dateOrdered: 1,
          orderCost: { $subtract: ["$totalPrice", "$shipCost"] },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          status: 1,
          dateOrdered: 1,
          orderCost: 1,
          depreciation: {
            $cond: {
              if: {
                $in: ["$status", ["Cancelled", "Refused"]],
              },
              then: "$orderCost",
              else: {
                $multiply: ["$orderCost", process.env.percentStore / 100],
              },
            },
          },
          revenue: {
            $cond: {
              if: {
                $in: ["$status", ["Cancelled", "Refused"]],
              },
              then: 0,
              else: {
                $multiply: ["$orderCost", 1 - process.env.percentStore / 100],
              },
            },
          },
        },
      },
      {
        $sort: {
          dateOrdered: -1,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      length: orders.length,
      data: orders,
    });
  });

  getOrdersByUserId = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user) return next(new appError("Không tìm thấy người dùng"), 404);
    let start, end;

    if (!req.query.start)
      start = moment()
        .subtract(30, "days")
        .add(process.env.UTC, "hours")
        .toDate();
    else
      start = moment(req.query.start, "DD-MM-YYYY")
        .add(process.env.UTC, "hours")
        .toDate();

    if (!req.query.end)
      end = moment()
        .add(process.env.UTC, "hours")
        .toDate();
    else
      end = moment(req.query.end, "DD-MM-YYYY")
        .add(31, "hours")
        .toDate(); // process.env.UTC + 24 hours
    let obj = {
      user: req.params.userId,
      dateOrdered: {
        $gte: start,
        $lt: end,
      },
    };
    if (req.query.status)
      obj = {
        ...obj,
        status: req.query.status,
      };
    const features = new ApiFeatures(
      Order.find(obj)
        .populate({
          path: "store",
          select:
            "-location -rating -isLocked -openAt -closeAt -description -ownerId -registrationLicense -createdAt -updatedAt -__v",
        })
        .populate({
          path: "shipper",
          select:
            "-status -isAccepted -ratingsAverage -ratingsQuantity -role -isVerified -__t -password -vehicleNumber -vehicleType -licenseNumber -__v -contact -defaultContact -frontImageCCCD -behindImageCCCD -licenseImage -createdAt -updatedAt -__v -rating -email -vehicleLicense -location",
        }),
      req.query
    )
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query;
    res.status(200).json({
      status: "success",
      length: orders.length,
      data: orders,
    });
  });
  getOrdersByShipperId = catchAsync(async (req, res, next) => {
    const shipper = await Shipper.findById(req.params.shipperId);
    if (!shipper) return next(new appError("Không tìm thấy người dùng"), 404);
    let start, end;
    if (!req.query.start)
      start = moment()
        .subtract(30, "days")
        .add(process.env.UTC, "hours")
        .toDate();
    else
      start = moment(req.query.start, "DD-MM-YYYY")
        .add(process.env.UTC, "hours")
        .toDate();

    if (!req.query.end)
      end = moment()
        .add(process.env.UTC, "hours")
        .toDate();
    else
      end = moment(req.query.end, "DD-MM-YYYY")
        .add(31, "hours")
        .toDate(); // process.env.UTC + 24 hours
    let obj = {
      shipper: req.params.shipperId,
      dateOrdered: {
        $gte: start,
        $lt: end,
      },
    };
    if (req.query.status)
      obj = {
        ...obj,
        status: req.query.status,
      };
    const features = new ApiFeatures(
      Order.find(obj)
        .populate({
          path: "store",
          select:
            "-location -rating -isLocked -openAt -closeAt -description -ownerId -registrationLicense -createdAt -updatedAt -__v",
        })
        .populate({
          path: "shipper",
          select:
            "-status -isAccepted -ratingsAverage -ratingsQuantity -role -isVerified -__t -password -vehicleNumber -vehicleType -licenseNumber -__v -contact -defaultContact -frontImageCCCD -behindImageCCCD -licenseImage -createdAt -updatedAt -__v -rating -email -vehicleLicense -location",
        }),
      req.query
    )
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query;
    res.status(200).json({
      status: "success",
      length: orders.length,
      data: orders,
    });
  });
  notice = catchAsync(async (req, res, next) => {
    await firebase.notify(req.params.storeId, req.params.orderId, true);
    res.status(200).json({ status: "success" });
  });
}
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
module.exports = new orderController();
