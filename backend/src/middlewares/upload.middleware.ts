import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/cv",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      return cb(new Error("Only PDF allowed"));
    }
    cb(null, true);
  }
});
