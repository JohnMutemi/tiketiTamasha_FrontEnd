import React, { useState, useEffect } from 'react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState({ name: '' });

  useEffect(() => {
    fetch('http://127.0.0.1:5555/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      fetch(`http://127.0.0.1:5555/categories/${selectedCategory}`)
        .then((response) => response.json())
        .then((data) => setEditingCategory(data))
        .catch((error) =>
          console.error('Error fetching category details:', error)
        );
    } else {
      setEditingCategory({ name: '' });
    }
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', editingCategory.name);

    const method = selectedCategory ? 'PUT' : 'POST';
    const url = selectedCategory
      ? `http://127.0.0.1:5555/categories/${selectedCategory}`
      : 'http://127.0.0.1:5555/categories';

    fetch(url, {
      method: method,
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save category');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Category saved:', data);
        // Refresh category list and reset form
        setCategories((prevCategories) => {
          if (selectedCategory) {
            return prevCategories.map((category) =>
              category.id === data.id ? data : category
            );
          } else {
            return [...prevCategories, data];
          }
        });
        setEditingCategory({ name: '' });
        setSelectedCategory(null);
      })
      .catch((error) => {
        console.error('Error saving category:', error);
        alert(`Error saving category: ${error.message}`);
      });
  };

  const handleEditClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleDeleteClick = (categoryId) => {
    fetch(`http://127.0.0.1:5555/categories/${categoryId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete category');
        }
        console.log('Category deleted');
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
        // If currently editing this category, reset form
        if (selectedCategory === categoryId) {
          setSelectedCategory(null);
          setEditingCategory({ name: '' });
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        alert(`Error deleting category: ${error.message}`);
      });
  };

  return (
    <div>
      <h2>Category Management</h2>
      <div>
        <h3>{selectedCategory ? 'Edit' : 'Create'} Category</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Category:
            <input
              type="text"
              name="name"
              value={editingCategory.name}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">
            {selectedCategory ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
      <div>
        <h3>Category List</h3>
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
                  <button onClick={() => handleEditClick(category.id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteClick(category.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
