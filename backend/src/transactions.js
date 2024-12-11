import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Define the path to the transactions JSON file
const filePath = path.join(process.cwd(), 'data', 'transactions.json');

// Helper function to read transactions from the file
const readTransactions = async () => {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
};

// Helper function to write transactions to the file
const writeTransactions = async (transactions) => {
    await fs.writeFile(filePath, JSON.stringify(transactions, null, 2));
};

// Get all transactions
router.get('/getTransactions', async (req, res) => {
    try {
        const transactions = await readTransactions();
        res.status(200).json(transactions);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Add a new transaction
router.post('/newTransaction', async (req, res) => {
    try {
        const transactions = await readTransactions();

        const newTransaction = {
            _id: { $oid: new Date().getTime().toString() },
            ...req.body,
        };

        const transactionSchema = {
            name: 'string',
            amount: 'number',
            expense: 'boolean',
            date: 'string',
            category: 'string'
        };

        for (const key in transactionSchema) {
            if (!req.body.hasOwnProperty(key) || typeof req.body[key] !== transactionSchema[key]) {
            return res.status(400).send({ error: `Invalid or missing field: ${key}` });
            }
        }

        transactions.push(newTransaction);
        await writeTransactions(transactions);

        res.status(200).send('New transaction saved');
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Delete a transaction by ID
router.delete('/deleteTransaction/:id', async (req, res) => {
    try {
        const transactions = await readTransactions();

        const updatedTransactions = transactions.filter(
            (transaction) => transaction._id.$oid !== req.params.id
        );

        if (updatedTransactions.length === transactions.length) {
            return res.status(404).send('Transaction not found');
        }

        await writeTransactions(updatedTransactions);

        res.status(200).send('Transaction deleted');
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Edit a transaction by ID
router.put('/editTransaction/:id', async (req, res) => {
    try {
        const transactions = await readTransactions();

        const transactionIndex = transactions.findIndex(
            (transaction) => transaction._id.$oid === req.params.id
        );

        if (transactionIndex === -1) {
            return res.status(404).send({ error: 'Transaction not found' });
        }

        const updatedTransaction = {
            ...transactions[transactionIndex],
            ...req.body,
        };

        transactions[transactionIndex] = updatedTransaction;

        await writeTransactions(transactions);

        res.status(200).json(updatedTransaction);
    } catch (err) {
        res.status(400).send({ error: 'Failed to update transaction' });
    }
});

export default router;
