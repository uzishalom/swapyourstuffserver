var multer = require("multer");
var path = require("path");
var config = require("config");
var itemsController = require("./itemsController");




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/" + config.get("itemsImagesFolder"));
    },
    filename: function (req, file, cb) {
        cb(null, req.header("itemId") + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single("file"); // single is the text that the file name will start with. 

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const uploadItemImage = (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ "error": "UPLOAD_SERVER_ERROR" });
            return;
        } else {
            if (req.file == undefined) {
                console.log(err);
                res.status(400).json({ "error": "UPLOAD_NO_FILE" });
                return;
            } else {
                updateImageForItem(req, res);
                return;
            }
        }
    });
}

const updateImageForItem = (req, res) => {
    const itemId = req.header("itemId");
    const imagePath = config.get("itemsImagesFolder") + "/" + req.header("itemId") + req.header("fileExt");
    let result = itemsController.setImageItem(itemId, imagePath);
    if (!result) {
        res.status(500).json({ "error": "UPDATING_IMAGE_TO_ITEM" });
        return;
    }
    res.json({ "status": "ok" });
}

module.exports = uploadItemImage;
