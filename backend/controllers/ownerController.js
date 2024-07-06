const Store = require("../models/store");
const Order = require("../models/order");
const handleController = require("./handleController");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");
const Owner = require("../models/owner");
const Product = require("../models/product");
const fileUploader = require("../utils/uploadImage");
const appError = require("../utils/appError");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { Parser } = require("json2csv");

process.env.TZ = "Asia/Ho_Chi_Minh";
moment.updateLocale("en", {
  week: {
    dow: 1,
  },
});
exports.createOwner = authController.signUp(Owner, "Owner");
exports.verifiedSignUp = authController.verifiedSignUp(Owner);
exports.uploadOwnerImages = fileUploader.fields([
  { name: "frontImageCCCD", maxCount: 1 },
  { name: "behindImageCCCD", maxCount: 1 },
]);
exports.updateOwner = catchAsync(async (req, res, next) => {
  const owner = await Owner.findById(req.params.id).populate("contact");
  owner.firstName = req.body.firstName;
  owner.lastName = req.body.lastName;
  owner.bankNumber = req.body.bankNumber;
  owner.bankName = req.body.bankName;
  owner.contact[0] = req.body.contact;
  await owner.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: owner,
  });
});
exports.getOwnerById = handleController.getOne(Owner);

exports.getOrdersDaily = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ ownerId: req.params.id });
  if (!store) return next(appError("Không tìm thấy cửa hàng", 404));
  const now = moment().format("YYYY-MM-DD");
  const lastWeek = moment().subtract(req.query.limit || 5, "days");
  const daily = [];

  while (lastWeek.isSameOrBefore(now, "day")) {
    let data = await this.getOrderOneDate(store._id, lastWeek.toDate());
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
  const store = await Store.findOne({ ownerId: req.params.id });
  if (!store) return next(appError("Không tìm thấy cửa hàng", 404));

  process.env.TZ = "Asia/Ho_Chi_Minh";

  const now = moment().endOf("week");
  const last = moment()
    .subtract(req.query.limit || 5, "weeks")
    .endOf("week");

  const weekly = [];
  let currentWeek = moment(last);

  while (currentWeek.isSameOrBefore(now, "week")) {
    const data = await this.getOrderOneWeek(store._id, currentWeek.toDate());
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
  const store = await Store.findOne({ ownerId: req.params.id });
  if (!store) return next(appError("Không tìm thấy cửa hàng", 404));

  process.env.TZ = "Asia/Ho_Chi_Minh";

  const now = moment().startOf("month");
  const last = moment()
    .subtract(req.query.limit || 5, "months")
    .startOf("month");

  const monthly = [];
  let currentMonth = moment(last);

  while (currentMonth.isSameOrBefore(now, "month")) {
    const data = await this.getOrderOneMonth(store._id, currentMonth.toDate());
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
exports.getInfoChart = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ ownerId: req.params.id });
  if (!store) return next(appError("Không tìm thấy cửa hàng", 404));
  const products = await Order.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId(store._id),
      },
    },
    {
      $project: {
        status: 1,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  if (!products) return next(appError("Không tìm thấy sản phẩm", 404));
  res.status(200).json({
    status: "success",
    length: products.length,
    data: products,
  });
});
exports.getBestSeller = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ ownerId: req.params.id });
  if (!store) return next(appError("Không tìm thấy cửa hàng", 404));
  const products = await Order.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId(store._id),
        status: req.query.status || "Finished",
      },
    },
    {
      $unwind: {
        path: "$cart",
      },
    },
    {
      $project: {
        product: "$cart.product",
      },
    },
    {
      $group: {
        _id: "$product",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
      },
    },
    {
      $project: {
        _id: 0,
        product: "$product.name",
        price: "$product.price",
        images: "$product.images",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: req.query.limit || 5,
    },
  ]);
  if (!products) return next(appError("Không tìm thấy sản phẩm", 404));
  res.status(200).json({
    status: "success",
    length: products.length,
    data: products,
  });
});

