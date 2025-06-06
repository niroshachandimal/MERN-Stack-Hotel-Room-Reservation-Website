const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
     rating: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now },
    
  },
 
);


const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  img: {
    type: [String],
  },
  roomNumbers: {
    type: [
      {
        number: Number,
        unavailableDates: [Date],
      },
    ],
  },
  discountPrice: {
    type: Number,
  },
  reviews: [reviewSchema],
  roomCount: {
    type: Number,
  },
});

module.exports = mongoose.model("Room", roomSchema);