const Shipper = require("../models/shipper");
const handleController = require("./handleController");
const authController = require("./authController");
const catchAsync = require("../utils/catchAsync");
const fileUploader = require("../utils/uploadImage");
const appError = require("../utils/appError");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary").v2;
const Order = require("../models/order");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
exports.signUpShipper = authController.signUp(Shipper, "Shipper");
exports.verifiedSignUp = authController.verifiedSignUp(Shipper);
exports.sendEmailVerify = authController.sendEmailVerify;

exports.getShipperById = handleController.getOne(Shipper);

exports.deleteShipper = handleController.delOne(Shipper);
exports.getAllShipper = catchAsync(async (req, res, next) => {
  // const shippers = await Shipper.find().select("+isAccepted +isVerified");
  let obj = {
    isAccepted: true,
    isVerified: true,
  };
  const features = new ApiFeatures(
    Shipper.find(obj).select("+isVerified"),
    req.query
  )
    .search()
    .limitFields()
    .paginate();
  const shippers = await features.query;
  return res.status(200).json({
    length: shippers.length,
    data: shippers,
  });
});

exports.uploadShipperImages = fileUploader.fields([
  { name: "frontImageCCCD", maxCount: 1 },
  { name: "behindImageCCCD", maxCount: 1 },
  { name: "licenseImage", maxCount: 1 },
  { name: "vehicleLicense", maxCount: 1 },
]);

exports.updatePhoto = fileUploader.single("photo");

