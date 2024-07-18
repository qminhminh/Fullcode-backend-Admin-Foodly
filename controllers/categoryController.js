const Category = require('../models/Category');

module.exports = {

    createCategory: async (req, res) => {
        const newCategory = new Category(req.body);
        try {
            await newCategory.save();
            res.status(201).json({ status: true, message: "Category created successfully" });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getAllCategories: async (req, res) => {
        console.log(req.query);
        const page   = req.query.page || 1;
        const ITEMS_PER_PAGE = req.query.limit || 8;
        try {
            const categories = await Category.find({ title: { $ne: "More" } }, { __v: 0, createdAt: 0, updatedAt: 0})
                .sort({ createdAt: -1 })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
            const totalItems = await Category.countDocuments({ title: { $ne: "More" } });
            
            res.status(200).json({
                categories,
                currentPage: +page,
                totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
};