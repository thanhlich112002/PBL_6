const Shipper = require("../models/shipper");
const Owner = require("../models/owner");
const Store = require("../models/store");
const User = require("../models/userModel");
const Order = require("../models/order");
const Product = require("../models/product");
const ApiFeatures = require("../utils/ApiFeatures");
const appError = require("../utils/appError");
const Email = require("../utils/email");
const catchAsync = require("../utils/catchAsync");
const ownerController = require("./ownerController");
const moment = require("moment");
const { Parser } = require("json2csv");
process.env.TZ = "Asia/Ho_Chi_Minh";
class adminController {
  getListAllAdmin = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(User.find({ role: "Admin" }), req.query)
      .filter()
      .search()
      .paginate();
    const admins = await features.query;
    res.status(200).json({
      status: "success",
      length: admins.length,
      data: admins,
    });
  });
  getListShipperAppove = catchAsync(async (req, res, next) => {
    const shippers = await Shipper.find({
      isAccepted: false,
      isVerified: true,
    });
    if (shippers === 0) {
      return next(
        new appError("Không có người giao hàng nào cần phê duyệt", 400)
      );
    }
    return res.status(200).json({
      length: shippers.length,
      data: shippers,
    });
  });
  getListOwnerAppove = catchAsync(async (req, res, next) => {
    const owners = await Owner.find({
      isAccepted: false,
      isVerified: true,
    });
    const ownersId = owners.map((owner) => owner._id);
    const data = await Store.find({ ownerId: { $in: ownersId } }).populate(
      "ownerId"
    );
    if (owners.length === 0) {
      return next(new appError("Không có chủ cửa hàng nào cần phê duyệt", 400));
    }
    return res.status(200).json({
      length: data.length,
      data,
    });
  });
  appoveShipperAccount = catchAsync(async (req, res, next) => {
    const isAccepted = req.body.isAccepted;
    const shipper = await Shipper.findById(req.params.id).select("+isAccepted");
    console.log(shipper);

    if (!shipper || isAccepted === undefined) {
      return next(new appError("Không tìm thấy người giao hàng !!!", 500));
    }
    if (shipper.isAccepted === true) {
      return next(
        new appError("Người giao hàng này đã được duyệt rồi !!!"),
        500
      );
    }
    if (isAccepted === true) {
      try {
        const url = `${req.protocol}://${req.get("host")}/`;
        shipper.isAccepted = true;
        shipper.status = "Không hoạt động";
        await shipper.save({ validateBeforeSave: false });
        await new Email(shipper, null, url).sendAcceptEmail();
        res.status(200).json({
          message: "Xác nhận đăng ký thành công !!!",
        });
      } catch (err) {
        return next(
          new appError("Đã xuất hiện lỗi gửi email. Vui lòng thử lại!"),
          500
        );
      }
    } else {
      try {
        await Shipper.findByIdAndDelete({ _id: req.params.id });
        await new Email(data, null, null).sendRefuseEmail();
        res.status(200).json({
          message: "Xác nhận đăng ký thất bại !",
        });
      } catch (err) {
        return next(
          new appError("Đã xuất hiện lỗi gửi email. Vui lòng thử lại!"),
          500
        );
      }
    }
  });
  appoveOwnerAccount = catchAsync(async (req, res, next) => {
    const isAccepted = req.body.isAccepted;
    const owner = await Owner.findById({ _id: req.params.id });
    if (!owner || !isAccepted) {
      return next(new appError("Không tìm thấy chủ cửa hàng !!!", 500));
    }
    if (isAccepted === true) {
      try {
        const url = `${req.protocol}://${req.get("host")}/`;
        owner.isAccepted = true;
        await owner.save({ validateBeforeSave: false });
        await new Email(owner, null, url).sendAcceptEmail();
        res.status(200).json({
          message: "Xác nhận đăng ký thành công !!!",
        });
      } catch (err) {
        owner.isAccepted = false;
        await owner.save({ validateBeforeSave: false });
        return next(
          new appError("Đã xuất hiện lỗi gửi email. Vui lòng thử lại!"),
          500
        );
      }
    } else {
      try {
        await Owner.findByIdAndDelete({ _id: req.params.id });
        await new Email(doc, null).sendRefuseEmail();
        res.status(200).json({
          message: "Xác nhận đăng ký thất bại !!!",
        });
      } catch (err) {
        return next(
          new appError("Đã xuất hiện lỗi gửi email. Vui lòng thử lại!"),
          500
        );
      }
    }
  });
  getNumberUsersMonthly = catchAsync(async (req, res, next) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    const now = moment().startOf("month");
    const last = moment()
      .subtract(req.query.limit || 5, "months")
      .startOf("month");
    const monthly = [];
    let currentMonth = moment(last);

    while (currentMonth.isSameOrBefore(now, "month")) {
      const data = await this.getNumbersUsersOneMonth(currentMonth.toDate());
      monthly.push({
        date: currentMonth.endOf("month").format("YYYY-MM-DD"),
        numUsers: data ? data.numUsers : 0,
        numOwners: data ? data.numOwners : 0,
        numShippers: data ? data.numShippers : 0,
      });
      currentMonth.add(1, "month");
    }
    res.status(200).json({
      status: "success",
      data: monthly,
    });
  });
  getNumbersUsersOneMonth = async function(date) {
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
    console.log(startOfMonth, endOfMonth);
    let data = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          numUsers: {
            $sum: {
              $cond: {
                if: { $eq: ["$role", "User"] },
                then: 1,
                else: 0,
              },
            },
          },
          numOwners: {
            $sum: {
              $cond: {
                if: { $eq: ["$role", "Owner"] },
                then: 1,
                else: 0,
              },
            },
          },
          numShippers: {
            $sum: {
              $cond: {
                if: { $eq: ["$role", "Shipper"] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          numUsers: { $ifNull: ["$numUsers", 0] },
          numOwners: { $ifNull: ["$numOwners", 0] },
          numShippers: { $ifNull: ["$numShippers", 0] },
        },
      },
    ]);
    return data[0];
  };
  getNumbersUsersQuarterly = catchAsync(async (req, res, next) => {
    const year = +req.query.year || 2023;
    const data = await User.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: "$createdAt" }, year] },
        },
      },
      {
        $project: {
          role: 1,
          quarter: {
            $cond: [
              { $lte: [{ $month: "$createdAt" }, 3] },
              "Quý 1",
              {
                $cond: [
                  { $lte: [{ $month: "$createdAt" }, 6] },
                  "Quý 2",
                  {
                    $cond: [
                      { $lte: [{ $month: "$createdAt" }, 9] },
                      "Quý 3",
                      "Quý 4",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$quarter",
          numUsers: {
            $sum: {
              $cond: {
                if: { $eq: ["$role", "User"] },
                then: 1,
                else: 0,
              },
            },
          },
          numOwners: {
            $sum: {
              $cond: {
                if: { $eq: ["$role", "Owner"] },
                then: 1,
                else: 0,
              },
            },
          },
          numShippers: {
            $sum: {
              $cond: {
                if: { $eq: ["$role", "Shipper"] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data,
    });
  });
  getRevenueMonthly = catchAsync(async (req, res, next) => {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const now = moment().startOf("month");
    const last = moment()
      .subtract(req.query.limit || 5, "months")
      .startOf("month");
    const monthly = [];
    let currentMonth = moment(last);

    while (currentMonth.isSameOrBefore(now, "month")) {
      const data = await this.getRevenueOneMonth(currentMonth.toDate());
      monthly.push({
        date: currentMonth.endOf("month").format("YYYY-MM-DD"),
        revenue: data ? data.revenue : 0,
      });
      currentMonth.add(1, "month");
    }
    res.status(200).json({
      status: "success",
      data: monthly,
    });
  });
  getRevenueOneMonth = async function(date) {
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
          status: { $nin: ["Cancelled", "Refused"] },
          dateOrdered: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: {
              $add: [
                {
                  $multiply: [
                    { $subtract: ["$totalPrice", "$shipCost"] },
                    process.env.percentStore / 100,
                  ],
                },
                { $multiply: ["$shipCost", process.env.percentShipper / 100] },
              ],
            },
          },
        },
      },
      // {
      //   $project: {
      //     revenue: {
      //       $add: [
      //         {
      //           $multiply: [
      //             { $subtract: ["$totalPrice", "$shipCost"] },
      //             process.env.percentStore / 100,
      //           ],
      //         },
      //         { $multiply: ["$shipCost", process.env.percentShipper / 100] },
      //       ],
      //     },
      //   },
      // },
    ]);
    return data[0];
  };
  getRevenueQuarterly = catchAsync(async (req, res, next) => {
    const year = +req.query.year || 2023;
    const data = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["Cancelled", "Refused"] },
          $expr: { $eq: [{ $year: "$dateOrdered" }, year] },
        },
      },
      {
        $project: {
          totalPrice: 1,
          shipCost: 1,
          quarter: {
            $cond: [
              { $lte: [{ $month: "$dateOrdered" }, 3] },
              "Quý 1",
              {
                $cond: [
                  { $lte: [{ $month: "$dateOrdered" }, 6] },
                  "Quý 2",
                  {
                    $cond: [
                      { $lte: [{ $month: "$dateOrdered" }, 9] },
                      "Quý 3",
                      "Quý 4",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$quarter",
          revenue: {
            $sum: {
              $add: [
                {
                  $multiply: [
                    { $subtract: ["$totalPrice", "$shipCost"] },
                    process.env.percentStore / 100,
                  ],
                },
                { $multiply: ["$shipCost", process.env.percentShipper / 100] },
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      // {
      //   $project: {
      //     quarter: 1,

      //   },
      // },
    ]);
    res.status(200).json({
      status: "success",
      data,
    });
  });
  getStoreByStoreId = catchAsync(async (req, res, next) => {
    const store = await Store.findById(req.params.id)
      .populate("ratings")
      .populate("ownerId");
    const last = moment()
      .startOf("month")
      .subtract(1, "months");
    const data = await ownerController.getOrderOneMonth(
      store._id,
      last.toDate()
    );
    if (!store) next(new appError("Không tìm thấy cửa hàng", 404));
    res.status(200).json({
      status: "success",
      data: {
        store,
        revenue: data ? data.revenue : 0,
      },
    });
  });
  //Exports
  exportShippers = catchAsync(async (req, res, next) => {
    let shippers = [];

    let shipperData = await Shipper.find({});
    shipperData.forEach((shipper) => {
      const {
        id,
        firstName,
        lastName,
        email,
        contact,
        role,
        photo,
        defaultContact,
        vehicleNumber,
        vehicleLicense,
        frontImageCCCD,
        behindImageCCCD,
        licenseNumber,
        vehicleType,
        licenseImage,
      } = shipper;
      const contactString = contact.map((c) => JSON.stringify(c)).join("; ");

      shippers.push({
        id,
        firstName,
        lastName,
        email,
        contact: contactString,
        role,
        photo,
        defaultContact,
        vehicleNumber,
        vehicleLicense,
        frontImageCCCD,
        behindImageCCCD,
        licenseNumber,
        vehicleType,
        licenseImage,
      });
    });

    const csvFields = [
      "Id",
      "First Name",
      "Last Name",
      "Email",
      "Contact",
      "Role",
      "Photo",
      "Default Contact",
      "Vehicle number",
      "Vehicle license",
      "Front image CCCD",
      "Behind image CCCD",
      "License number",
      "Vehicle type",
      "License image",
    ];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(shippers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=shippersData.csv"
    );
    res.status(200).end(csvData);
  });

  exportStores = catchAsync(async (req, res, next) => {
    let stores = [];

    let storeData = await Store.find({});
    storeData.forEach((store) => {
      const {
        id,
        location,
        ratingsAverage,
        ratingsQuantity,
        isLocked,
        name,
        openAt,
        closeAt,
        description,
        address,
        phoneNumber,
        registrationLicense,
        image,
      } = store;

      stores.push({
        id,
        location,
        ratingsAverage,
        ratingsQuantity,
        isLocked,
        name,
        openAt,
        closeAt,
        description,
        address,
        phoneNumber,
        registrationLicense,
        image,
      });
    });

    const csvFields = [
      "Id",
      "Location",
      "Ratings average",
      "Ratings quantity",
      "Is locked",
      "Name",
      "Open at",
      "Close at",
      "Description",
      "Dddress",
      "PhoneNumber",
      "Registration license",
      "Image",
    ];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(stores);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=storesData.csv");
    res.status(200).end(csvData);
  });
  exportUsers = catchAsync(async (req, res, next) => {
    let users = [];

    let userData = await User.find({ role: "User" });
    userData.forEach((user) => {
      const {
        id,
        firstName,
        lastName,
        email,
        contact,
        role,
        photo,
        defaultContact,
      } = user;
      const contactString = contact.map((c) => JSON.stringify(c)).join("; ");

      users.push({
        id,
        firstName,
        lastName,
        email,
        contact: contactString,
        role,
        photo,
        defaultContact,
      });
    });

    const csvFields = [
      "Id",
      "First Name",
      "Last Name",
      "Email",
      "Contact",
      "Role",
      "Photo",
      "Default Contact",
    ];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=usersData.csv");
    res.status(200).end(csvData);
  });

  exportOwners = catchAsync(async (req, res, next) => {
    let owners = [];

    let ownerData = await Owner.find({});
    ownerData.forEach((owner) => {
      const {
        id,
        firstName,
        lastName,
        email,
        contact,
        role,
        photo,
        defaultContact,
        frontImageCCCD,
        behindImageCCCD,
        bankName,
        bankNumber,
      } = owner;

      owners.push({
        id,
        firstName,
        lastName,
        email,
        contact,
        role,
        photo,
        defaultContact,
        frontImageCCCD,
        behindImageCCCD,
        bankName,
        bankNumber,
      });
    });

    const csvFields = [
      "Id",
      "First Name",
      "Last Name",
      "Email",
      "Contact",
      "Role",
      "Photo",
      "Default Contact",
      "Front image CCCD",
      "Behind image CCCD",
      "Bank name",
      "Bank number",
    ];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(owners);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=ownersData.csv");
    res.status(200).end(csvData);
  });

  exportAllProducts = catchAsync(async (req, res, next) => {
    let products = [];

    let productData = await Product.find({});
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
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=productsData.csv"
    );
    res.status(200).end(csvData);
  });
}
module.exports = new adminController();