exports.updateShipper = catchAsync(async (req, res, next) => {
  const shipper = await Shipper.findById({ _id: req.params.id });
  if (!shipper) {
    return next(new appError("No document found with that ID", 404));
  }
  const body = {
    ...req.body,
    photo: req.file ? req.file.path : shipper.photo,
  };
  try {
    const doc = await Shipper.findByIdAndUpdate({ _id: req.params.id }, body, {
      new: true,
      runValidators: true,
    });
    console.log(body);
    let parts = shipper.photo.split("/");
    let id =
      parts.slice(parts.length - 2, parts.length - 1).join("/") +
      "/" +
      parts[parts.length - 1].split(".")[0];
    cloudinary.uploader.destroy(id);
    res.status(200).json({
      data: doc,
    });
  } catch (err) {
    if (req.file) {
      cloudinary.uploader.destroy(req.file.filename);
    }
    next(err);
  }
});
exports.setCoordinates = catchAsync(async (req, res, next) => {
  const { id, lat, lng } = req.params;

  const coordinates = [parseFloat(lat), parseFloat(lng)];

  const shipper = await Shipper.findByIdAndUpdate(
    id,
    {
      $set: {
        location: {
          type: "Point",
          coordinates: coordinates,
        },
      },
    },
    { new: true }
  );

  if (!shipper) return next(new appError("Không tìm thấy shipper", 404));
  res.status(200).json({
    status: "success",
    data: shipper,
  });
});
exports.lockShipper = catchAsync(async (req, res, next) => {
  const shipper = await Shipper.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!shipper) return next(new appError("Không tìm thấy shipper", 404));
  res.status(200).json({
    status: "success",
    data: shipper,
  });
});
// find Orders near by Shipper < maxDistance
exports.findOrdersNearByShipper = catchAsync(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const shipper = await Shipper.findById(req.params.id);
  const coordinates = shipper.location.coordinates.reverse();
  const order = await Order.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates,
        },
        key: "storeLocation",
        maxDistance: process.env.maxDistance * 1000,
        distanceField: "dist.calculated",
        query: { status: "Waiting" },
        spherical: true,
      },
    },
    {
      $lookup: {
        from: "contacts",
        localField: "contact",
        foreignField: "_id",
        as: "userLocation",
      },
    },
    {
      $unwind: "$userLocation",
    },
    {
      $project: {
        _id: 1,
        status: 1,
        storeLocation: {
          coordinates: { $reverseArray: "$storeLocation.coordinates" },
        },
        dist: "$dist.calculated",
        userLocation: {
          coordinates: "$userLocation.location.coordinates",
        },
      },
    },
    {
      $sort: {
        "dist.calculated": 1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);
  res.status(200).json({
    status: "success",
    length: order.length,
    data: order,
  });
});
exports.getOrdersDaily = catchAsync(async (req, res, next) => {
  const shipper = await Shipper.findById(req.params.id);
  if (!shipper) return next(new appError("Không tìm thấy shipper", 404));
  const now = moment().format("YYYY-MM-DD");
  const lastWeek = moment().subtract(req.query.limit || 5, "days");
  const daily = [];

  while (lastWeek.isSameOrBefore(now, "day")) {
    let data = await this.getOrderOneDate(shipper._id, lastWeek.toDate());
    daily.push({
      date: lastWeek.format("YYYY-MM-DD"),
      revenue: data ? data.revenue : 0,
      count: data ? data.count : 0,
    });
    lastWeek.add(1, "day");
  }
  res.status(200).json({
    status: "success",
    data: daily,
  });
});
exports.getOrdersWeekly = catchAsync(async (req, res, next) => {
  const shipper = await Shipper.findById(req.params.id);
  if (!shipper) return next(new appError("Không tìm thấy shipper", 404));

  const now = moment().endOf("week");
  const last = moment()
    .subtract(req.query.limit || 5, "weeks")
    .endOf("week");

  const weekly = [];
  let currentWeek = moment(last);

  while (currentWeek.isSameOrBefore(now, "week")) {
    const data = await this.getOrderOneWeek(shipper._id, currentWeek.toDate());
    weekly.push({
      date: currentWeek.format("YYYY-MM-DD"),
      revenue: data ? data.revenue : 0,
      count: data ? data.count : 0,
    });
    currentWeek.add(1, "week");
  }

  res.status(200).json({
    status: "success",
    data: weekly,
  });
});
exports.getOrdersMonthly = catchAsync(async (req, res, next) => {
  const shipper = await Shipper.findById(req.params.id);
  if (!shipper) return next(new appError("Không tìm thấy shipper", 404));

  const now = moment().startOf("month");
  const last = moment()
    .subtract(req.query.limit || 5, "months")
    .startOf("month");

  const monthly = [];
  let currentMonth = moment(last);

  while (currentMonth.isSameOrBefore(now, "month")) {
    const data = await this.getOrderOneMonth(
      shipper._id,
      currentMonth.toDate()
    );
    monthly.push({
      date: currentMonth.endOf("month").format("YYYY-MM-DD"),
      revenue: data ? data.revenue : 0,
      count: data ? data.count : 0,
    });
    currentMonth.add(1, "month");
  }
  res.status(200).json({
    status: "success",
    data: monthly,
  });
});
exports.getOrderOneDate = async function(id, date) {
  const startOfDay = moment(date)
    .startOf("day")
    .add(process.env.UTC, "hours")
    .toDate();
  const endOfDay = moment(date)
    .endOf("day")
    .add(process.env.UTC, "hours")
    .toDate();
  const data = await Order.aggregate([
    {
      $match: {
        shipper: mongoose.Types.ObjectId(id),
        dateOrdered: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $project: {
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
    {
      $group: {
        _id: null,
        revenue: { $sum: "$revenue" },
        count: { $sum: 1 },
      },
    },
  ]);
  return data[0];
};
exports.getOrderOneWeek = async function(id, date) {
  const startOfWeek = moment(date)
    .startOf("week")
    .startOf("day")
    .add(process.env.UTC, "hours")
    .toDate();
  const endOfWeek = moment(date)
    .endOf("week")
    .endOf("day")
    .add(process.env.UTC, "hours")
    .toDate();
  const data = await Order.aggregate([
    {
      $match: {
        shipper: mongoose.Types.ObjectId(id),
        dateOrdered: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      },
    },
    {
      $project: {
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
    {
      $group: {
        _id: null,
        revenue: { $sum: "$revenue" },
        count: { $sum: 1 },
      },
    },
  ]);
  return data[0];
};
exports.getOrderOneMonth = async function(id, date) {
  const startOfMonth = moment(date)
    .startOf("month")
    .startOf("day")
    .add(process.env.UTC, "hours")
    .toDate();
  const endOfMonth = moment(date)
    .endOf("month")
    .endOf("day")
    .add(process.env.UTC, "hours")
    .toDate();

  const data = await Order.aggregate([
    {
      $match: {
        shipper: mongoose.Types.ObjectId(id),
        dateOrdered: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $project: {
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
    {
      $group: {
        _id: null,
        revenue: { $sum: "$revenue" },
        count: { $sum: 1 },
      },
    },
  ]);
  return data[0];
};
