import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { errorMiddleware } from "./utils/error.js"; // import middleware

dotenv.config();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database is connected!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Backend server is running!");
});

// Routes
app.use("/api/auth", authRoutes);

// Global error handler (must be after routes)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
