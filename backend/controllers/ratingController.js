const Rating = require("../models/rating");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const fileUploader = require("../utils/uploadImage");
const cloudinary = require("cloudinary").v2;
const ApiFeatures = require("../utils/ApiFeatures");

class ratingController {
  updatePhoto = fileUploader.array("images", 10);
  ratingForShipper = catchAsync(async (req, res, next) => {
    if (!req.body.reference) {
      if (req.params.shipperId) {
        req.body.reference = req.params.shipperId;
        req.body.onModel = "Shipper";
      } else if (req.params.productId) {
        req.body.reference = req.params.productId;
        req.body.onModel = "Product";
      } else if (req.params.storeId) {
        req.body.reference = req.params.storeId;
        req.body.onModel = "Store";
      }
    }
    if (!req.body.user) req.body.user = req.user.id;
    let body = {
      ...req.body,
    };
    if (req.files) {
      body = {
        ...body,
        images: req.files.map((image) => image.path),
      };
    }
    await Rating.create(body)
      .then((rating) => {
        res.status(201).json(rating);
      })
      .catch((err) => {
        if (req.files) {
          if (req.files) {
            req.files.forEach((file) =>
              cloudinary.uploader.destroy(file.filename)
            );
          }
          next(err);
        }
      });
  });
  getAllRatings = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.shipperId)
      filter = { reference: req.params.shipperId, onModel: "Shipper" };
    else if (req.params.productId)
      filter = { reference: req.params.productId, onModel: "Product" };
    else if (req.params.storeId)
      filter = { reference: req.params.storeId, onModel: "Store" };

    const features = new ApiFeatures(Rating.find(filter), req.query)
      .filter()
      .search()
      .paginate();
    const ratings = await features.query;
    res.status(200).json({
      status: "success",
      length: ratings.length,
      data: ratings,
    });
  });
  getRatingById = catchAsync(async (req, res, next) => {
    const ratings = await Rating.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: ratings,
    });
  });
  updateRating = catchAsync(async (req, res, next) => {
    let body = { content: req.body.content, number: req.body.number };
    const checkUser = await Rating.findById(req.params.id);
    if (!checkUser)
      return next(new appError("Can't not find this document", 404));
    let images = [...checkUser.images];
    let dels = req.body.dels;
    console.log(dels);
    // fillter exits image
    if (req.body.dels) {
      images = images.filter((el) => !dels.includes(el));
    }
    if (req.files) {
      images = images.concat(req.files.map((image) => image.path));
    }
    // let dels = product.images;
    console.log({
      ...body,
      images,
    });
    if (checkUser.user._id.toString() === req.user.id) {
      const rating = await Rating.findByIdAndUpdate(
        req.params.id,
        {
          ...body,
          images,
        },
        { new: true, runValidators: true }
      )
        .then()
        .catch((err) => {
          if (req.files) {
            req.files.forEach((file) =>
              cloudinary.uploader.destroy(file.filename)
            );
          }
          next(new appError("Error", 404));
        });

      // delete images
      if (req.body.dels) {
        // let urls = [...req.body.dels];
        // console.log(urls);
        for (let i = 0; i < dels.length; i++) {
          let parts = dels[i].split("/");
          let id =
            parts.slice(parts.length - 2, parts.length - 1).join("/") +
            "/" +
            parts[parts.length - 1].split(".")[0];
          cloudinary.uploader.destroy(id);
        }
      }
      res.status(200).json({
        status: "success",
        data: rating,
      });
    } else {
      return next(
        new appError("You don't have permission to update this rating"),
        403
      );
    }
  });

  deleteRating = catchAsync(async (req, res, next) => {
    const checkUser = await Rating.findById(req.params.id);
    if (checkUser.user._id.toString() === req.user.id) {
      const rating = await Rating.findByIdAndDelete({ _id: req.params.id });
      if (!rating) {
        return next(new appError("Can't not find this rating", 404));
      }
      rating.images.forEach((links) => {
        let parts = links.split("/");
        let id =
          parts.slice(parts.length - 2, parts.length - 1).join("/") +
          "/" +
          parts[parts.length - 1].split(".")[0];
        cloudinary.uploader.destroy(id);
      });
    } else {
      return next(
        new appError("You don't have permission to delete this rating"),
        403
      );
    }
    res.status(200).json("Delete successfully");
  });
}

module.exports = new ratingController();
