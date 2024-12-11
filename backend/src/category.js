import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const filePath = path.join(process.cwd(), 'data', 'categories.json');

const readCategories = async () => {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

const writeCategories = async (categories) => {
    await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
};

router.get('/allCategories', async (req, res) => {
    try {
        const categories = await readCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Add a new category
router.post('/newCategory', async (req, res) => {
    const category = req.body;

    try {
        if (!category.name) {
            return res.status(400).send('Category name is required');
        }

        const categories = await readCategories();

        // Check if the category already exists
        if (categories.some((cat) => cat.name === category.name)) {
            return res.status(401).send('Category with this name already exists');
        }

        const newCategory = {
            _id: { $oid: new Date().getTime().toString() },
            name: category.name,
        };

        categories.push(newCategory);
        await writeCategories(categories);
        res.status(200).send('New category saved');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Delete a category by name
router.delete('/deleteCategory/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const categories = await readCategories();

        const updatedCategories = categories.filter((cat) => cat.name !== name);

        if (updatedCategories.length === categories.length) {
            return res.status(404).send('Category not found');
        }

        await writeCategories(updatedCategories);
        res.status(200).send('Category deleted successfully');
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default router;
