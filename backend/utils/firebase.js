// var serviceAccount = require("../key.json");
var admin = require("firebase-admin");
require("dotenv").config();
var serviceAccount = JSON.parse(process.env.serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://api-notify-70b0b-default-rtdb.firebaseio.com",
});

exports.notify = async function(storeId, orderId, isSeen = false) {
  var db = admin.database();
  const timestamp = admin.database.ServerValue.TIMESTAMP;
  if (isSeen == true) {
    await db
      .ref(storeId)
      .child(orderId)
      .update({
        isSeen: isSeen,
      });
  } else
    await db
      .ref(storeId)
      .child(orderId)
      .set({
        title: "Thông báo",
        message: `Bạn có đơn hàng mã ${orderId} đang chờ! Shipper đang đến nhé <3`,
        isSeen: isSeen,
        timestamp: timestamp,
      });
};
