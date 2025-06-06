const mongoose = require("mongoose");
const Room = require("../models/roomModel");

// GET all rooms
const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    if (!rooms) {
      return res.status(400).json({ message: "Rooms not found" });
    }
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

// CREATE a new room
const createRoom = async (req, res, next) => {
  try {
    console.log("🧾 Incoming room data:", req.body);

    const {
      name,
      price,
      desc,
      roomCount,
      discountPrice,
      roomNumbers,
      img
    } = req.body;

    const parsedPrice = Number(price);
    const parsedRoomCount = roomCount ? Number(roomCount) : 0;
    const parsedDiscount = discountPrice && !isNaN(Number(discountPrice)) ? Number(discountPrice) : undefined;

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Price must be a valid number" });
    }

    const room = await Room.create({
      name,
      price: parsedPrice,
      desc,
      roomCount: parsedRoomCount,
      discountPrice: parsedDiscount,
      roomNumbers,
      img,
    });

    if (!room) {
      return res.status(400).json({ message: "Failed to create room" });
    }

    const rooms = await Room.find();
    return res.status(201).json(rooms);
  } catch (error) {
    console.error("❗ Error creating room:", error.message);
    next(error);
  }
};


// GET a single room by ID
const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(400).json({ message: "Room not found" });
    }
    return res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

// UPDATE room
const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(400).json({ message: "Cannot update room" });
    }

    return res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

// DELETE room
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(400).json({ message: "Room not deleted" });
    }

    return res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// ADD review
const addReview = async (req, res, next) => {
  try {
    console.log("📝 Review endpoint hit");

    const { name, message, rating } = req.body;
    const email = req.user?.email;

    if (!req.user || !name || !message || !email || typeof rating !== "number") {
      console.warn("⚠️ Missing required fields or unauthenticated");
      return res.status(400).json({ message: "All fields including rating are required" });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      console.warn("❌ Room not found");
      return res.status(404).json({ message: "Room not found" });
    }

    room.reviews.push({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      message,
      rating, // ✅ INCLUDE THIS
    });

    await room.save();
    console.log("✅ Review added:", { name, email, rating });

    return res.status(201).json({ message: "Review submitted" });
  } catch (error) {
    console.error("❗ Error adding review:", error);
    next(error);
  }
};


// GET reviews for room
const getReviews = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json(room.reviews || []);
  } catch (error) {
    next(error);
  }
};

// UPDATE review
const updateReview = async (req, res, next) => {
  const { message, email, rating } = req.body;

  if (!message || !email || typeof rating !== "number") {
    return res.status(400).json({ message: "Message, rating, and email required" });
  }

  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const review = room.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (req.user.email !== email && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    review.message = message;
    review.rating = rating;

    await room.save();
    return res.status(200).json({ message: "Review updated" });
  } catch (error) {
    next(error);
  }
};


// DELETE review
const deleteReview = async (req, res, next) => {
  try {
    console.log("🗑 Delete review endpoint hit");
    console.log("req.user:", req.user);

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const review = room.reviews.find((r) => r._id.toString() === req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (req.user.email !== review.email && !req.user.isAdmin) {
      return res.status(403).json({ message: "You are not authorized to delete this review" });
    }

    room.reviews = room.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    await room.save();
    console.log("✅ Review deleted:", review._id);

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("❗ Error deleting review:", error);
    next(error);
  }
};

module.exports = {
  getRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
};
