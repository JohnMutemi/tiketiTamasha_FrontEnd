import React, { useState, useEffect } from "react";

function RoleAssignment({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user details:", error));
    }, [userId]);

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setUser((prevUser) => ({
        ...prevUser,
        role: value,
        }));
    };

    const handleRoleAssignment = () => {
        fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: user.role }),
        })
        .then((response) => response.json())
        .then((data) => console.log("Role assigned:", data))
        .catch((error) => console.error("Error assigning role:", error));
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
        <h2>Role Assignment</h2>
        <p>
            Assign a role to <strong>{user.name}</strong>:
        </p>
        <select
            name="role"
            value={user.role}
            onChange={handleRoleChange}
        >
            <option value="customer">Customer</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
        </select>
        <button onClick={handleRoleAssignment}>Assign Role</button>
        </div>
    );
};

export default RoleAssignment;
