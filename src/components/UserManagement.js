import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import './UserManagement.css';

const UserManagement = () => {
  const { token } = useUser();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [isFormVisible, setFormVisible] = useState(() => {
    return JSON.parse(localStorage.getItem('isFormVisible')) || false;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      console.log('Fetching users...');
      try {
        const response = await fetch('http://127.0.0.1:5555/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log('Users fetched:', data);
        setUsers(data);
        localStorage.setItem('users', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Error fetching users');
        const cachedUsers = localStorage.getItem('users');
        if (cachedUsers) {
          console.log('Loading cached users:', JSON.parse(cachedUsers));
          setUsers(JSON.parse(cachedUsers));
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}: ${value}`);
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    console.log('Adding user:', formData);
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const newUser = await response.json();
      console.log('User added:', newUser);
      setUsers((prevUsers) => [...prevUsers, newUser.user]);
      clearForm();
      setMessage('User added successfully!');
      localStorage.removeItem('formData');
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage('Error adding user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, formData) => {
    console.log('Updating user:', formData);
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);
      // Handle the updated user data as needed
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteUser = async (userId) => {
    console.log(`Deleting user with ID: ${userId}`);
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((user) => user.id !== userId));
      setMessage('User deleted successfully!');
      localStorage.setItem(
        'users',
        JSON.stringify(users.filter((user) => user.id !== userId))
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    console.log('Editing user:', user);
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', 
      role: user.role,
    });
    setFormVisible(true);
    localStorage.setItem('isFormVisible', JSON.stringify(true));
  };

  const clearForm = () => {
    console.log('Clearing form');
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '',
    });
    setFormVisible(false);
    setEditingUser(null);
    localStorage.setItem('isFormVisible', JSON.stringify(false));
  };

  return (
    <div className="user-management">
      <h2>Manage Users</h2>

      <button
        className="toggle-form-button"
        onClick={() => setFormVisible((prev) => !prev)}>
        {isFormVisible ? 'Hide Form' : 'Add New User'}
      </button>

      {message && <p className="message">{message}</p>}
      {loading && <p>Loading...</p>}

      {isFormVisible && (
        <form
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          className="user-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit">
            {editingUser ? 'Update User' : 'Add User'}
          </button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
