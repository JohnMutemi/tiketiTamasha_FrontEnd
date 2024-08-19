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
    role: 'attendee',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://tiketi-tamasha-backend-1.onrender.com/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log('Fetched users:', data); 

        // Check if data.users exists and is an array
        if (Array.isArray(data.users)) {
          setUsers(data.users);
          console.log('MY USERS:', data.users);
          localStorage.setItem('users', JSON.stringify(data.users));
        } else {
          console.error('Unexpected data structure:', data);
          setMessage('Unexpected data structure');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Error fetching users');
        const cachedUsers = localStorage.getItem('users');
        if (cachedUsers) {
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
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://tiketi-tamasha-backend-1.onrender.com/users/${editingUser}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      clearForm();
      setMessage('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://tiketi-tamasha-backend-1.onrender.com/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'attendee',
    });
    setEditingUser(null);
    localStorage.removeItem('formData');
  };

  return (
    <div className="user-management">
      <h2>Manage Users</h2>

      {message && <p className="message">{message}</p>}
      {loading && <p>Loading...</p>}

      {editingUser && (
        <form onSubmit={handleUpdateUser} className="user-form">
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
            required={!editingUser}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}>
            <option value="attendee">Event_attendee</option>
            <option value="organizer">Event_organizer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Update User</button>
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        </form>
      )}

      {Array.isArray(users) && users.length > 0 ? (
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
            {users.map((user, index) => (
              <tr key={index}>
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
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default UserManagement;
