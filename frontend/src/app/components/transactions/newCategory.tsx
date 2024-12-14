"use client";

import React, { useState } from "react";
import { baseURL } from "../../../../global";
import { redirect } from "next/navigation";
import Category from "./category";
import { ICategory, initialCategory } from "@/interfaces/ICategory";

export default function NewCategory() {
    const [category, setCategory] = useState<ICategory>(initialCategory);

    const saveCategory = async () => {
        let saved = false;
        if (!category.name.trim()) {
            alert('Validation Error: Please enter the name of the transaction.');
            return;
        }
        
        try {
            const response = await fetch(`${baseURL}/category/newCategory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category),
            });

            if (response.ok) {
                setCategory(initialCategory);
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
            <h4 className="mb-4">New Category</h4>
            
            <div className="mb-3">
                <label className="form-label" htmlFor="transaction-name">Name of Category</label>
                <input
                    id="transaction-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter the name of category"
                    value={category.name}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                />
            </div>

            <button onClick={saveCategory} className="btn btn-success w-100">
                Save Category
            </button>
        </div>
    );
}
