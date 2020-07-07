const userModel = require("../models/userModel");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("loadsh");

const addUser = async (req, res) => {

    let userToAdd = _.pick(req.body, ["name", "email", "password", "city", "phone"]);

    // input validation 
    let result = validateUser(userToAdd);
    if ("error" in result) {
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
    let user = await userModel.getUserByEmail(userToAdd.email);
    if (user != null) {
        res.status(400).json({
            "error": "EMAIL_EXIST"
        });
        return;
    }

    userToAdd.password = await getEncryptedPassword(userToAdd.password);

    let addUserId = await userModel.addUser(userToAdd);
    if (addUserId == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        newUserId: addUserId
    });

}

const getUser = async (req, res) => {
    if (req.user == null) {
        res.status(400).json({
            "error": "USER_NOT_AUTHENTICATED"
        });
        return;
    }

    let user = await userModel.getUserById(req.user._id)
    if (user == null) {
        res.status(400).json({
            "error": "USER_NOT_FOUND"
        });
        return;
    }

    res.json(_.pick(user, ["name", "email", "city", "phone", "createdAt"]));

}


// add cards to a user


const validateUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(2).max(255).required(),
        email: joi.string().min(6).max(255).required().email(),
        password: joi.string().min(6).max(1024).required(),
        biz: joi.boolean().required()
    })

    return schema.validate(user, {
        abortEarly: false
    });
}


const getEncryptedPassword = async (password) => {
    let salt = await bcrypt.genSalt(12);
    let encrypredPassword = await bcrypt.hash(password, salt);
    return encrypredPassword;
}


module.exports = {
    addUser,
    getUser,
}