import express from 'express';
import transactionRouter from './src/transactions.js';
import cors from 'cors';
import categoryRouter from './src/category.js';

const app = express();
const port = process.env.PORT || 8080;;

app.use(express.json());
app.use(cors());
app.use('/transaction', transactionRouter);
app.use('/category', categoryRouter);

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

export { app, server };