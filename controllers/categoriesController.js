const categoryModel = require("../models/categoryModel");

const getCategories = async (req, res) => {
    const result = await categoryModel.getCategories();
    if (result == null) {
        res.status(500).json({
            "error": "SERVER_ERROR"
        });
        return;
    }

    res.json({
        categories: result
    });

}

const getCategoryById = async (categoryId) => {
    return await categoryModel.getCategoryById(categoryId);
}

module.exports = {
    getCategories,
    getCategoryById,
}
