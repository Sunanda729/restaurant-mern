import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// ================= ENV CHECK =================

console.log("MONGO_URL:", process.env.MONGO_URL ? "Loaded ✅" : "Missing ❌");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");
console.log(
  "ADMIN_EMAIL:",
  process.env.ADMIN_EMAIL ? "Loaded ✅" : "Missing ❌"
);
console.log(
  "CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME ? "Loaded ✅" : "Missing ❌"
);

// ================= DATABASE =================

connectDB();

// ================= CLOUDINARY =================

connectCloudinary();

// ================= MIDDLEWARE =================

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://resturant-app-peach.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// ================= PORT =================

const PORT = process.env.PORT || 5000;

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Restaurant server is running",
  });
});

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/booking", bookingRoutes);

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});