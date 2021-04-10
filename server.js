import "dotenv/config.js";

import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./db.js";
connectDB();

//middlware imports
import { checkGuest } from "./middlewares/authMiddleware.js";

//import routes
import indexRoutes from "./routes/indexRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import coinsRoutes from "./routes/coinsRoutes.js";

const app = express();

//express config
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "public"));

//routes
app.use("/api/auth", checkGuest, authRoutes);
app.use("/api/coins", coinsRoutes);

//express error handling
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route does not exist",
  });
});

app.use((err, req, res, next) => {
  res.send(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
