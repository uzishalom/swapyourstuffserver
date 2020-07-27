const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const itemsController = require("../controllers/itemsController");
const uploadItemImage = require("../controllers/uploadFilesController");


router.get("/useritems", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.getUserItems(req1, res1);
    })

})


router.post("/additem", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.addItem(req1, res1);
    })

})

router.post("/uploaditemimage", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        uploadItemImage(req1, res1);
    })

})





module.exports = router;
