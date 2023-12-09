// src/TicketCard.js
// src/TicketCard.js
import React from 'react';
import './TicketCard.css';

const TicketCard = ({ ticket, user }) => {
  const getPriorityLabel = () => {
    switch (ticket.priority) {
      case 4:
        return 'Urgent';
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
        return 'Low';
      default:
        return 'No priority';
    }
  };

  return (
    <div className="ticket-card">
      <div className="user-picture">
        {user && <img src={user.picture} alt={user.name} />}
      </div>
      <div className="ticket-details">
        <p className='title'>{ticket.title}</p>
        <p className='ticket-id'>{ticket.id}</p>
        <p>{getPriorityLabel()}</p>
        <p>{ticket.tag}</p>
      </div>
    </div>
  );
};

export default TicketCard;
