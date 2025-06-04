const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model.Users || mongoose.model("User", userSchema);
