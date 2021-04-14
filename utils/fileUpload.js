import multer from "multer";
import path from "path";

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

export const uploadProfilePicture = multer({ storage: profilePictureStorage });
export const uploadGameThumbnails = multer({ storage: thumbnailsStorage });
