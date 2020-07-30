const interestingItemModel = require("../models/interestingItemModel");

const addInterestingItems = async (req, res) => {
    let insertedInterestingItems = await interestingItemModel.addInterestingItems(req.body.insertingItems);
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
