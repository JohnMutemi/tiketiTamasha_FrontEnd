import React, { useState, useEffect } from "react";

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/api/users")
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
    }, []);

    return (
        <div>
        <h2>User Management</h2>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                    <button>Edit</button>
                    <button>Deactivate</button>
                    <button>Assign Role</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default UserList;
