import React, { useState } from 'react';
import './accountsett.css';

function AccountSettings() {
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showEmailChange, setShowEmailChange] = useState(false);
    const [showUsernameChange, setShowUsernameChange] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New password and confirmation do not match.");
            return;
        }

        fetch('http://localhost:5555/users/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Password changed successfully."); // resets form fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(data.message);
            }
        })
        .catch((error) => console.error('Error changing password:', error));
    };

    const handleEmailChange = (e) => {
        e.preventDefault();

        fetch('http://localhost:5555/users/change-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: newEmail,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Email changed successfully.");
                setNewEmail('');
            } else {
                alert(data.message);
            }
        })
        .catch((error) => console.error('Error changing email:', error));
    };

    const handleUsernameChange = (e) => {
        e.preventDefault();

        fetch('http://localhost:5555/users/change-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Username changed successfully.");
                setNewUsername('');
            } else {
                alert(data.message);
            }
        })
        .catch((error) => console.error('Error changing username:', error));
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="setting-item">
                <button onClick={() => setShowPasswordChange(!showPasswordChange)}>
                    Change Password
                </button>
                {showPasswordChange && (
                    <form onSubmit={handlePasswordChange}>
                        <label>
                            Current Password:
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            New Password:
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Confirm New Password:
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Update Password</button>
                    </form>
                )}
            </div>

            <div className="setting-item">
                <button onClick={() => setShowEmailChange(!showEmailChange)}>
                    Change Email Address
                </button>
                {showEmailChange && (
                    <form onSubmit={handleEmailChange}>
                        <label>
                            New Email:
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Update Email</button>
                    </form>
                )}
            </div>

            <div className="setting-item">
                <button onClick={() => setShowUsernameChange(!showUsernameChange)}>
                    Change Username
                </button>
                {showUsernameChange && (
                    <form onSubmit={handleUsernameChange}>
                        <label>
                            New Username:
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Update Username</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AccountSettings;
