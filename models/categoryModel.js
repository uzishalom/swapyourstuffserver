const mongodbModel = require("./mongodbModel");

var categories;

const categorySchema = mongodbModel.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },

}, {
    collection: "categories"
});

const Category = mongodbModel.model("Category", categorySchema);

const getCategories = async () => {
    if (!categories) {
        categories = await Category.find();
    }
    return categories;
}

const getCategoryById = async (categoryId) => {
    if (!categories) {
        await getCategories();
    }
    if (categories) {
        const filteredCategoriesById = categories.filter(category => category._id == categoryId);
        return filteredCategoriesById.length > 0 ? filteredCategoriesById[0] : null;
    }
    return null;
}


module.exports = {
    getCategories,
    getCategoryById,
}

