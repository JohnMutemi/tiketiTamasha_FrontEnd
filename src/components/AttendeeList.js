import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

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

// Add PropTypes validation
AttendeeList.propTypes = {
  attendees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      ticket_type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AttendeeList;
