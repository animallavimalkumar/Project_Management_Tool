require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

const User = mongoose.model("User", UserSchema);

// Project Schema & Model
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ["Active", "Completed"], default: "Active" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  completionDate: { type: Date }  // This will store the completion date when the project is marked as completed
});

const Project = mongoose.model("Project", ProjectSchema);

// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  const bearerToken = token.split(" ")[1];
  if (!bearerToken) return res.status(401).json({ error: "Access denied, malformed token" });

  try {
    const verified = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = verified;  // attach the user data to the request
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// User Signup
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// User Signin
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Create a Project
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Title, description, and category are required" });
    }

    const project = new Project({
      title,
      description,
      category,
      status: status || "Active", // Default status to "Active" if not provided
      userId: req.user.userId
    });

    await project.save();
    res.status(201).json({ message: "Project added", project });
  } catch (error) {
    console.error("Project Creation Error:", error);
    res.status(500).json({ error: "Failed to add project" });
  }
});

// Get all projects of a user
app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json(projects);
  } catch (err) {
    console.error("Fetch Projects Error:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Mark project as completed (PUT request)
app.put("/api/projects/:id/complete", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.status === "Completed") {
      return res.status(400).json({ error: "Project is already completed" });
    }

    project.status = "Completed";
    project.completionDate = new Date(); // Set completion date when marking as completed
    await project.save();

    res.json({ message: "Project marked as completed", project });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ error: "Failed to update project status" });
  }
});
// const ProjectSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   category: { type: String, required: true },
//   status: { type: String, enum: ["Active", "Completed"], default: "Active" },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   createdAt: { type: Date, default: Date.now },  // Automatically set the creation date
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
