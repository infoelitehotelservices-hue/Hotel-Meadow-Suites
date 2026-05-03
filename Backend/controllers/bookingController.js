import bookingModel from "../models/bookingModel.js";
import roomModel from "../models/roomModel.js";
import nodemailer from 'nodemailer';
import pdfkit from 'pdfkit';
import fs from 'fs';

const createTransporter = () => nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.AUTH_EMAIL?.trim(), pass: process.env.AUTH_PASSWORD?.trim() },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

export const createBooking = async (req, res) => {
  const { customerName, number, roomId, checkInDate, checkOutDate, email, adults, children, specialRequests } = req.body;

  if (!customerName || !email || !roomId || !checkInDate || !checkOutDate || !number) {
    return res.status(400).json({ status: false, message: "Missing required fields" });
  }

  try {
    const checkInUTC = new Date(checkInDate).toISOString();
    const checkOutUTC = new Date(checkOutDate).toISOString();

    if (new Date(checkOutUTC) <= new Date(checkInUTC)) {
      return res.status(400).json({ status: false, message: "Check-out date must be after check-in date" });
    }

    const room = await roomModel.findById(roomId);
    if (!room) return res.status(404).json({ status: false, message: "Room not found" });

    const existingBooking = await bookingModel.findOne({
      room: roomId,
      bookingStatus: { $ne: "Cancelled" },
      checkInDate: { $lt: checkOutUTC },
      checkOutDate: { $gt: checkInUTC },
    });

    if (existingBooking) {
      return res.status(409).json({ status: false, message: "Room is already booked for the selected dates" });
    }

    const nights = Math.ceil((new Date(checkOutUTC) - new Date(checkInUTC)) / (1000 * 60 * 60 * 24));
    const effectivePrice = room.discountprice > 0 ? room.discountprice : room.pricePerNight;
    const subtotal = nights * effectivePrice;
    const totalAmount = +(subtotal * 1.15).toFixed(2);

    const bookingId = `BOOKING${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const booking = new bookingModel({
      _id: bookingId,
      customerName,
      number,
      email,
      room: roomId,
      checkInDate: checkInUTC,
      checkOutDate: checkOutUTC,
      adults: adults || 1,
      children: children || 0,
      specialRequests: specialRequests || "",
      totalAmount,
      bookingStatus: "Pending",
    });

    await booking.save();

    res.status(201).json({ status: true, message: "Booking created successfully.", bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ status: false, message: "No file uploaded" });

    const booking = await bookingModel.findById(id);
    if (!booking) return res.status(404).json({ status: false, message: "Booking not found" });

    // Normalize to a URL-friendly relative path (e.g. uploads/payment-proofs/file.jpg)
    booking.paymentProof = req.file.path.replace(/\\/g, "/").split("uploads/")[1]
      ? "uploads/" + req.file.path.replace(/\\/g, "/").split("uploads/")[1]
      : req.file.path.replace(/\\/g, "/");
    await booking.save();

    res.status(200).json({ status: true, message: "Payment proof uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const generateAndSendInvoice = async (booking) => {
  const room = await roomModel.findById(booking.room);
  if (!room) throw new Error("Room not found for invoice generation");

  const invoicePath = `./invoices/invoice_${booking._id}.pdf`;
  if (!fs.existsSync("./invoices")) fs.mkdirSync("./invoices", { recursive: true });

  const nights = Math.ceil(
    (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)
  );
  const discount = room.discountprice || 0;
  const effectivePrice = discount > 0 ? discount : room.pricePerNight;
  const subtotal = booking.totalAmount
    ? +(booking.totalAmount / 1.15).toFixed(2)
    : nights * effectivePrice;
  const taxAmount = +(subtotal * 0.15).toFixed(2);
  const totalAmount = +(subtotal + taxAmount).toFixed(2);

  await new Promise((resolve, reject) => {
    const doc = new pdfkit({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    doc.image("logo.png", 50, 50, { width: 60 });
    doc.fontSize(20).text("HOTEL INVOICE", 220, 60, { align: "right" });
    doc.fontSize(10).text("Meadows Hotel & Suites", 50, 120);
    doc.text("A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon, Karachi, Pakistan", 50, 135);
    doc.text("Phone: +92 371 1098946 | Email: info.elitehotelservices@gmail.com", 50, 150);

    doc.fontSize(12).text(`Invoice Number: ${booking._id}`, 50, 190);
    doc.text(`Issue Date: ${new Date().toDateString()}`, 50, 205);

    doc.text("Billed To:", 50, 250);
    doc.text(`Customer Name: ${booking.customerName}`, 50, 265);
    doc.text(`Email: ${booking.email}`, 50, 280);

    doc.fontSize(12).text("Booking Details", 50, 310);
    doc.font("Helvetica-Bold").text("Description", 50, 330);
    doc.text("Check-In", 250, 330);
    doc.text("Check-Out", 350, 330);
    doc.text("Amount (PKR)", 450, 330);
    doc.moveTo(50, 345).lineTo(550, 345).stroke();

    doc.font("Helvetica").text(room.name, 50, 360);
    doc.text(new Date(booking.checkInDate).toDateString(), 250, 360);
    doc.text(new Date(booking.checkOutDate).toDateString(), 350, 360);
    doc.text(`PKR ${room.pricePerNight} x ${nights} nights`, 450, 360);

    doc.moveTo(50, 390).lineTo(550, 390).stroke();

    let y = 405;
    doc.font("Helvetica").text("Subtotal:", 350, y);
    doc.text(`PKR ${subtotal.toFixed(2)}`, 450, y);
    y += 20;

    if (discount > 0) {
      doc.font("Helvetica").text("Discount applied:", 350, y);
      doc.text(`PKR ${discount} / night`, 450, y);
      y += 20;
    }

    doc.font("Helvetica").text("Tax SRB(15%):", 350, y);
    doc.text(`PKR ${taxAmount.toFixed(2)}`, 450, y);
    y += 20;

    doc.moveTo(350, y).lineTo(550, y).stroke();
    y += 8;
    doc.font("Helvetica-Bold").text("Total:", 350, y);
    doc.text(`PKR ${totalAmount.toFixed(2)}`, 450, y);
    y += 30;

    doc.moveTo(50, y).lineTo(550, y).stroke();
    doc.font("Helvetica").text("Payment Method: Bank Transfer", 50, y + 15);
    doc.text(`Status: ${booking.bookingStatus}`, 50, y + 35);

    doc.fontSize(10).text("Thank you for choosing our hotel!", 50, y + 80, { align: "center" });
    doc.text("For inquiries, contact info.elitehotelservices@gmail.com", 50, y + 100, { align: "center" });

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  const isConfirmed = booking.bookingStatus === "Confirmed";

  const emailHtml = isConfirmed
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a1a2e; padding: 28px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 26px; letter-spacing: 1px;">Meadows Hotel &amp; Suites</h1>
          <p style="color: #aaa; margin: 6px 0 0; font-size: 13px;">A-150 Gulshan e Iqbal Block 3, Karachi</p>
        </div>
        <div style="background-color: #D4AF37; padding: 14px; text-align: center;">
          <h2 style="color: #1a1a2e; margin: 0; font-size: 18px; letter-spacing: 1px;">✅ Booking Confirmed</h2>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <p style="color: #333; font-size: 15px;">Dear <strong>${booking.customerName}</strong>,</p>
          <p style="color: #555; font-size: 14px; line-height: 1.7;">We are delighted to confirm your reservation at <strong>Meadows Hotel &amp; Suites</strong>. Your stay is all set — we look forward to welcoming you!</p>

          <div style="background-color: #f9f6ef; border-left: 4px solid #D4AF37; border-radius: 4px; padding: 20px 24px; margin: 24px 0;">
            <h3 style="color: #1a1a2e; margin: 0 0 14px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Booking Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
              <tr><td style="padding: 6px 0; color: #888;">Booking ID</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking._id}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Room</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${room.name}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Check-In</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(booking.checkInDate).toDateString()}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Check-Out</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(booking.checkOutDate).toDateString()}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Duration</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${nights} Night${nights > 1 ? "s" : ""}</td></tr>
              <tr style="border-top: 1px solid #e0d9c8;"><td style="padding: 10px 0 4px; color: #1a1a2e; font-weight: bold; font-size: 15px;">Total Amount</td><td style="padding: 10px 0 4px; font-weight: bold; font-size: 15px; color: #D4AF37; text-align: right;">PKR ${totalAmount.toFixed(2)}</td></tr>
            </table>
          </div>

          <p style="color: #555; font-size: 13px; line-height: 1.7;">Your invoice is attached to this email. Please bring a copy (printed or digital) upon check-in.</p>
          <p style="color: #555; font-size: 13px; line-height: 1.7;">For any queries, feel free to reach us at <a href="mailto:info.elitehotelservices@gmail.com" style="color: #D4AF37;">info.elitehotelservices@gmail.com</a> or call <strong>+92 371 1098946</strong>.</p>
        </div>
        <div style="background-color: #1a1a2e; padding: 18px; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">Meadows Hotel &amp; Suites &bull; Karachi, Pakistan &bull; info.elitehotelservices@gmail.com</p>
        </div>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1a1a2e; padding: 28px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 26px; letter-spacing: 1px;">Meadows Hotel &amp; Suites</h1>
          <p style="color: #aaa; margin: 6px 0 0; font-size: 13px;">A-150 Gulshan e Iqbal Block 3, Karachi</p>
        </div>
        <div style="background-color: #c0392b; padding: 14px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 18px; letter-spacing: 1px;">❌ Booking Cancelled</h2>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <p style="color: #333; font-size: 15px;">Dear <strong>${booking.customerName}</strong>,</p>
          <p style="color: #555; font-size: 14px; line-height: 1.7;">We regret to inform you that your reservation at <strong>Meadows Hotel &amp; Suites</strong> has been <strong style="color: #c0392b;">cancelled</strong>.</p>

          <div style="background-color: #fff5f5; border-left: 4px solid #c0392b; border-radius: 4px; padding: 20px 24px; margin: 24px 0;">
            <h3 style="color: #1a1a2e; margin: 0 0 14px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;">Cancelled Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #444;">
              <tr><td style="padding: 6px 0; color: #888;">Booking ID</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${booking._id}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Room</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${room.name}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Check-In</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(booking.checkInDate).toDateString()}</td></tr>
              <tr><td style="padding: 6px 0; color: #888;">Check-Out</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${new Date(booking.checkOutDate).toDateString()}</td></tr>
            </table>
          </div>

          <p style="color: #555; font-size: 13px; line-height: 1.7;">If you believe this is a mistake or would like to make a new reservation, please contact us at <a href="mailto:info.elitehotelservices@gmail.com" style="color: #D4AF37;">info.elitehotelservices@gmail.com</a> or call <strong>+92 371 1098946</strong>.</p>
          <p style="color: #555; font-size: 13px; line-height: 1.7;">We hope to have the opportunity to welcome you in the future.</p>
        </div>
        <div style="background-color: #1a1a2e; padding: 18px; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">Meadows Hotel &amp; Suites &bull; Karachi, Pakistan &bull; info.elitehotelservices@gmail.com</p>
        </div>
      </div>
    `;

  await createTransporter().sendMail({
    from: process.env.AUTH_EMAIL,
    to: booking.email,
    subject: `Booking ${booking.bookingStatus} - Meadows Hotel & Suites`,
    html: emailHtml,
    attachments: isConfirmed
      ? [{ filename: `invoice_${booking._id}.pdf`, path: invoicePath }]
      : [],
  });

  if (fs.existsSync(invoicePath)) fs.unlinkSync(invoicePath);
};

export const fetchBookings = async (req, res) => {
  try {
    const { roomId, customerEmail, status, bookingId } = req.query;
    const filters = {};
    if (roomId) filters.room = roomId;
    if (customerEmail) filters.email = customerEmail;
    if (status) filters.bookingStatus = status;
    if (bookingId) filters._id = { $regex: bookingId, $options: "i" };

    const bookings = await bookingModel.find(filters).populate("room");
    res.status(200).json({ status: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInDate, checkOutDate, totalAmount, paymentStatus, bookingStatus } = req.body;

    const booking = await bookingModel.findById(id);
    if (!booking) return res.status(404).json({ status: false, message: "Booking not found" });

    const prevStatus = booking.bookingStatus;
    const newCheckInDate = checkInDate ? new Date(checkInDate).toISOString() : booking.checkInDate;
    const newCheckOutDate = checkOutDate ? new Date(checkOutDate).toISOString() : booking.checkOutDate;

    if (checkInDate || checkOutDate) {
      const overlappingBooking = await bookingModel.findOne({
        room: booking.room,
        _id: { $ne: id },
        bookingStatus: { $ne: "Cancelled" },
        checkInDate: { $lt: newCheckOutDate },
        checkOutDate: { $gt: newCheckInDate },
      });
      if (overlappingBooking) {
        return res.status(409).json({ status: false, message: "Room is already booked for the selected dates" });
      }
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      id,
      { $set: { checkInDate: newCheckInDate, checkOutDate: newCheckOutDate, totalAmount, paymentStatus, bookingStatus } },
      { new: true }
    );

    // Send email + invoice when admin confirms or cancels
    if (bookingStatus && bookingStatus !== prevStatus && (bookingStatus === "Confirmed" || bookingStatus === "Cancelled")) {
      try {
        await generateAndSendInvoice(updatedBooking);
      } catch (emailError) {
        console.error("Failed to send status email:", emailError);
      }
    }

    res.status(200).json({ status: true, message: "Booking updated successfully", updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingModel.findById(id);
    if (!booking) return res.status(404).json({ status: false, message: "Booking not found" });

    booking.bookingStatus = "Cancelled";
    await booking.save();

    res.status(200).json({ status: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getRevenueData = async (req, res) => {
  try {
    const revenueData = await bookingModel.aggregate([
      { $match: { bookingStatus: "Confirmed" } },
      { $group: { _id: { $month: "$checkInDate" }, revenue: { $sum: "$totalAmount" }, bookings: { $sum: 1 } } },
      { $project: { month: "$_id", revenue: 1, bookings: 1, _id: 0 } },
      { $sort: { month: 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = revenueData.map((item) => ({
      month: monthNames[item.month - 1],
      revenue: item.revenue,
      bookings: item.bookings,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const recentBookings = await bookingModel.find().sort({ createdAt: -1 }).limit(5).populate("room", "name");
    res.status(200).json(recentBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recent bookings" });
  }
};

export const getTotalRevenue = async (req, res) => {
  try {
    const result = await bookingModel.aggregate([
      { $match: { bookingStatus: "Confirmed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    res.status(200).json({ totalRevenue: result[0]?.totalRevenue || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ totalRevenue: 0 });
  }
};

export const getPendingBookingsCount = async (req, res) => {
  try {
    const count = await bookingModel.countDocuments({ bookingStatus: "Pending" });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching pending bookings count" });
  }
};
