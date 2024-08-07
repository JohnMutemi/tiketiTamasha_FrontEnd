// import React, { useState, useEffect } from 'react';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [error, setError] = useState('');
//   useEffect(() => {
//     // Fetch notifications when the component mounts
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(
//           'http://127.0.0.1:5555/notifications',
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           const data = await response.json();
//           throw new Error(data.message || 'Error fetching notifications');
//         }

//         const data = await response.json();
//         setNotifications(data.notifications);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchNotifications();
//   }, []);
//   const handleSendNotification = async () => {
//     try {
//       // Send the new notification
//       const response = await fetch('http://127.0.0.1:5555/notifications', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ message: newMessage }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Error sending notification');
//       }

//       // Clear the new message input
//       setNewMessage('');

//       // Fetch the updated list of notifications
//       const notificationsResponse = await fetch(
//         'http://127.0.0.1:5555/notifications',
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       if (!notificationsResponse.ok) {
//         const data = await notificationsResponse.json();
//         throw new Error(data.message || 'Error fetching notifications');
//       }

//       const notificationsData = await notificationsResponse.json();
//       setNotifications(notificationsData.notifications);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Notifications</h1>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <div>
//         <h2>Send a New Notification</h2>
//         <textarea
//           rows="4"
//           cols="50"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Enter notification message"
//         />
//         <br />
//         <button onClick={handleSendNotification}>Send Notification</button>
//       </div>

//       <div>
//         <h2>Existing Notifications</h2>
//         <ul>
//           {notifications.map((notification) => (
//             <li key={notification.id}>
//               <p>{notification.message}</p>
//               <small>{new Date(notification.timestamp).toLocaleString()}</small>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Notifications;
