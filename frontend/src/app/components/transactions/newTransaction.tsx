"use client";

import React, { useState } from "react";
import { ITransaction, initialTransaction } from "../../../interfaces/ITransactions";
import { baseURL } from "../../../../global";
import { redirect } from "next/navigation";
import Category from "./category";

export default function NewTransaction() {
    const [transaction, setTransaction] = useState<ITransaction>(initialTransaction);

    const handleTransactionType = (isExpense: boolean) => {
        setTransaction({ ...transaction, expense: isExpense, date: new Date() });
    };

    const handleCategorySelect = (selectedCategory: string) => {
        setTransaction({ ...transaction, category: selectedCategory });
    };

    const saveTransaction = async () => {
        let saved = false;
        if (!transaction.name.trim()) {
            alert('Validation Error: Please enter the name of the transaction.');
            return;
        }
        if (!transaction.amount || transaction.amount <= 0) {
            alert('Validation Error: Please enter a valid amount greater than 0.');
            return;
        }
        if (!transaction.category) {
            alert('Validation Error: Please select a category.');
            return;
        }
        try {
            const response = await fetch(`${baseURL}/transaction/newTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });

            if (response.ok) {
                setTransaction(initialTransaction);
                saved = true;
            } else {
                alert('Error: Failed to save transaction.');
            }
        } catch (error) {
            alert('Error: An error occurred while saving the transaction.');
        }

        if (saved) {
            redirect('/');
        }
    };

    return (
        <div className="container p-4 mt-5 border rounded" style={{ maxWidth: "500px" }}>
            <h4 className="mb-4">New Transaction</h4>
            
            <div className="mb-3">
                <label className="form-label" htmlFor="transaction-name">Name of Transaction</label>
                <input
                    id="transaction-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter the name of transaction"
                    value={transaction.name}
                    onChange={(e) => setTransaction({ ...transaction, name: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label" htmlFor="transaction-amount">Amount</label>
                <input
                    id="transaction-amount"
                    type="number"
                    className="form-control"
                    placeholder="Enter the amount"
                    value={transaction.amount}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                            setTransaction({ ...transaction, amount: Number(value) });
                        }
                    }}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Type of Transaction</label>
                <div className="d-flex">
                    <button
                        type="button"
                        className={`btn me-2 ${!transaction.expense ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleTransactionType(false)}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`btn ${transaction.expense ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleTransactionType(true)}
                    >
                        Expense
                    </button>
                </div>
            </div>

            <Category onCategorySelect={handleCategorySelect}/>

            <button onClick={saveTransaction} className="btn btn-success w-100">
                Save Transaction
            </button>
        </div>
    );
}
