const request = require('supertest');
const { app, server } = require('../index');
const fs = require('fs/promises');
const path = require('path');

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
const transactionsPath = path.join(process.cwd(), 'data', 'transactions.json');

const resetJSONFile = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
const readJSONFile = async (filePath) => {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

let originalCategories;
let originalTransactions;

beforeAll(async () => {
    originalCategories = await readJSONFile(categoriesPath);
    originalTransactions = await readJSONFile(transactionsPath);
});

afterAll(async () => {
    await resetJSONFile(categoriesPath, originalCategories);
    await resetJSONFile(transactionsPath, originalTransactions);
    server.close();
});

describe('API Endpoints', () => {
    test('GET /getTransactions - should return status code 200', async () => {
        const res = await request(app).get('/transaction/getTransactions');
        expect(res.statusCode).toBe(200);
    }, 10000);

    test('GET /getTransactions - should return an array of transactions', async () => {
        const res = await request(app).get('/transaction/getTransactions');
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).not.toHaveLength(0);
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('amount');
        expect(res.body[0]).toHaveProperty('expense');
        expect(res.body[0]).toHaveProperty('date');
    }, 10000);

    test('POST /newTransaction - should return status code 200', async () => {
        const newTransaction = { name: 'New Transaction', amount: 200, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).post('/transaction/newTransaction').send(newTransaction);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('New transaction saved');
    }, 10000);

    test('POST /newTransaction - should add a new transaction', async () => {
        const newTransaction = { name: 'Another Transaction', amount: 150, expense: true, date: new Date(), category: 'food' };
        const res = await request(app).post('/transaction/newTransaction').send(newTransaction);
        const transactions = await readJSONFile(transactionsPath);
        const addedTransaction = transactions.find((t) => t.name === 'Another Transaction');
        expect(addedTransaction).toBeDefined();
    }, 10000);

    test('POST /newTransaction - should return status code 400 for missing required fields', async () => {
        const invalidTransaction = { amount: 200 };
        const res = await request(app).post('/transaction/newTransaction').send(invalidTransaction);
        expect(res.statusCode).toBe(400);
    }, 10000);

    test('PUT /editTransaction/:id - should return status code 200', async () => {
        const updatedData = { name: 'Updated Transaction', amount: 300, expense: false, date: new Date(), category: 'saving' };
        const transactions = await readJSONFile(transactionsPath);
        const transactionId = transactions[0]._id.$oid;

        const res = await request(app).put(`/transaction/editTransaction/${transactionId}`).send(updatedData);
        expect(res.statusCode).toBe(200);
    }, 10000);

    test('PUT /editTransaction/:id - should return updated transaction', async () => {
        const updatedData = { name: 'Updated Transaction', amount: 300, expense: false, date: new Date(), category: 'saving' };
        const transactions = await readJSONFile(transactionsPath);
        const transactionId = transactions[0]._id.$oid;

        const res = await request(app).put(`/transaction/editTransaction/${transactionId}`).send(updatedData);
        expect(res.body.name).toBe('Updated Transaction');
        expect(res.body.amount).toBe(300);
        expect(res.body.expense).toBe(false);
    }, 10000);

    test('PUT /editTransaction/:id - should return status code 404 for non-existent transaction', async () => {
        const updatedData = { name: 'Updated Transaction', amount: 300, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).put(`/transaction/editTransaction/nonexistent-id`).send(updatedData);
        expect(res.statusCode).toBe(404);
    }, 10000);

    test('DELETE /deleteTransaction/:id - should return status code 200', async () => {
        const transactions = await readJSONFile(transactionsPath);
        const transactionId = transactions[0]._id.$oid;

        const res = await request(app).delete(`/transaction/deleteTransaction/${transactionId}`);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Transaction deleted');
    }, 10000);

    test('GET /allCategories - should return status code 200', async () => {
        const res = await request(app).get('/category/allCategories');
        expect(res.statusCode).toBe(200);
    }, 10000);

    test('GET /allCategories - should return an array of categories', async () => {
        const res = await request(app).get('/category/allCategories');
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).not.toHaveLength(0);
    }, 10000);

    test('GET / - should return categories with name property', async () => {
        const res = await request(app).get('/category/allCategories');
        expect(res.body[0]).toHaveProperty('name');
    }, 10000);

    test('POST /newCategory - should return status code 200 and text', async () => {
        const newCategory = { name: 'New Category' };
        const res = await request(app).post('/category/newCategory').send(newCategory);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('New category saved');
    }, 10000);

    test('POST /newCategory - should return status code 400 for missing required fields', async () => {
        const invalidCategory = {};
        const res = await request(app).post('/category/newCategory').send(invalidCategory);
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Category name is required');
    }, 10000);

    test('POST /newCategory - should return text for missing required fields', async () => {
        const invalidCategory = {};
        const res = await request(app).post('/category/newCategory').send(invalidCategory);
        expect(res.text).toBe('Category name is required'); 
    }, 10000);    

    test('POST /newCategory - should return status code 401 for existing category', async () => {
        const existingCategory = { name: 'New Category' };
        const res = await request(app).post('/category/newCategory').send(existingCategory);
        expect(res.statusCode).toBe(401);
    }, 10000);

    test('POST /newCategory - should return status code 401 for existing category', async () => {
        const existingCategory = { name: 'New Category' };
        const res = await request(app).post('/category/newCategory').send(existingCategory);
        expect(res.text).toBe('Category with this name already exists');
    }, 10000);

    test('DELETE /deleteTransaction/:id - should return status code 404 for non-existent transaction', async () => {
        const res = await request(app).delete(`/transaction/deleteTransaction/nonexistent-id`);
        expect(res.statusCode).toBe(404);
    }, 10000);

    test('DELETE /deleteCategory/:name - should return status code 200', async () => {
        const res = await request(app).delete('/category/deleteCategory/New Category');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Category deleted successfully');
    });

    test('DELETE /deleteCategory/:name - should return status code 404 for non-existent category', async () => {
        const res = await request(app).delete('/category/deleteCategory/Nonexistent Category');
        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('Category not found');
    });
});
