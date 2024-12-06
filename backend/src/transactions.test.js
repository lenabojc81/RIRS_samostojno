const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../index');
const mongoUri = process.env.MONGO_URI;

beforeAll(async () => {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.db.collection('categories').deleteOne({ name: 'New Category' });
    await mongoose.connection.close();
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
        const newTransaction = { _id: new mongoose.Types.ObjectId('000000000000000000000005'), name: 'New Transaction', amount: 200, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).post('/transaction/newTransaction').send(newTransaction);
        expect(res.statusCode).toBe(200);
    }, 10000);

    test('POST /newTransaction - should add a new transaction', async () => {
        const newTransaction = { _id: new mongoose.Types.ObjectId('000000000000000000000006'), name: 'New Transaction', amount: 200, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).post('/transaction/newTransaction').send(newTransaction);
        expect(res.text).toBe('new transaction saved');
    }, 10000);

    test('POST /newTransaction - should return status code 400 for missing required fields', async () => {
        const invalidTransaction = { amount: 200 };
        const res = await request(app).post('/transaction/newTransaction').send(invalidTransaction);
        expect(res.statusCode).toBe(400);
    }, 10000);

    test('PUT /editTransaction/:id - should return status code 200', async () => {
        const updatedData = { name: 'Updated Transaction', amount: 300, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).put(`/transaction/editTransaction/000000000000000000000005`).send(updatedData);
        expect(res.statusCode).toBe(200);
    }, 10000);

    test('PUT /editTransaction/:id - should return updated transaction', async () => {
        const updatedData = { name: 'Updated Transaction', amount: 300, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).put(`/transaction/editTransaction/000000000000000000000005`).send(updatedData);
        expect(res.body.name).toBe('Updated Transaction');
        expect(res.body.amount).toBe(300);
        expect(res.body.expense).toBe(false);
    }, 10000);

    test('PUT /editTransaction/:id - should return status code 404 for non-existent transaction', async () => {
        const updatedData = { name: 'Updated Transaction', amount: 300, expense: false, date: new Date(), category: 'saving' };
        const res = await request(app).put(`/transaction/editTransaction/000000000000000000000000`).send(updatedData);
        expect(res.statusCode).toBe(404);
    }, 10000);

    test('DELETE /deleteTransaction/:id - should return status code 200', async () => {
        const res = await request(app).delete(`/transaction/deleteTransaction/000000000000000000000006`);
        expect(res.statusCode).toBe(200);
    }, 10000);

    test('DELETE /deleteTransaction/:id - should return message "transaction deleted"', async () => {
        const res = await request(app).delete(`/transaction/deleteTransaction/000000000000000000000005`);
        expect(res.text).toBe('transaction deleted');
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
        expect(res.text).toBe('new category saved');

    }, 10000);

    test('POST /newCategory - should return status code 400 for missing required fields', async () => {
        const invalidCategory = {};
        const res = await request(app).post('/category/newCategory').send(invalidCategory);
        expect(res.statusCode).toBe(400);
    }, 10000);

    test('POST /newCategory - should return text for missing required fields', async () => {
        const invalidCategory = {};
        const res = await request(app).post('/category/newCategory').send(invalidCategory);
        expect(res.text).toBe('Category name is required');
    }, 10000);

    test('POST /newCategory - should return status code 400 for existing category', async () => {
        const existingCategory = { name: 'New Category' };
        const res = await request(app).post('/category/newCategory').send(existingCategory);
        expect(res.statusCode).toBe(401);
    }, 10000);

    test('POST /newCategory - should return text for existing category', async () => {
        const existingCategory = { name: 'New Category' };
        const res = await request(app).post('/category/newCategory').send(existingCategory);
        expect(res.text).toBe('Category with this name already exists');
    }, 10000);
});
