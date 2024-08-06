import React, { useState, useEffect } from "react";

function UserEdit({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user details:", error));
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // sends the updated user details to the backend API
        fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        })
        .then((response) => response.json())
        .then((data) => console.log("User updated:", data))
        .catch((error) => console.error("Error updating user:", error));
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
            />
            </label>
            <label>
            Email:
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
            />
            </label>
            <label>
            Role:
            <select
                name="role"
                value={user.role}
                onChange={handleChange}
            >
                <option value="customer">Customer</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
            </select>
            </label>
            <button type="submit">Save Changes</button>
        </form>
        </div>
    );
};

export default UserEdit;
