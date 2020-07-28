const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");




router.get("/", (req, res) => {
    res.status(404).send("*** 404 NOT FOUND 404 ***");
})

router.get("/me", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        usersController.getUser(req1, res1);
    })

})

router.get("/:id", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        usersController.getUserById(req1, res1);
    })

})

router.post("/adduser", (req, res) => {
    usersController.addUser(req, res);
});



router.put("/updateUser", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        usersController.updateUser(req1, res1);
    })

})

router.put("/changepassword", (req, res) => {
    authController.checkUserAuthentication(req, res, (req1, res1) => {
        usersController.changeUserPassword(req1, res1);
    })

})

router.put("/forgotpassword", (req, res) => {
    usersController.forgotPassword(req, res);
})


module.exports = router;