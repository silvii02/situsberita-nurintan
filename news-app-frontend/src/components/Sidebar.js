import React, { useState } from 'react';
import '../assets/css/style.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'} Sidebar
      </button>
      <nav>
        <ul>
          <li><a href="/create-article">Home</a></li>
          <li><a href="/dashboard">Services</a></li>
          <li><a href="/edit-article/:id">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
