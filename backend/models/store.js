const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mapUtils = require("../utils/mapUtils");

const storeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Tên cửa hàng là bắt buộc"],
    },
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          return /^[0-9]{10}$/.test(value);
        },
        message: (problem) => `${problem.value} không hợp lệ`,
      },
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Địa chỉ là bắt buộc"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    openAt: {
      type: String,
      required: [true, "Thời gian mở cửa là bắt buộc"],
    },
    closeAt: {
      type: String,
      required: [true, "Thời gian đóng cửa là bắt buộc"],
    },
    description: {
      type: String,
      trim: true,
    },
    registrationLicense: {
      type: String,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 5.0,
      min: [1, "Rating must be above 1.0"],

      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Hình ảnh cửa hàng là bắt buộc"],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    vouchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Voucher",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// storeSchema.pre("findOneAndUpdate", { query: true }, async function(next) {
//   const update = this.getUpdate();
//   if (update.address) {
//     const loc = await mapUtils.getGeoCode(update.address);
//     this._update.location = {
//       type: "Point",
//       coordinates: [loc[0].latitude, loc[0].longitude],
//     };
//     console.log(update.location);
//   }
//   next();
// });
storeSchema.pre("save", async function(next) {
  if (this.isNew || this.isModified("address")) {
    const loc = await mapUtils.getGeoCode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].latitude, loc[0].longitude],
    };
    console.log(this.location);
  }
  next();
});
// Virtual populate
storeSchema.virtual("ratings", {
  ref: "Rating",
  foreignField: "reference",
  localField: "_id",
});
module.exports = mongoose.model("Store", storeSchema);
