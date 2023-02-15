const multer = require('multer');

//Define File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname)
    }
});

//Specify File Format  that can be saved

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        // To accept the file pass `true`, like so:
        cb(null, true)
    } else {
        // To reject this file pass `false`, like so:
        cb(null, false)
    }
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

}

// File Size Formatter
const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
    );
};

const upload = multer({ storage: storage, fileFilter })
module.exports = { upload, fileSizeFormatter  }