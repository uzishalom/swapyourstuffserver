const interestingItemModel = require("../models/interestingItemModel");
const itemsController = require("./itemsController");

const addInterestingItems = async (req, res) => {

    // Prepare Interesting Items Objects
    let interestingItemsToSave = req.body;
    const itemIds = interestingItemsToSave.map(interestingItem => interestingItem.itemId);
    const items = await itemsController.getItemsByIds(itemIds);

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

    res.json(insertedInterestingItems);
}

const deleteInterestingItemsForUser = async (req, res) => {
    let result = await interestingItemModel.deleteInterestingItemsForUser(req.body.itemIds, req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json(result);
}


const removeItem = async (req, res) => {
    let result = await interestingItemModel.removeItem(req.body.itemId, req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json(result);
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

const getAllInterestedForItem = async (req, res) => {
    let result = await interestingItemModel.getAllInterestedForItem(req.body.itemId);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({ interestedForItem: result });

}

module.exports = {
    addInterestingItems,
    deleteInterestingItemsForUser,
    removeItem,
    getUserInterestingItems,
    getAllInterestedForItem,
}
