const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // CORS middleware
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();

// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const PORT = process.env.PORT || 4000;

// ⬇️ Connect to your database
database.connect();

// ⬇️ Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add file upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));

// ✅ ⬇️ Add this block here (CORS allowedOrigins)

const allowedOrigins = [                  
  'https://studynotion-studyplatform.vercel.app', // your deployed frontend
  'https://studynotion-nine-ruby.vercel.app', // your deployed frontend
  'http://localhost:5173', // local development
  'http://localhost:3000', // alternative local port
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow request
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if using cookies or auth
  })
);

// ⬇️ Cloudinary config
cloudinaryConnect();

// ⬇️ Route registrations
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// ⬇️ Default root route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ⬇️ Health check route for Vercel
app.get("/api/health", (req, res) => {
  return res.json({
    success: true,
    message: "Backend is healthy",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ⬇️ Start server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
