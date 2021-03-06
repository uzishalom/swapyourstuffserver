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
    lastUpdatedAt: {
        type: Date,
        default: Date.now
    },
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
    return result;
}

const getUserById = async (userId) => {
    let result = await User.findById(userId);
    return result;
}



const addUser = async (userObj,) => {
    let user = new User(userObj);
    let result = await user.save();
    return "id" in result ? result.id : null;

}

const updateUser = async (userToUpdate) => {
    userToUpdate.lastUpdatedAt = Date.now();
    let result = await User.findOneAndUpdate({
        _id: userToUpdate._id
    }, userToUpdate, { new: true });
    return result;
}



module.exports = {
    getUserById,
    getUserByEmail,
    addUser,
    updateUser
}