import React, { useState, useEffect } from "react";

function EventApproval({ eventId }) {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetch(`/api/events/${eventId}`)
        .then((response) => response.json())
        .then((data) => setEvent(data))
        .catch((error) => console.error("Error fetching event details:", error));
    }, [eventId]);

    const handleApproval = (approved) => {
        fetch(`/api/events/${eventId}/approval`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
        })
        .then((response) => response.json())
        .then((data) => console.log("Event approval status updated:", data))
        .catch((error) =>
            console.error("Error updating event approval status:", error)
        );
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div>
        <h2>Event Approval</h2>
        <p>
            <strong>{event.name}</strong>
        </p>
        <p>{event.description}</p>
        <button onClick={() => handleApproval(true)}>Approve</button>
        <button onClick={() => handleApproval(false)}>Reject</button>
        </div>
    );
};

export default EventApproval;
