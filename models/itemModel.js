const mongoose = require("mongoose");
const mongodbModel = require("./mongodbModel");
const interestingItemModel = require("./interestingItemModel");

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

const getItemById = async (itemId) => {
    let result = await Item.findById(itemId);
    return result;
}

const getItemsByIds = async (itemIds) => {
    let itemIdsAsObjectIds = itemIds.map(itemId => mongoose.Types.ObjectId(itemId));

    let result = await Item.find({ _id: { $in: [...itemIdsAsObjectIds] } });
    return result;
}

const getUserItems = async (userId) => {
    let result = await Item.find({ userId: userId }, [], {
        skip: 0,
        limit: 100,
        sort: {
            lastUpdatedAt: -1 //Sort by Date Added DESC
        }
    }
    );
    return result;
}

//
const getUserNotInterestingItems = async (userId) => {

    let userInterestingItems = await interestingItemModel.getUserInterestingItems(userId);
    let userInterestingItemsIds = userInterestingItems.map(interestingItem => interestingItem.itemId);

    let result = await Item.find({ userId: { $ne: userId }, swapped: false, _id: { $nin: [...userInterestingItemsIds] } }, [], {
        skip: 0,
        limit: 100,
        sort: {
            lastUpdatedAt: -1 //Sort by Date Added DESC
        }
    }
    );
    return result;
}

const getUserUnswappedItems = async (userId) => {
    let result = await Item.find({ userId: userId, swapped: false }, [], {
        skip: 0,
        limit: 100,
        sort: {
            lastUpdatedAt: -1 //Sort by Date Added DESC
        }
    }
    );
    return result;
}


const addItem = async (itemObj,) => {
    let item = new Item(itemObj);
    let result = await item.save();
    return "id" in result ? result.id : null;
}

const updateItem = async (itemToUpdate) => {
    itemToUpdate.lastUpdatedAt = Date.now();
    let result = await Item.findOneAndUpdate({
        _id: itemToUpdate._id
    }, itemToUpdate, { new: true });
    return result;
}

module.exports = {
    getItemById,
    addItem,
    updateItem,
    getUserItems,
    getUserUnswappedItems,
    getItemsByIds,
    getUserNotInterestingItems
}

