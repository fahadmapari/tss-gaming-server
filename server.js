import "dotenv/config.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
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

const app = express();

//express config
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// if (process.env.ENV === "development") app.use(morgan("tiny"));

//routes
app.get("/api/", (req, res) => {
  res.json({ message: "API Running" });
});

app.use("/api/auth", checkGuest, authRoutes);
app.use("/api/coins", coinsRoutes);
app.use("/api/tournament", tournamentRoutes);
app.use("/api/profile", profileRoutes);

//express error handling
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route does not exist",
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  const { message, status } = err;
  res.status(status).send({ message, status, error: err });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// runLocalTunnel(process.env.ENV, PORT);
