const Store = require("../models/store");
const appError = require("../utils/appError");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");
const mapUtils = require("../utils/mapUtils");
class mapController {
  setAddress = catchAsync(async (req, res, next) => {
    fs.readFile("cities.json", "utf8", (err, data) => {
      if (err) {
        next(new appError("Không tìm thấy!", 404));
      }

      const { city, district } = req.query;
      const cities = JSON.parse(data);
      if (!city) data = cities.map((item) => item.Name);
      else {
        if (!district)
          data = cities
            .find((item) => item.Name == city)
            .Districts.map((item) => item.Name);
        else
          data = cities
            .find((item) => item.Name == city)
            .Districts.find((item) => item.Name == district)
            .Wards.map((item) => item.Name);
      }

      res.status(200).json({
        status: "success",
        data: data,
      });
    });
  });
  nearBySearch = catchAsync(async (req, res, next) => {
    const data = await mapUtils.search(req.query.address, 50000);
    if (!data) next(new appError("Không tìm thấy địa chỉ", 404));
    res.status(200).json({
      status: "success",
      data,
    });
  });
  findStore = catchAsync(async (req, res, next) => {
    let addresses = await Store.find({}, { address: 1, _id: 1 });
    const userAddress = req.query.user;
    const distance = 5;
    const filteredAddresses = [];
    for (const address of addresses) {
      let data = await mapUtils.getDistance(userAddress, address.address);
      data = +data.routes[0].legs[0].distance.text.split("km")[0];
      if (data < distance) {
        filteredAddresses.push(address);
      }
    }
    res.status(200).json({
      status: "success",
      data: filteredAddresses,
    });
  });

  viewGeoCode = catchAsync(async (req, res, next) => {
    const data = await mapUtils.getGeoCode(req.query.address);
    if (!data) next(new appError("Không tìm thấy địa chỉ", 404));
    res.status(200).json({
      status: "success",
      data: {
        lat: data[0].latitude,
        lng: data[0].longitude,
      },
    });
  });

  viewAddress = catchAsync(async (req, res, next) => {
    const data = await mapUtils.getAddress(req.query.latlng);
    if (!data) next(new appError("Không tìm thấy địa chỉ", 404));
    res.status(200).json({
      status: "success",
      data: data[0].formattedAddress,
    });
  });
  viewDistanceAndDuration = catchAsync(async (req, res, next) => {
    let { destination, origin } = req.query;
    const data = await mapUtils.getDistanceAndDuration(origin, destination);
    if (!data) next(new appError("Không tìm thấy địa chỉ", 404));
    res.status(200).json({
      status: "success",
      data: { distance: data[0], duration: data[1] },
    });
  });
}
module.exports = new mapController();
