const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mapUtils = require("../utils/mapUtils");
const contactSchema = new Schema({
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
});
contactSchema.pre("save", async function(next) {
  if (this.isNew || this.isModified("address")) {
    const loc = await mapUtils.getGeoCode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].latitude, loc[0].longitude],
    };
  }
  next();
});
module.exports = mongoose.model("Contact", contactSchema);
