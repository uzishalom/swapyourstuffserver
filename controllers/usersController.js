const userModel = require("../models/userModel");
const Joi = require("joi-browser");
const bcrypt = require("bcrypt");
const _ = require("loadsh");

const addUser = async (req, res) => {

    let userToAdd = _.pick(req.body, ["name", "email", "password", "city", "phone"]);

    // input validation 
    let result = validateUser(userToAdd);
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


const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().required().min(4).max(25).label("Name"),
        email: Joi.string().required().email().label("Email"),
        password: Joi.string().required().min(6).max(10).label("Password"),
        city: Joi.string().required().label("City"),
        phone: Joi.string().min(9).max(10).regex(/^0[2-9]\d{7,8}$/).allow("").error(() => {
            return {
                message: "Phone must be between 9-10 digits and starting with 0"
            };
        }),

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