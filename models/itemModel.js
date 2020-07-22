const mongoose = require("mongoose");
const mongodbModel = require("./mongodbModel");

const itemSchema = mongodbModel.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },

    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 4000,
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    image: {
        type: String,
        maxlength: 255,
        default: ""
    },
    swapped: {
        type: Boolean,
        default: false
    },
    numOfInterestedUsers: {
        type: Number,
        default: 0
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
    collection: "items"
});

const Item = mongodbModel.model("Item", itemSchema);

const addItem = async (itemObj,) => {
    let item = new Item(itemObj);
    let result = await item.save();
    console.log("result of item.save => \n" + result);
    return "id" in result ? result.id : null;
}

module.exports = {
    addItem,
}

