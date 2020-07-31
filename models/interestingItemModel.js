const mongoose = require("mongoose");
const mongodbModel = require("./mongodbModel");

const interestingItemSchema = mongodbModel.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    itemUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    interestedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    swapCandidateItems: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    collection: "interestingItems"
});

const InterestingItem = mongodbModel.model("InterestingItem", interestingItemSchema);

const addInterestingItems = async (interestingItemObjs) => {
    let interestingItemsToAdd = interestingItemObjs.map(interestingItem => new InterestingItem(interestingItem));

    let result = await InterestingItem.insertMany(interestingItemsToAdd);
    return result;
}

const deleteInterestingItemsForUser = async (itemIds, userId) => {
    let result = await InterestingItem.deleteMany({ itemId: { $in: itemIds }, interestedUserId: userId });
    return result;
}

const removeItem = async (itemId, userId) => {
    // remove all related items that the user suggested to swap with.
    let removeRelatedResult = await InterestingItem.update(
        {
            itemUserId: userId,
            swapCandidateItems: { $in: [itemId] }
        },
        {
            $pull:
            {
                swapCandidateItems:
                    { $in: [itemId] }
            }
        }
    );
    console.log(removeRelatedResult);

    if (removeRelatedResult == null) {
        return null;
    }

    // remove all interesting items for an item
    let deleteResult = await InterestingItem.deleteMany({ itemId: itemId });
    console.log(deleteReult);
    return deleteResult;
}



// Get all items that a specific user is interested in. 
const getUserInterestingItems = async (userId) => {
    let result = await InterestingItem.find({ interestedUserId: userId }, [], {
        skip: 0,
        limit: 100,
        sort: {
            lastUpdatedAt: -1 //Sort by Date Added DESC
        }
    }
    );
    return result;
}

// Get all records that belong to users that are interesting in a specific item. 
const getAllInterestedForItem = async (itemId) => {
    let result = await InterestingItem.find({ itemId: itemId }, [], {
        skip: 0,
        limit: 100,
        sort: {
            lastUpdatedAt: -1 //Sort by Date Added DESC
        }
    }
    );
    return result;
}












module.exports = {
    addInterestingItems,
    deleteInterestingItemsForUser,
    removeItem,
    getUserInterestingItems,
    getAllInterestedForItem,

}

