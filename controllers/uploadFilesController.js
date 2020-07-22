var multer = require("multer");
var path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/usersItemsImages')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id, +  path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single(''); // single is the text that the file name will start with. 

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
                res.json({ "status": "ok" })
                return;
            }
        }
    });
}
