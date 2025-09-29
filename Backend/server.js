const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Import configuration and utilities
const connectDB = require("./config/database");
const seedDatabase = require("./utils/seedDatabase");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const pharmacyRoutes = require("./routes/pharmacies");
const orderRoutes = require("./routes/orders");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Legacy admin route (for backward compatibility)
app.get("/api/admin/requests/:id", (req, res) => {
  // This endpoint can be removed or redirected to the proper order endpoint
  res.status(301).redirect(`/api/orders/${req.params.id}`);
});

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Seed database with initial data
    await seedDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
      console.log("🚀 MVC Backend Server Started Successfully!");
      console.log("📊 Database connected and seeded");
      console.log("🔗 API endpoints available at /api/*");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
