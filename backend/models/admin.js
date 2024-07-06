const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("../models/userModel");
const adminSchema = new mongoose.Schema({});
const Admin = User.discriminator("Admin", adminSchema);
module.exports = Admin;
