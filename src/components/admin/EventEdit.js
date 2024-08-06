import React, { useState, useEffect } from "react";

function EventEdit({ eventId }) {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetch(`/api/events/${eventId}`)
        .then((response) => response.json())
        .then((data) => setEvent(data))
        .catch((error) => console.error("Error fetching event details:", error));
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
        ...prevEvent,
        [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
        })
        .then((response) => response.json())
        .then((data) => console.log("Event updated:", data))
        .catch((error) => console.error("Error updating event:", error));
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div>
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
            <label>
            Name:
            <input
                type="text"
                name="name"
                value={event.name}
                onChange={handleChange}
            />
            </label>
            <label>
            Description:
            <input
                type="text"
                name="description"
                value={event.description}
                onChange={handleChange}
            />
            </label>
            <label>
            Date:
            <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
            />
            </label>
            <label>
            Venue:
            <input
                type="text"
                name="venue"
                value={event.venue}
                onChange={handleChange}
            />
            </label>
            <button type="submit">Save Changes</button>
        </form>
        </div>
    );
};

export default EventEdit;