exports.getRevenueByCat = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ ownerId: req.params.id });
  if (!store) return next(appError("Không tìm thấy cửa hàng", 404));
  const data = await Order.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId(store._id),
        status: {
          $nin: ["Cancelled", "Refused", "Pending"],
        },
      },
    },
    {
      $unwind: {
        path: "$cart",
      },
    },
    {
      $project: {
        revenue: { $multiply: ["$cart.quantity", "$cart.price"] },
        product: "$cart.product",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $group: {
        _id: "$product.category.catName",
        revenue: {
          $sum: {
            $multiply: ["$revenue", 1 - process.env.percentStore / 100],
          },
        },
      },
    },
    {
      $unwind: {
        path: "$_id",
      },
    },
    {
      $sort: {
        revenue: -1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getOrderOneDate = async function(id, date) {
  const startOfDay = moment(date)
    .startOf("day")
    .add(7, "hours")
    .toDate();
  const endOfDay = moment(date)
    .endOf("day")
    .add(7, "hours")
    .toDate();
  const data = await Order.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId(id),
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
            else: { $subtract: ["$totalPrice", "$shipCost"] },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$revenue", 1 - process.env.percentStore / 100],
          },
        },
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
    .add(7, "hours")
    .toDate();
  const endOfWeek = moment(date)
    .endOf("week")
    .endOf("day")
    .add(7, "hours")
    .toDate();
  const data = await Order.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId(id),
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
            else: { $subtract: ["$totalPrice", "$shipCost"] },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$revenue", 1 - process.env.percentStore / 100],
          },
        },
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
    .add(7, "hours")
    .toDate();
  const endOfMonth = moment(date)
    .endOf("month")
    .endOf("day")
    .add(7, "hours")
    .toDate();

  const data = await Order.aggregate([
    {
      $match: {
        store: mongoose.Types.ObjectId(id),
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
            else: { $subtract: ["$totalPrice", "$shipCost"] },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $multiply: ["$revenue", 1 - process.env.percentStore / 100],
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  return data[0];
};

exports.exportProduct = catchAsync(async (req, res, next) => {
  let products = [];

  let productData = await Product.find({ storeId: req.params.storeId });
  productData.forEach((product) => {
    const {
      id,
      images,
      price,
      isOutofOrder,
      ratingsAverage,
      ratingsQuantity,
      description,
      category,
    } = product;
    const imageString = images.map((img) => JSON.stringify(img)).join("; ");
    products.push({
      id,
      images: imageString,
      price,
      isOutofOrder,
      ratingsAverage,
      ratingsQuantity,
      description,
      category,
    });
  });

  const csvFields = [
    "Id",
    "Images",
    "Price",
    "Is out of order",
    "Ratings average",
    "Ratings quantity",
    "Description",
    "Category",
  ];
  const csvParser = new Parser({ csvFields });
  const csvData = csvParser.parse(products);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=productsData.csv");
  res.status(200).end(csvData);
});

exports.exportOrder = catchAsync(async (req, res, next) => {
  let orders = [];

  let orderData = await Order.find({ store: req.params.storeId });
  orderData.forEach((order) => {
    const {
      id,
      storeLocation,
      shipCost,
      totalPrice,
      status,
      user,
      store,
      cart,
      contact,
      dateOrdered,
    } = order;
    const storeLocationString = JSON.stringify(storeLocation);
    const contactString = JSON.stringify(contact);
    const cartString = cart.map((c) => JSON.stringify(c)).join("; ");

    orders.push({
      id,
      storeLocation: storeLocationString,
      shipCost,
      totalPrice,
      status,
      user,
      store,
      cart: cartString,
      contact: contactString,
      dateOrdered,
    });
  });

  const csvFields = [
    "Id",
    "Images",
    "Price",
    "Is out of order",
    "Ratings average",
    "Ratings quantity",
    "Description",
    "Category",
  ];
  const csvParser = new Parser({ csvFields });
  const csvData = csvParser.parse(orders);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=ordersData.csv");
  res.status(200).end(csvData);
});
