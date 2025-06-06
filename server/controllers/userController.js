// server/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// In-memory store for password reset codes
const resetCodes = {}; // { email: { code: "123456", expires: timestamp } }

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(400);
      throw new Error("users not found");
    }

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email && !password) {
      res.status(400);
      throw new Error("Please fill all required fields");
    }
    if (!email) {
      res.status(400);
      throw new Error("You must enter an email");
    }
    if (!password) {
      res.status(400);
      throw new Error("You must enter a password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("The email address you entered has already been registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    const token = generateToken(user._id);
    res.cookie("jwt", token);

    const { password: _, ...userWithoutPassword } = user._doc;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const registerClient = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email && !password) {
      res.status(400);
      throw new Error("Please fill all required fields");
    }
    if (!email) {
      res.status(400);
      throw new Error("You must enter an email");
    }
    if (!password) {
      res.status(400);
      throw new Error("You must enter a password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("The email address you entered has already been registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    const token = generateToken(user._id);
    res.cookie("jwt", token);

    const { password: _, ...userWithoutPassword } = user._doc;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please enter both email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("Incorrect email or password");
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      res.status(400);
      throw new Error("Incorrect email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("jwt", token);

    const { password: _, ...userWithoutPassword } = user._doc;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  res.cookie("jwt", "", { expires: new Date(0) });
  return res.json({ message: "you have been logged out" });
};

// Step 1: Send reset code
const sendResetCode = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: "Please enter your registered email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please enter your registered email" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes[email] = { code, expires: Date.now() + 10 * 60 * 1000 }; // 10 minutes

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Password Reset Code\n\n${code}\n\n- Serene Hills Hotel\n\nContact\nAddress:\nNo. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.\n\nPhone:\n+94552256789`,
    });

    res.status(200).json({ message: "Reset code sent" });
  } catch (error) {
    next(error);
  }
};

// Step 2: Verify reset code
const verifyResetCode = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    const stored = resetCodes[email];
    if (!stored || String(stored.code) !== String(code) || stored.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    res.status(200).json({ message: "Code verified" });
  } catch (error) {
    next(error);
  }
};


// Step 3: Update password
const updatePassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    delete resetCodes[email];

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Successful",
      text: `Password Reset Successful\n\nPlease note that your password has been successfully reset for the account.\n\n- Serene Hills Hotel\n\nContact\nAddress:\nNo. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.\n\nPhone:\n+94552256789`,
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/change-password
const changePassword = async (req, res, next) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Your old password was entered incorrectly." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/delete-account
const deleteAccount = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Incorrect email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect email or password" });

    // Check for active bookings if not admin
    if (!user.isAdmin) {
      const Booking = require("../models/bookingModel");
      const hasActive = await Booking.findOne({
        email,
        confirmed: false,
        status: { $ne: "Cancelled" },
      });
      if (hasActive) {
        return res.status(403).json({
          message:
            "We kindly request that you cancel your reservations before proceeding with account deletion.",
        });
      }
    }

    await User.deleteOne({ _id: user._id });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = {
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
};
