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

export default router;