import "dotenv/config.js";

import express from "express";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import morgan from "morgan";
// import { runLocalTunnel } from "./utils/localTunnel.js";

import { connectDB } from "./db.js";
connectDB();

//middlware imports
import { checkGuest } from "./middlewares/authMiddleware.js";

//import routes
import indexRoutes from "./routes/indexRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import coinsRoutes from "./routes/coinsRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

//express config
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    exposedHeaders: ["api-key", "Authorization"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get("origin"));
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//basic injection security
app.use(mongoSanitize());
app.use(
  xss({
    allowedKeys: ["password"],
  })
);
// if (process.env.ENV === "development") app.use(morgan("tiny"));

//client
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/client/user/index.html"));
});

//routes
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/coins", coinsRoutes);
app.use("/api/tournament", tournamentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blog", blogRoutes);

//express error handling
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route does not exist",
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { message, status } = err;
  res.status(status).json({ message: message, status, error: err });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// runLocalTunnel(process.env.ENV, PORT);
