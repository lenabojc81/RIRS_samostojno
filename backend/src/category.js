import express from 'express';
import Category from './models/category.js';

const router = express.Router();

router.get('/allCategories', async (req, res) => {
    try {
        const categories = await Category.find();
        // console.log('catagories fetched');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/newCategory', async (req, res) => {
    const category = req.body;
    const newCategory = new Category(category);
    try {
        if (!category.name) {
            return res.status(400).send('Category name is required');
        }

        const existingCategory = await Category.findOne({ name: category.name });
        if (existingCategory) {
            return res.status(401).send('Category with this name already exists');
        }

        await newCategory.save();
        res.status(200).send('new category saved');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.delete('/deleteCategory/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const deletedCategory = await Category.findOneAndDelete({ name });
        // if (!deletedCategory) {
        //     return res.status(404).send('Category not found');
        // }
        res.status(200).send('Category deleted successfully');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default router;