import { ICategory, initialCategory } from '@/interfaces/ICategory';
import React, { useEffect, useState } from 'react';
import { baseURL } from '../../../../global';

export default function Category({onCategorySelect}: {onCategorySelect: (category: string) => void}) {
    const [category, setCategory] = useState<ICategory>(initialCategory);
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${baseURL}/category/allCategories`);
            if (response.ok) {
                const data = await response.json();
                // console.log(data);
                setCategories(data);
            } else {
                alert('Error: Failed to fetch categories.');
            }
        } catch (error) {
            alert('Error: An error occurred while fetching categories.');
            console.error(error);
        }
    };

    const handleCategoryClick = (selectedCategory: string) => {
        setCategory({ name: selectedCategory });
        onCategorySelect(selectedCategory);
    };

    return (
        <div>
            <h5 className="mb-3">Select Category</h5>
            <div className="d-flex flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        type="button"
                        className={`btn me-2 mb-2 ${category.name === cat.name ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleCategoryClick(cat.name)}
                    >
                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}