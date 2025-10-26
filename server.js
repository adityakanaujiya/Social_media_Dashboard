require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const multer = require("multer");
const connectDB = require("./config/database");
const initRedis = require("./config/redis");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

// ─────────────────────────────────────────────
// MIDDLEWARES
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ─────────────────────────────────────────────
// MULTER SETUP (profile/media uploads)
// ─────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Upload profile image
app.post("/api/upload", upload.single("media"), async (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Social Media Dashboard Backend is running successfully!");
});

// ─────────────────────────────────────────────
// SOCKET.IO SETUP (real-time chat)
// ─────────────────────────────────────────────
let usersOnline = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("login", (userId) => {
    usersOnline[socket.id] = userId;
    console.log("User logged in:", userId);
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    delete usersOnline[socket.id];
  });
});

// ─────────────────────────────────────────────
// DATABASE + REDIS CONNECTION + SERVER START
// ─────────────────────────────────────────────
(async () => {
  try {
    await connectDB();
    await initRedis();

    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () =>
      console.log(`✅ Backend running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup failed:", err);
  }
})();
