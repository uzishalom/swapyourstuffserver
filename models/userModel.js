const mongodbModel = require("./mongodbModel");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongodbModel.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    city: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    phone: {
        type: String,
        maxlength: 25
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    stuff: {
        type: Array
    }
}, {
    collection: "users"
});

userSchema.methods.signUser = function () {
    return jwt.sign({
        _id: this._id
    }, config.get("jwtKey"));

};


const User = mongodbModel.model("User", userSchema);

const getUserByEmail = async (emailAddress) => {
    let result = await User.findOne({
        email: emailAddress
    })
    console.log("get by email result => " + result);
    return result;
}

const getUserById = async (userId) => {
    let result = await User.findById(userId);
    console.log("Get user by id => \n", result)
    return result;
}



const addUser = async (userObj,) => {
    let user = new User(userObj);
    let result = await user.save();
    console.log("result of user.save => \n" + result);
    return "id" in result ? result.id : null;

}

const updateUser = async (userToUpdate) => {
    let result = await User.findOneAndUpdate({
        _id: userToUpdate._id
    }, userToUpdate);
    console.log("result of user update => \n" + result);
    return result;
}



module.exports = {
    getUserById,
    getUserByEmail,
    addUser,
    updateUser
}