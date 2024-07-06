const { promisify } = require("util");
const User = require("../models/userModel");
const Shipper = require("../models/shipper");
const Owner = require("../models/owner");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwtToken = require("../utils/jwtToken");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const Email = require("../utils/email");
const passport = require("passport");
const { generateAndSendJWTToken } = require("../utils/jwtToken");

const jwt = require("jsonwebtoken");

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Vui lòng nhập email và mật khẩu", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new appError("Email không hợp lệ", 401));
  }
  if (!(await user.isCorrectPassword(user.password, password))) {
    return next(new appError("Mật khẩu không hợp lệ", 401));
  }
  if (user.role == "Shipper") {
    const shipper = await Shipper.findOne({ email }).select("+password");
    if (shipper.status === "Chờ phê duyệt")
      return next(new appError("Người giao hàng chờ phê duyệt!", 401));
  }
  if (user.role == "Owner") {
    const owner = await Owner.findOne({ email }).select("+password");
    if (owner.isAccepted === false)
      return next(new appError("Chủ cửa hàng chờ phê duyệt!", 401));
  }
  jwtToken.generateAndSendJWTToken(user, 200, res, req);
});
exports.logout = catchAsync(async (req, res, next) => {
  res
    .clearCookie("jwt")
    .status(200)
    .json({ message: "Đăng xuất thành công" });
});
exports.signUp = (Model, role) => async (req, res, next) => {
  try {
    let body = {
      ...req.body,
      role,
      isAccepted: false,
      isVerified: false,
    };
    if (req.files) {
      body = {
        ...body,
        frontImageCCCD: req.files.frontImageCCCD[0]?.path,
        behindImageCCCD: req.files.behindImageCCCD[0]?.path,
      };
      if (req.files.licenseImage) {
        body = {
          ...body,
          licenseImage: req.files.licenseImage[0]?.path,
          vehicleLicense: req.files.vehicleLicense[0]?.path,
        };
      }
    }
    const doc = await Model.create(body);

    const signUpToken = doc.createSignUpToken();

    await doc.save({ validateBeforeSave: false });
    // 3) Send it to doc's email
    req.doc = doc;
    req.signUpToken = signUpToken;
    next();
  } catch (err) {
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        req.files[key].forEach((file) =>
          cloudinary.uploader.destroy(file.filename)
        );
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.sendEmailVerify = catchAsync(async (req, res, next) => {
  const doc = req.doc;
  const signUpToken = req.signUpToken;
  const url = process.env.URL_VERIRY_EMAIL;
  try {
    await new Email(doc, signUpToken, url).sendWelcome();
    res.status(200).json({
      message: "Mã đã được gửi đến email!",
    });
  } catch (err) {
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        req.files[key].forEach((file) =>
          cloudinary.uploader.destroy(file.filename)
        );
      });
    }
    await User.findByIdAndDelete(doc._id);

    return next(
      new appError("Đã xuất hiện lỗi gửi email. Vui lòng thử lại!"),
      500
    );
  }
});
exports.verifiedSignUp = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const code = req.body.signUpToken.toString();
    const hashedToken = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");
    const doc = await Model.findOne({ email: req.params.email }).select(
      "+signUpExpires"
    );
    // 2) If token has not expired, and there is doc, set the new password
    if (
      !doc ||
      doc.signUpToken !== hashedToken ||
      !doc.signUpExpires > Date.now()
    ) {
      return next(new appError("Mã không hợp lệ hoặc đã hết hạn", 400));
    }
    doc.isVerified = true;
    doc.signUpToken = undefined;
    doc.signUpExpires = undefined;
    doc.code = undefined;
    await doc.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Đăng kí thành công!",
      doc,
    });
  });

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const doc = await User.findOne({ email: req.body.email });
  if (!doc) {
    return next(
      new appError("Không tồn tại người dùng với địa chỉ email!", 404)
    );
  }
  // 2) Generate the random reset token
  const resetToken = doc.createSignUpToken();
  await doc.save({ validateBeforeSave: false });
  try {
    const url = `${req.protocol}://${req.get("host")}/api/auth/verify-token/${
      doc.email
    }`;

    await new Email(doc, resetToken, url).sendPasswordReset();
    res.status(200).json({
      message: "Mã đã được gửi đến email!",
    });
  } catch (error) {
    doc.signUpResetExpires = undefined;
    doc.signUpToken = undefined;
    await doc.save({ validateBeforeSave: false });

    return next(
      new appError("Đã xuất hiện lỗi gửi email. Vui lòng thử lại!"),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get doc based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const doc = await User.findOne({ email: req.params.email }).select(
    "+signUpToken +signUpExpires"
  );
  // 2) If token has not expired, and there is doc, set the new password
  if (
    !doc ||
    doc.signUpToken !== hashedToken ||
    !doc.signUpExpires > Date.now()
  ) {
    return next(new appError("Mã không hợp lệ hoặc đã hết hạn", 400));
  }

  // 2) If token has not expired, and there is doc, set the new password
  doc.signUpToken = undefined;
  doc.signUpExpires = undefined;
  doc.code = undefined;
  doc.password = req.body.password;
  doc.passwordConfirm = req.body.passwordConfirm;
  await doc.save();

  res.status(200).json({
    message: "Đặt lại mật khẩu thành công. Xin vui lòng đăng nhập lại!",
  });
});

exports.verifiedToken = catchAsync(async (req, res, next) => {
  // 1) Get doc based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");
  const doc = await User.findOne({ email: req.params.email }).select(
    "+signUpToken +signUpExpires"
  );
  // 2) If token has not expired, and there is doc, set the new password
  if (
    !doc ||
    doc.signUpToken !== hashedToken ||
    !doc.signUpExpires > Date.now()
  ) {
    return next(new appError("Mã không hợp lệ hoặc đã hết hạn", 400));
  }
  res.status(200).json({
    message: "Mã của bạn là chính xác. Hãy đặt lại mật khẩu của bạn!",
  });
});

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});
exports.googleLoginCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err) {
        return next(err);
      }
      jwtToken.generateAndSendJWTToken(user, 200, res, req);
    }
  )(req, res, next);
};

exports.logout = catchAsync((req, res, next) => {
  res.cookie("jwt", "", { expires: new Date(Date.now() - 10 * 1000) });
  res.status(200).json({ status: "success" });
});
exports.protect = catchAsync(async (req, res, next) => {
  //1. Read the token & check if it exists
  let token = req.cookies.jwt;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3. If the user is exits
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new appError("Người dùng không tồn tại!", 401));
  }
  if (user.role == "Shipper" && user.isAccepted == false)
    return next(new appError("Người giao hàng chờ phê duyệt!", 401));
  if (user.role == "Owner" && user.isAccepted == false)
    return next(new appError("Chủ cửa hàng chờ phê duyệt!", 401));
  if (!token) {
    return next(new appError("Người dùng chưa đăng nhập!", 403));
  }
  // 4. Allow the user to access routes
  req.user = user;
  next();
});
exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      next(new appError("Bạn không có quyền thực hiện yêu cầu này.", 403));
    next();
  };
};
