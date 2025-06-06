const { Router } = require("express");
const {
  getUsers,
  registerClient,
  registerAdmin,
  loginUser,
  logoutUser,
  sendResetCode,
  verifyResetCode,
  updatePassword,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const { auth } = require("../middleware/authMiddleware");

const router = Router();

// GET all users (admin access only recommended)
router.get("/", auth, getUsers);

// POST /api/users/register → Client registration
router.post("/register", registerClient);

// POST /api/users/admin-register → Admin registration
router.post("/admin-register", registerAdmin);

// POST /api/users/login → Login
router.post("/login", loginUser);

// GET /api/users/logout → Logout
router.get("/logout", logoutUser);

// NEW: Forgot Password Routes
router.post("/reset", sendResetCode);           // Step 1: Request code
router.post("/verify-reset", verifyResetCode);  // Step 2: Verify code
router.post("/update-password", updatePassword); // Step 3: Set new password

router.post("/change-password", changePassword);
router.delete("/delete-account", deleteAccount);

module.exports = router;
