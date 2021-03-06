const interestingItemModel = require("../models/interestingItemModel");
const itemModel = require("../models/itemModel");


const addInterestingItems = async (req, res) => {

    // Prepare Interesting Items Objects
    let interestingItemsToSave = req.body;
    const itemIds = interestingItemsToSave.map(interestingItem => interestingItem.itemId);
    const items = await itemModel.getItemsByIds(itemIds);

    let itemIdsToUserIds = [];
    items.forEach(item => {
        itemIdsToUserIds[item._id] = item.userId;
    })

    interestingItemsToSave.forEach(interestingItem => {
        interestingItem.itemUserId = itemIdsToUserIds[interestingItem.itemId];
        interestingItem.interestedUserId = req.user._id
    })

    // Save to DB
    let insertedInterestingItems = await interestingItemModel.addInterestingItems(interestingItemsToSave);
    if (insertedInterestingItems == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    await itemModel.updateNumOfInterestedUsers(itemIds, true);

    res.json(insertedInterestingItems);
}

const deleteInterestingItemsForUser = async (req, res) => {
    let itemIdsToDelete = req.params.itemIds.split("-");
    let result = await interestingItemModel.deleteInterestingItemsForUser(itemIdsToDelete, req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    await itemModel.updateNumOfInterestedUsers(itemIdsToDelete, false)


    res.json(result);
}


const removeItem = async (itemId, userId) => {
    let result = await interestingItemModel.removeItem(itemId, userId);
    return result;
}

const getUserInterestingItems = async (req, res) => {
    let result = await interestingItemModel.getUserInterestingItems(req.user_id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({ userInterestingItems: result });
}

const getAllInterestedForItem = async (itemId) => {
    let result = await interestingItemModel.getAllInterestedForItem(itemId);
    return result;
}

module.exports = {
    addInterestingItems,
    deleteInterestingItemsForUser,
    removeItem,
    getUserInterestingItems,
    getAllInterestedForItem,
}
