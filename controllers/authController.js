const bcrypt = require("bcrypt");
const _ = require("loadsh");
const Joi = require("joi-browser");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("config");



const authenticateUser = async (req, res) => {

    let loginDetails = _.pick(req.body, ["email", "password"]);

    // input validation 
    let result = validateLoginInput(loginDetails);
    if ("error" in result && result.error && "details" in result.error) {
        let errorDetails_ar = result.error.details.map(item => {
            let {
                type,
                message
            } = item;
            console.log("validation error type => ", type, "\nValaidation error message => ", message);
            return {
                "type": type,
                "message": message
            }
        })
        res.status(400).json({
            "error": errorDetails_ar
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
    const schema = Joi.object({
        email: Joi.string().required().email().label("Email"),
        password: Joi.string().required().min(6).max(10).label("Password"),
    })
    return schema.validate(loginDetails, {
        abortEarly: false
    });
}

module.exports = {
    authenticateUser,
    checkUserAuthentication
}

