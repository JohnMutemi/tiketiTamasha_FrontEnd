import React, { useState, useEffect } from 'react';

function AccountDetails() {
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5555/users') 
        .then((response) => response.json())
        .then((data) => setUserDetails(data))
        .catch((error) => console.error('Error fetching user details:', error));
    }, []);

    return (
        <div className="account-details">
        {userDetails ? (
            <>
            <p>
                <strong>Username:</strong> {userDetails.username}
            </p>
            <p>
                <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
                <strong>Role:</strong> {userDetails.role}
            </p>
            </>
        ) : (
            <p>Loading account details...</p>
        )}
        </div>
    );
}

export default AccountDetails;