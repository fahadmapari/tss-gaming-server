import multer from "multer";
import path from "path";
import { AppError } from "./AppError.js";

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile-pictures/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const thumbnailsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/thumbnails/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new AppError("Only .png, .jpg and .jpeg format allowed!", 400));
    }
  },
});
export const uploadGameThumbnails = multer({
  storage: thumbnailsStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new AppError("Only .png, .jpg and .jpeg format allowed!", 400));
    }
  },
});
