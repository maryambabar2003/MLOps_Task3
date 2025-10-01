import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());

// Allow requests from React frontend
app.use(cors({ origin: "http://localhost:5173" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/usersdb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: Number,
  phone: String,
  address: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

// Routes
// ➤ Add user
app.post("/users", async (req, res) => {
  try {
    const { name, email, age, phone, address, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const newUser = new User({ name, email, age, phone, address, role });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
