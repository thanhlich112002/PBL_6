const User = require("../models/userModel");
const Contact = require("../models/contact");
const Store = require("../models/store");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handleController = require("./handleController");
const authController = require("../controllers/authController");
const mapUtils = require("../utils/mapUtils");
require("dotenv").config();
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary").v2;
const fileUploader = require("../utils/uploadImage");

class userController {
  updatePhoto = fileUploader.single("photo");
  sendEmail = authController.sendEmailVerify;
  signUpUser = authController.signUp(User, "User");
  verifiedUser = authController.verifiedSignUp(User);
  getAllUser = catchAsync(async (req, res, next) => {
    let obj = {
      isVerified: true,
      role: "User",
    };
    const features = new ApiFeatures(
      User.find(obj).select("+isVerified"),
      req.query
    )
      .search()
      .limitFields()
      .paginate();
    const users = await features.query;
    return res.status(200).json({
      length: users.length,
      data: users,
    });
  });
  getUserById = handleController.getOne(User);
  deleteUser = handleController.delOne(User);
  updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("contact");
    let index = user.contact.findIndex(
      (el) => el._id.toString() === user.defaultContact.toString()
    );

    user.markModified("contact");
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.contact[index] = req.body.contact;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: user,
    });
  });
  changePass = catchAsync(async (req, res, next) => {
    // const { newPass, confirmedPass } = req.body;
    // const user = await User.findById(req.params.id).select("+password");

    const { oldPass, newPass, confirmedPass } = req.body;
    const user = await User.findById(req.params.id).select("+password");
    if (confirmedPass != newPass)
      next(new appError("Mật khẩu xác nhận không trùng khớp!", 404));
    if (!(await user.isCorrectPassword(user.password, oldPass)))
      next(new appError("Mật khẩu không đúng", 404));

    user.password = confirmedPass;
    user.passwordConfirm = confirmedPass;

    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
    // jwtToken.generateAndSendJWTToken(user, 201, res);
  });
  delContact = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (req.params.contactId == user.defaultContact)
      next(new appError("Thông tin liên hệ mặc định không được xoá!", 404));
    user.contact = user.contact.filter(
      (obj) => obj._id != req.params.contactId
    );
    await user.save({ validateBeforeSave: false });
    res.status(200).json(user);
  });
  addContact = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    user.contact.push(req.body.contact);
    await user.save({ validateBeforeSave: false });
    res.status(200).json(user);
  });
  setDefaultContact = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    user.defaultContact = req.params.contactId;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(user);
  });
  getDefaultContact = catchAsync(async (req, res, next) => {
    let id = req.params.userId;
    const user = await User.findById(id);
    if (!user) next(new appError("Người dùng không tồn tại!", 404));
    id = user.defaultContact;
    const contact = await Contact.findById(id, { _id: 0, __v: 0 });
    res.status(200).json(contact);
  });
  getInfoCart = catchAsync(async (req, res, next) => {
    const { userId, storeId } = req.params;
    let user = await User.findById(userId);

    const store = await Store.findById(storeId);

    const storeCoordinates = {
      latitude: store.location.coordinates[0],
      longitude: store.location.coordinates[1],
    };
    console.log(store);
    const data = user.contact.map(function(contact) {
      console.log(contact);
      const contactCoordinates = {
        latitude: contact.location.coordinates[0],
        longitude: contact.location.coordinates[1],
      };
      let distance = +mapUtils.getDistance(
        storeCoordinates,
        contactCoordinates
      );

      const prepareTime = +process.env.prepareTime; // time expected for preparing
      distance = +(distance / 1000).toFixed(1);
      let deliveryTime = Math.round((distance / 40) * 60 + prepareTime); // 40 is deliverySpeed -- duration = distance / deliverySpeed

      //totalPrice
      let shipCost;
      const baseFee = +process.env.baseFee;
      const feePerKm = +process.env.feePerKm;
      distance > 3
        ? (shipCost = baseFee + Math.ceil(distance - 3) * feePerKm)
        : (shipCost = baseFee);
      return {
        contact,
        deliveryTime,
        distance,
        shipCost,
      };
    });
    res.status(200).json({
      status: "success",
      data,
    });
  });

  updateUserPhoto = catchAsync(async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return next(new appError("No document found with that ID", 404));
    }
    const body = {
      photo: req.file ? req.file.path : user.photo,
    };
    try {
      const doc = await User.findByIdAndUpdate({ _id: req.params.id }, body, {
        new: true,
        runValidators: true,
      });
      let parts = user.photo.split("/");
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
}

module.exports = new userController();
