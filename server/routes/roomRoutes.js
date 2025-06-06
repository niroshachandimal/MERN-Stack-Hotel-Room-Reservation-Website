const { Router } = require("express");
const {
  getRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/roomController");
const { auth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/", getRooms);
router.post("/", auth, createRoom);
router.get("/:id", getRoom);
router.put("/:id", auth, updateRoom);
router.delete("/:id", auth, deleteRoom);

router.post("/:id/reviews", auth, addReview);
router.get("/:id/reviews", getReviews);
router.put("/:id/reviews/:reviewId", auth, updateReview);
router.delete("/:id/reviews/:reviewId", auth, deleteReview);

module.exports = router;
