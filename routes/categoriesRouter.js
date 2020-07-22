const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const categoriesController = require("../controllers/categoriesController");

router.get("/", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        categoriesController.getCategories(req1, res1);
    })
})


module.exports = router;
