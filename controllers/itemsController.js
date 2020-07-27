const itemModel = require("../models/itemModel");
const categoriesController = require("./categoriesController");
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


const addItem = async (req, res) => {

    let itemToAdd = _.pick(req.body, ["title", "description", "categoryId", "image"]);

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
        image: Joi.any()
    })

    return schema.validate(item, {
        abortEarly: false,
        allowUnknown: true
    });
}

module.exports = {
    addItem,
    setImageItem,
    getUserItems,
}


