const { Router } = require("express");
const { auth } = require("../middleware/authMiddleware");
const {
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  bookRoom, // ✅ New: Handles booking with room assignment, room count, email, etc.
  confirmBooking,
  adminCancelBooking,
} = require("../controllers/bookingController");

const router = Router();

// GET all bookings (admin use or future use)
router.get("/", auth, getBookings);

// GET single booking by ID
router.get("/:id", getBooking);

// POST a new booking for a specific room
router.post("/:id", auth, bookRoom); // ✅ New route

// PUT update booking
router.put("/:id", auth, updateBooking);


// Client cancels booking
router.delete("/:id", auth, cancelBooking);

// Admin cancels booking
router.delete("/admin/:id", auth, adminCancelBooking);

// Confirm booking (admin only)
router.put("/confirm/:id", auth, confirmBooking);

module.exports = router;
