const itemModel = require("../models/itemModel");
const categoriesController = require("./categoriesController");
const interestingItemsController = require("./interestingItemsController");
const Joi = require("joi-browser");
const _ = require("loadsh");


const getUserItems = async (req, res) => {
    const result = await itemModel.getUserItems(req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        userItems: result
    });

}

const getUserUnswappedItems = async (req, res) => {
    const result = await itemModel.getUserUnswappedItems(req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        userItems: result
    });

}

const getItemsByIds = async (itemIds) => {
    return await itemModel.getItemsByIds(itemIds);
}

const getUserInterestingItems = async (req, res) => {
    const result = await itemModel.getUserInterestingItems(req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        items: result
    });

}


const getUserNotInterestingItems = async (req, res) => {
    const result = await itemModel.getUserNotInterestingItems(req.user._id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        items: result
    });

}


const getSuggestedSwapItems = async (req, res) => {
    const itemId = req.params.id;

    if (!itemId) {
        res.status(400).json({
            "error": "NO_ITEM"
        });
        return;
    }

    // Get all that are interested in this item
    const interestingsForItem = await interestingItemsController.getAllInterestedForItem(itemId);
    if (interestingsForItem == null) return null;

    let suggestedToSwapItemIds = [];

    interestingsForItem.forEach(interestingItem => {
        interestingItem.swapCandidateItems.forEach(suggestedItemId => {
            suggestedToSwapItemIds.push(suggestedItemId)
        })
    })

    const result = await itemModel.getUnswappedItemsByIds(suggestedToSwapItemIds);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        items: result
    });

}

const getItem = async (req, res) => {
    const result = await itemModel.getItemById(req.params.id);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        item: result
    });

}


const addItem = async (req, res) => {

    let itemToAdd = _.pick(req.body, ["title", "description", "categoryId"]);

    // input validation 
    let result = validateItem(itemToAdd);
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

    // check category 
    const category = await categoriesController.getCategoryById(itemToAdd.categoryId);
    if (!category) {
        res.status(400).json({ "error": "CATEGORY_NOT_FOUND" });
        return;
    }

    // add the item
    itemToAdd.userId = req.user._id;
    let addedItemId = await itemModel.addItem(itemToAdd);
    if (addedItemId == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        newItemId: addedItemId
    });

}

const updateItem = async (req, res) => {

    let itemToUpdate = _.pick(req.body, ["_id", "swapped", "numOfInterestedUsers", "title", "description", "categoryId",]);

    // get current item
    let currentItem = await itemModel.getItemById(itemToUpdate._id);
    if (currentItem == null) {
        res.status(400).json({
            "error": "NO_ITEM"
        });
        return;
    }

    // Check if unauthorized user tries to update item deatils that it is not allowed to.
    if (currentItem.userId != req.user._id && (
        itemToUpdate.swapped != currentItem.swapped ||
        itemToUpdate.title != currentItem.title ||
        itemToUpdate.description != currentItem.description ||
        itemToUpdate.categoryId != currentItem.categoryId)) {
        res.status(401).json({
            "error": "ACCESS_DENIED"
        });
        return;
    }

    // input validation 
    let result = validateItemForUpdate(itemToUpdate);
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

    const itemSwapped = itemToUpdate.swapped && !currentItem.swapped;
    if (itemSwapped) {
        let numOfDeletedRecords = await interestingItemsController.removeItem(itemToUpdate._id, req.user._id);
        itemToUpdate.numOfInterestedUsers -= numOfDeletedRecords;
        if (itemToUpdate.numOfInterestedUsers < 0) {
            itemToUpdate.numOfInterestedUsers = 0;
        }
    }


    let updatedItem = await itemModel.updateItem(itemToUpdate);
    if (updatedItem == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }


    res.json(updatedItem);
}

const setImageItem = async (itemId, imagePath) => {

    let item = await itemModel.getItemById(itemId);
    if (item == null) {
        return false;
    }

    item.image = imagePath;

    let updatedItem = await itemModel.updateItem(item);
    return updatedItem != null;

}


const validateItem = (item) => {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(50).label("Title"),
        description: Joi.string().required().min(5).max(4000).label("Description"),
        categoryId: Joi.string().required().min(1).max(4000).error(() => {
            return {
                message: "Please Choose Category"
            };
        }),
    })

    return schema.validate(item, {
        abortEarly: false,
        allowUnknown: true
    });
}

const validateItemForUpdate = (item) => {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(50).label("Title"),
        description: Joi.string().required().min(5).max(4000).label("Description"),
        categoryId: Joi.string().required().min(1).max(4000).error(() => {
            return {
                message: "Please Choose Category"
            };
        }),
        swapped: Joi.boolean().required().label("Swapped"),
        numOfInterestedUsers: Joi.number().min(0).required().label("Number Of Interested Users"),
    })

    return schema.validate(item, {
        abortEarly: false,
        allowUnknown: true
    });
}

const updateNumOfInterestedUsers = async (itemIds, add) => {
    await itemModel.updateNumOfInterestedUsers(itemIds, add);
}

const deleteItem = async (req, res) => {
    itemId = req.params.id;

    let items = await getItemsByIds([itemId]);

    if (!items || items.length == 0) {
        res.status(400).json({
            "error": "NO_ITEM"
        });
        return;
    }

    let item = items[0];

    if (item.userId != req.user._id) {
        res.status(401).json({
            "error": "ACCESS_DENIED"
        });
        return;
    }

    let relatedDataRemovalResult = await interestingItemsController.removeItem(itemId, req.user._id);
    if (relatedDataRemovalResult == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    let result = await itemModel.deleteItem(itemId);
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json(result);
}



module.exports = {
    addItem,
    updateItem,
    updateNumOfInterestedUsers,
    setImageItem,
    deleteItem,
    getUserItems,
    getUserUnswappedItems,
    getItemsByIds,
    getUserInterestingItems,
    getUserNotInterestingItems,
    getSuggestedSwapItems,
    getItem,
}


