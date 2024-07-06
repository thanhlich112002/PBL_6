const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Shipper = require("./shipper");
const Product = require("./product");
const moment = require("moment-timezone");
const Store = require("./store");
const ratingSchema = new Schema(
  {
    reference: {
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required: [true, "Rating must be belong to model!"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Rating must be belong to a user!"],
    },
    number: {
      type: Number,
      required: [true, "Rating must be has a number!"],
      min: 1,
      max: 5,
    },
    content: {
      type: String,
    },
    images: [String],
    onModel: {
      type: String,
      required: true,
      enum: ["Store", "Product", "Shipper"],
    },
    createdAt: {
      type: Date,
      default: moment()
        .tz("Asia/Ho_Chi_Minh")
        .format(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ratingSchema.index({ reference: 1, user: 1 }, { unique: true });
ratingSchema.post("save", async function() {
  await this.populate({
    path: "user",
    select: "firstName lastName photo",
  }).execPopulate();
});

ratingSchema.pre(/^find/, function(next) {
  this.populate({
    path: "user",
    select: "firstName lastName photo",
  });
  next();
});

ratingSchema.statics.calcAverageRating = async function(referenceId, onModel) {
  const stats = await this.aggregate([
    {
      $match: { reference: referenceId },
    },
    {
      $group: {
        _id: "$reference",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$number" },
      },
    },
  ]);
  let Model;
  if (onModel === "Shipper") Model = Shipper;
  if (onModel === "Product") Model = Product;
  if (onModel === "Store") Model = Store;
  if (stats.length > 0) {
    await Model.findByIdAndUpdate(referenceId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    });
  } else {
    await Model.findByIdAndUpdate(referenceId, {
      ratingsAverage: 0,
      ratingsQuantity: 5,
    });
  }
};
ratingSchema.post("save", function() {
  this.constructor.calcAverageRating(this.reference, this.onModel);
});
ratingSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
});

ratingSchema.post(/^findOneAnd/, async function(next) {
  this.r.constructor.calcAverageRating(this.r.reference, this.r.onModel);
});
module.exports = mongoose.model("Rating", ratingSchema);
