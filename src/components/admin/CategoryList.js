import React, { useState, useEffect } from "react";

function CategoryList() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch("/api/categories")
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    return (
        <div>
        <h2>Category Management</h2>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {categories.map((category) => (
                <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default CategoryList;
