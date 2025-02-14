// UserDropdown.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaKey } from 'react-icons/fa';

const UserDropdown = ({ onLogout }) => {
  return (
    <div className="headerContainer">
      <div className="userDropdown">
        <Link to="/Passwordreset" className="dropdownLink">
        <FaKey /> Reset Password
        </Link>
        <div className="dropdownLink1" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>
    </div>
  );
};

export default UserDropdown; // Ensure this is the default export
