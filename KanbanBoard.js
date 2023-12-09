// src/KanbanBoard.js
import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const groupTickets = () => {
    switch (groupingOption) {
      case 'user':
        return users.reduce((grouped, currentUser) => {
          const userTickets = tickets.filter((ticket) => ticket.userId === currentUser.id);
          grouped.push({ user: currentUser, tickets: userTickets });
          return grouped;
        }, []);
      case 'priority':
        return tickets.reduce((grouped, ticket) => {
          if (!grouped[ticket.priority]) {
            grouped[ticket.priority] = [];
          }
          grouped[ticket.priority].push(ticket);
          return grouped;
        }, []);
      default:
        return tickets.reduce((grouped, ticket) => {
          if (!grouped[ticket.status]) {
            grouped[ticket.status] = [];
          }
          grouped[ticket.status].push(ticket);
          return grouped;
        }, []);
    }
  };

  const sortedTickets = () => {
    const groupedTickets = groupTickets();
    return Object.keys(groupedTickets).reduce((sorted, key) => {
      sorted[key] = Object.values(groupedTickets[key]).flat().sort((a, b) => {
        switch (sortOption) {
          case 'priority':
            return b.priority - a.priority;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
      return sorted;
    }, {});
  };
  

  const handleGroupingChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleDisplayOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div>
      <div>
        <button onClick={handleDisplayOptions}>Display</button>
        {showOptions && (
          <div>
            <label htmlFor="groupingOption">Grouping</label>
            <select id="groupingOption" onChange={handleGroupingChange} value={groupingOption}>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>

            <label htmlFor="sortOption">Sorting</label>
            <select id="sortOption" onChange={handleSortChange} value={sortOption}>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        )}
      </div>

      <div className="kanban-board">
        {Object.keys(sortedTickets()).map((group) => (
          <div key={group} className="kanban-column">
            <h2>{group}</h2>
            {sortedTickets()[group].map((ticket) => {
              const user = users.find((u) => u.id === ticket.userId);
              return <TicketCard key={ticket.id} ticket={ticket} user={user} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
