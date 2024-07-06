const Store = require("../models/store");
const Product = require("../models/product");
const Owner = require("../models/owner");
const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const handleController = require("./handleController");
const appError = require("../utils/appError");
const ApiFeatures = require("../utils/ApiFeatures");
const fileUploader = require("../utils/uploadImage");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const ownerController = require("./ownerController");
const moment = require("moment-timezone");
class storeController {
  uploadStoreImages = fileUploader.fields([
    { name: "image", maxCount: 1 },
    { name: "registrationLicense", maxCount: 1 },
  ]);

  createStore = catchAsync(async (req, res, next) => {
    try {
      const checkOwner = await Store.findOne({ ownerId: req.params.ownerId });
      if (checkOwner) {
        return next(
          new appError(
            "Chủ cửa hàng này đã được đăng ký cho cửa hàng khác!",
            500
          )
        );
      }
      let body = {
        ...req.body,
        ownerId: req.params.ownerId,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      };
      if (req.files) {
        body = {
          ...body,
          registrationLicense: req.files.registrationLicense[0]?.path,
          image: req.files.image[0]?.path,
        };
      } else {
        return next(new appError("Vui lòng cung cấp hình ảnh cửa hàng", 500));
      }
      const storeCreated = await Store.create(body);
      res.status(201).json({
        message: "Hoàn tất đăng ký cửa hàng, vui lòng chờ xác nhận !!!",
        storeCreated,
      });

      next();
    } catch (err) {
      if (req.files) {
        Object.keys(req.files).forEach((key) => {
          req.files[key].forEach((file) =>
            cloudinary.uploader.destroy(file.filename)
          );
        });
      }
      next(err);
    }
  });

  getStoreByOwnerId = catchAsync(async (req, res, next) => {
    const store = await Store.findOne({ ownerId: req.params.id });
    if (!store) next(new appError("Không tìm thấy cửa hàng", 404));
    res.status(200).json({
      status: "success",
      data: store,
    });
  });
  getStoreByStoreId = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const store = await Store.findById(req.params.id).populate("ratings");
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
      data: store,
      revenue: data ? data.revenue : 0,
    });
  });
  getAllStore = catchAsync(async (req, res, next) => {
    let obj = {
      isLocked: req.query.isLocked,
    };
    obj = req.query.city
      ? { ...obj, address: { $regex: new RegExp(req.query.city, "i") } }
      : obj;
    if (req.query.district) {
      let district = req.query.district.split(",");
      district = district.map((dis) => new RegExp(dis, "i"));
      obj = { ...obj, address: { $in: district } };
    }
    if (req.query.catName) {
      const cats = req.query.catName.split(",");
      const products = await Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category.catName",
            foreignField: "catName",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $lookup: {
            from: "stores",
            localField: "storeId",
            foreignField: "_id",
            as: "store",
          },
        },
        {
          $unwind: "$store",
        },
        {
          $project: {
            store: 1,
            category: 1,
          },
        },
        {
          $match: {
            "category.catName": { $in: cats },
          },
        },
        {
          $group: {
            _id: "$category.catName",
            storeIds: { $addToSet: "$store._id" },
          },
        },
        {
          $project: {
            _id: 1,
            storeIds: {
              $map: {
                input: "$storeIds",
                as: "storeId",
                in: { $toString: "$$storeId" },
              },
            },
          },
        },
      ]);
      let storeIds = products[0].storeIds;
      for (let i = 1; i < products.length; i++)
        storeIds = storeIds.filter((el) => products[i].storeIds.includes(el));
      storeIds = storeIds.map((id) => mongoose.Types.ObjectId(id));
      obj = {
        ...obj,
        _id: { $in: storeIds },
      };
    }
    const features = new ApiFeatures(Store.find(obj), req.query)
      .search()
      .limitFields()
      .paginate();
    const stores = await features.query;
    res.status(200).json({
      status: "success",
      length: stores.length,
      data: stores,
    });
  });
  updateStore = catchAsync(async (req, res, next) => {
    let body = req.body;
    if (req.body.del) {
      let del = req.body.del;
      let parts = del.split("/");
      let id =
        parts.slice(parts.length - 2, parts.length - 1).join("/") +
        "/" +
        parts[parts.length - 1].split(".")[0];
      cloudinary.uploader.destroy(id);
    }
    if (req.files.image) {
      body = {
        ...body,
        image: req.files.image[0]?.path,
      };
    }
    const store = await Store.findOneAndUpdate(
      { ownerId: req.params.ownerId },
      body,
      {
        new: true,
      }
    )
      .then()
      .catch((err) => {
        if (req.files) {
          Object.keys(req.files).forEach((key) => {
            req.files[key].forEach((file) =>
              cloudinary.uploader.destroy(file.filename)
            );
          });
        }
        console.log(err.message);
        next(new appError(err.message, 404));
      });

    if (!store) return next(new appError("Không tìm thấy cửa hàng", 404));
    res.status(200).json({
      message: "success",
      data: store,
    });
  });
  lockStore = catchAsync(async (req, res, next) => {
    let store = await Store.findOne({ ownerId: req.params.ownerId });
    store.isLocked = !store.isLocked;
    await store.save();
    res.status(200).json({
      status: "success",
      data: store,
    });
  });
  // View Store in City
  getStoreByCity = catchAsync(async (req, res, next) => {
    const stores = await Store.find({
      address: new RegExp(req.params.name, "i"),
    });
    res.status(200).json({
      status: "success",
      length: stores.length,
      data: {
        data: stores,
      },
    });
  });
  // Stat
  mostCategory = catchAsync(async (req, res, next) => {});
  order = catchAsync(async (req, res, next) => {});
  cusQuantity = catchAsync(async (req, res, next) => {});
  increaseCus = catchAsync(async (req, res, next) => {});
  cusQuantityVip = catchAsync(async (req, res, next) => {});
  productQuantity = catchAsync(async (req, res, next) => {});
  favorProductQuantity = catchAsync(async (req, res, next) => {});
  noSaleProductQuantity = catchAsync(async (req, res, next) => {});
  // Order
  getAllOrder = catchAsync(async (req, res, next) => {});
  viewOrder = catchAsync(async (req, res, next) => {});
  rejectOrder = catchAsync(async (req, res, next) => {});
  acceptOrder = catchAsync(async (req, res, next) => {});
  intersect = function(a, b) {
    var setB = new Set(b);
    return [...new Set(a)].filter((x) => setB.has(x));
  };
}

module.exports = new storeController();
