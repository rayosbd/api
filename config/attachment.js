const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

exports.upload = multer({
  storage: multer.diskStorage({
    destination: "../file_bucket",
    filename: (req, file, cb) => {
      //   console.log(file);
      cb(
        null,
        uuidv4() + "-" + Date.now()
        // +
        //   "-" +
        //   file.originalname
        //     .replace(" ", "")
        //     // .replace(/[^\w\s]/gi, "")
        //     .toLowerCase()
      );
    },
  }),
});
