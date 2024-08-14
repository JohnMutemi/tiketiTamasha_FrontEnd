import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CategoryManagement = () => {
  const { token } = useUser();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [isFormVisible, setFormVisible] = useState(() => {
    return JSON.parse(localStorage.getItem('isFormVisible')) || false;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5555/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
        localStorage.setItem('categories', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setMessage('Error fetching categories');
        const cachedCategories = localStorage.getItem('categories');
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);

      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory
        ? `http://127.0.0.1:5555/categories/${editingCategory}`
        : 'http://127.0.0.1:5555/categories';

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCategory ? 'update' : 'add'} category`);
      }

      const data = await response.json();
      setCategories((prevCategories) => {
        if (editingCategory) {
          return prevCategories.map((category) =>
            category.id === data.id ? data : category
          );
        } else {
          return [...prevCategories, data];
        }
      });
      clearForm();
      setMessage(`${editingCategory ? 'Updated' : 'Added'} category successfully!`);
      localStorage.removeItem('formData');
    } catch (error) {
      console.error('Error saving category:', error);
      setMessage(`Error saving category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/categories/${categoryId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
      setMessage('Category deleted successfully!');
      localStorage.setItem(
        'categories',
        JSON.stringify(
          categories.filter((category) => category.id !== categoryId)
        )
      );
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('Error deleting category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
    });
    setFormVisible(true);
    localStorage.setItem('isFormVisible', JSON.stringify(true));
  };

  const clearForm = () => {
    setFormData({
      name: '',
    });
    setFormVisible(false);
    setEditingCategory(null);
    localStorage.setItem('isFormVisible', JSON.stringify(false));
  };

  return (
    <div className="category-management">
      <h2>Manage Categories</h2>
      <button
        className="toggle-form-button"
        onClick={() => setFormVisible((prev) => !prev)}>
        {isFormVisible ? 'Hide Form' : 'Add New Category'}
      </button>
      {message && <p className="message">{message}</p>}
      {loading && <p>Loading...</p>}
      {isFormVisible && (
        <form
          onSubmit={handleSaveCategory}
          className="category-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Category Name"
            required
          />
          <button type="submit">
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>
                    <button onClick={() => handleEditClick(category)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(category.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No categories available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
