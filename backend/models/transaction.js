const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
  vnp_Amount: {
    type: String,
  },
  vnp_BankCode: {
    type: String,
  },
  vnp_BankTranNo: {
    type: String,
  },
  vnp_CardType: {
    type: String,
  },
  vnp_OrderInfo: {
    type: String,
  },
  vnp_PayDate: {
    type: String,
  },
  vnp_ResponseCode: {
    type: String,
  },
  vnp_TmnCode: {
    type: String,
  },
  vnp_TransactionNo: {
    type: String,
  },
  vnp_TransactionStatus: {
    type: String,
  },
  vnp_TxnRef: {
    type: String,
  },
  vnp_SecureHash: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = mongoose.model("Transaction", transactionSchema);
