// server/controllers/bookingController.js
const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const nodemailer = require("nodemailer");

// POST /api/bookings/:id → create booking for a room
const bookRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { name, email, checkIn, checkOut, mobile } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!name || !email || !checkIn || !checkOut || !mobile) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (email !== req.user.email) {
      return res
        .status(400)
        .json({ message: "Please enter the registered email" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const availableRoom = room.roomNumbers.find(
      (rn) => rn.unavailableDates.length === 0
    );

    if (!availableRoom) {
      return res
        .status(400)
        .json({ message: "No available room numbers" });
    }

    // Reserve the room number
    availableRoom.unavailableDates = [checkIn, checkOut];
    room.roomCount = Math.max(room.roomCount - 1, 0);
    await room.save();

    const booking = await Booking.create({
      name,
      email,
      mobile,
      room: room._id,
      roomNumber: availableRoom.number,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      confirmed: false,
    });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation - Serene Hills Hotel",
      text: `
Your booking was successful.

Room: ${room.name}
Room Number: ${availableRoom.number}
Check In Date: ${checkIn}
Check Out Date: ${checkOut}

- Serene Hills Hotel

Address:
No. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.

Phone:
+94552256789
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Booking successful" });
  } catch (error) {
    console.error("❌ Booking error:", error);
    next(error);
  }
};

// GET /api/bookings
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("room");
    return res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/:id
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

// PUT /api/bookings/:id
const updateBooking = async (req, res, next) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// CANCEL booking
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Mark booking as cancelled
    booking.status = "Cancelled";
    booking.cancelledByAdmin = false;

    // Restore room count and room number availability
    const room = await Room.findById(booking.room);
    if (room) {
      room.roomCount += 1;

      const roomNumber = room.roomNumbers.find(
        (rn) => rn.number === booking.roomNumber
      );

      if (roomNumber) {
        roomNumber.unavailableDates = [];
      }

      await room.save();
    }

    await booking.save();

    // Send cancellation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Booking Cancellation - Serene Hills Hotel",
      text: `
Your booking cancellation was successful.

Room: ${booking.room?.name || "N/A"}
Room Number: ${booking.roomNumber}
Check In Date: ${booking.checkInDate?.toDateString()}
Check Out Date: ${booking.checkOutDate?.toDateString()}

- Serene Hills Hotel

Contact
Address:
No. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.

Phone:
+94552256789
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("❌ Booking cancellation error:", error);
    next(error);
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.confirmed = true;
    booking.status = "Confirmed";
    await booking.save();

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Room Confirmed - Serene Hills Hotel",
      text: `
Thank You for choosing us. Enjoy your time in Serene Hills Hotel.

Room: ${booking.room?.name || "N/A"}
Room Number: ${booking.roomNumber}
Check In Date: ${booking.checkInDate.toDateString()}
Check Out Date: ${booking.checkOutDate.toDateString()}

- Serene Hills Hotel

Contact
Address:
No. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.

Phone:
+94552256789
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Booking confirmed successfully" });
  } catch (error) {
    next(error);
  }
};


const adminCancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "Cancelled";
    booking.cancelledByAdmin = true;

    // Restore room availability
    const room = await Room.findById(booking.room);
    if (room) {
      room.roomCount += 1;

      const roomNumber = room.roomNumbers.find(
        (rn) => rn.number === booking.roomNumber
      );

      if (roomNumber) {
        roomNumber.unavailableDates = [];
      }

      await room.save();
    }

    await booking.save();

    // Send cancellation email to client
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Reservation Cancelled - Serene Hills Hotel",
      text: `
Your booking has been canceled by an administrator. Please contact us for more information.

- Serene Hills Hotel

Contact
Address:
No. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.

Phone:
+94552256789
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Admin cancelled the booking." });
  } catch (error) {
    console.error("❌ Admin cancellation error:", error);
    next(error);
  }
};



module.exports = {
  bookRoom,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  confirmBooking,
  adminCancelBooking,

};
