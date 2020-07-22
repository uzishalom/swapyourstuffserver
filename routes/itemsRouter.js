const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const itemsController = require("../controllers/itemsController");

router.post("/additem", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.addItem(req1, res1);
    })

})



module.exports = router;
