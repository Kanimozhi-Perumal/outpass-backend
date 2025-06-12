const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process on database connection failure
  });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("❌ Database Error:", err);
});

db.once("open", () => {
  console.log("✅ Database Connection Established");
});

// Routes
app.use("/api/auth", require("./routes/auth"));      // ✅ other route
app.use("/api/outpass", require("./routes/outpass")); // ✅ other route
app.use("/api", require("./routes/testRoute"));       // ✅ fixed test route import

console.log("✅ Routes Loaded Successfully");

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
