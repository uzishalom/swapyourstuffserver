const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const itemsController = require("../controllers/itemsController");
const interestingItemsController = require("../controllers/interestingItemsController");
const uploadItemImage = require("../controllers/uploadFilesController");


router.get("/useritems", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.getUserItems(req1, res1);
    })
})

router.get("/userunswappeditems", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.getUserUnswappedItems(req1, res1);
    })
})

router.get("/userinterestingitems", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        interestingItemsController.getUserInterestingItems(req1, res1);
    })
})

router.get("/allinterestedforitem", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        interestingItemsController.getAllInterestedForItem(req1, res1);
    })
})

router.get("/itemstosearch", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.getUserNotInterestingItems(req1, res1);
    })
})


router.post("/additem", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.addItem(req1, res1);
    })
})

router.post("/addinterestingitems", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        interestingItemsController.addInterestingItems(req1, res1);
    })
})


router.put("/updateitem", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        itemsController.updateItem(req1, res1);
    })
})


router.put("/uploaditemimage", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        uploadItemImage(req1, res1);
    })
})

router.delete("/deleteinterestingitems/:itemIds", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        interestingItemsController.deleteInterestingItemsForUser(req1, res1);
    })
})






module.exports = router;
