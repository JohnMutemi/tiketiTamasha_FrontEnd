import React, { useState, useEffect } from "react";

function CategoryEdit ({ categoryId }) {
    const [category, setCategory] = useState({ name: "" });

    useEffect(() => {
        if (categoryId) {
        fetch(`/api/categories/${categoryId}`)
            .then((response) => response.json())
            .then((data) => setCategory(data))
            .catch((error) => console.error("Error fetching category details:", error));
        }
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
        ...prevCategory,
        [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = categoryId ? "PUT" : "POST";
        const url = categoryId ? `/api/categories/${categoryId}` : "/api/categories";

        // sends the category data to the backend API
        fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
        })
        .then((response) => response.json())
        .then((data) => console.log("Category saved:", data))
        .catch((error) => console.error("Error saving category:", error));
    };

    return (
        <div>
        <h2>{categoryId ? "Edit" : "Create"} Category</h2>
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
            />
            </label>
            <button type="submit">Save</button>
        </form>
        </div>
    );
};

export default CategoryEdit;
