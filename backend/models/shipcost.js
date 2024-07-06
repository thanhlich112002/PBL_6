const mongoose = require("mongoose");
const shipCostSchema = new Schema({
  stoe: {
    type: Number,
    required: true,
    defaultValue: 2,
  },
  price: {
    type: Number,
    required: true,
    defaultValue: 0,
  },
});
shipCostSchema.add(User.Schema);

module.exports = mongoose.model("shipCostSchema", shipCost);
