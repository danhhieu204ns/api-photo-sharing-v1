const mongoose = require("mongoose");


const photoSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  file_name: { type: String },
  date_time: { type: Date, default: Date.now },
  user_id: {
    type: String,
    ref: "User",
  },
  comments: [{
    type: String,
    ref: 'Comment'
  }],
});


const Photo = mongoose.model.Photos || mongoose.model("Photos", photoSchema);

module.exports = Photo;
