import React from 'react';
// import './AttendeeList.css';

function AttendeeList({ attendees }) {
  if (attendees.length === 0) {
    return <p>No attendees found for this event.</p>;
  }

  return (
    <div className="event-attendees">
      <h3>Attendees</h3>
      <table className="attendees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Ticket Type</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => (
            <tr key={attendee.id}>
              <td>{attendee.name}</td>
              <td>{attendee.email}</td>
              <td>{attendee.ticket_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendeeList;
