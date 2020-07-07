const bcrypt = require("bcrypt");
const _ = require("loadsh");
const joi = require("@hapi/joi");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("config");



const authenticateUser = async (req, res) => {

    let loginDetails = _.pick(req.body, ["email", "password"]);

    // input validation 
    let result = validateLoginInput(loginDetails);
    if ("error" in result) {
        console.log(result.error.details[0].message);
        console.log(result.error.details[0].type);
        res.status(400).json({
            "error": "INVALID_PARAMETERS"
        });
        return;
    }

    // check if email exists
    let user = await userModel.getUserByEmail(loginDetails.email);
    if (user == null) {
        res.status(400).json({
            "error": "NO_USER"
        });
        return;
    }

    let isPasswordOK = await bcrypt.compare(loginDetails.password, user.password);
    console.log("Password Authentication => \n", isPasswordOK)

    if (isPasswordOK) {
        res.json({
            "token": user.signUser()
        })
    } else {
        res.status(400).json({
            "error": "WRONG_PASSWORD"
        })

    }

}

const checkUserAuthentication = (req, res, next) => {
    let token = req.header("x-auth-token");
    if (!token) {
        res.status(400).json({
            "error": "MISSING_TOKEN"
        })
        return;
    }

    try {
        req.user = jwt.verify(token, config.get("jwtKey"));
        next(req, res);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            "error": "INVALID_TOKEN"
        });

    }

}



const validateLoginInput = (loginDetails) => {
    const schema = joi.object({
        email: joi.string().min(6).max(255).required().email(),
        password: joi.string().min(6).max(1024).required(),
    })
    return schema.validate(loginDetails, {
        abortEarly: false
    });
}

module.exports = {
    authenticateUser,
    checkUserAuthentication
}