import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPen, faList, faTags, faEdit, faRightToBracket, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../assets/css/style.css';

const SidebarDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false); 
    const [unreadComments, setUnreadComments] = useState(0);

    useEffect(() => {
        fetchUnreadComments();
    }, []);

    const fetchUnreadComments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/commentsreport/unread-count');
            setUnreadComments(response.data.unread_comments);
        } catch (error) {
            console.error('Error fetching unread comments:', error);
        }
    };

    const handleCommentsClick = async () => {
        navigate('/commentsreport');
        try {
            await axios.post('http://localhost:8000/api/commentsreport/mark-all-read');
            setUnreadComments(0);
        } catch (error) {
            console.error('Error marking comments as read:', error);
        }
        fetchUnreadComments();
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('userid');
        navigate('/'); 
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown); 
    };

    return (
        <div className='sidebar-dashboard'>
            {/* Sidebar Section */}
            <div className='menu-left'>
                <div>
                    <img className='dashboardlogo' src='../image/logo.png' alt='logo' />
                    <img className='dashboardlogo1' src='../image/logo3.jpg' alt='logo' />
                </div>
                <ul>
                    <li className='sidebar-left'>
                        <Link to='/indexdashboard' className={location.pathname === '/indexdashboard' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faHome} /> Dashboard
                        </Link>
                    </li>
                    <li className='sidebar-left'>
                        <Link to='/create-article' className={location.pathname === '/create-article' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faPen} /> Create Article
                        </Link>
                    </li>
                    <li className='sidebar-left'>
                        <Link to='/dashboard' className={location.pathname === '/dashboard' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faEdit} /> Manage Article
                        </Link>
                    </li>
                    <li className='sidebar-left'>
                        <Link to='/kategori' className={location.pathname === '/kategori' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faTags} /> Category
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="menu-right header-dashboard">
                <div className="header-profile">
                    <h1>Hallo, Admin!</h1>
                    <div className="notification-container" onClick={handleCommentsClick}>
                        <FontAwesomeIcon icon={faBell} className="notification-icon" />
                        {unreadComments > 0 && (
                            <span className="notification-badge">{unreadComments}</span>
                        )}
                    </div>


                    <FontAwesomeIcon 
                        icon={faRightToBracket} 
                        className="logout1-icon" 
                        onClick={toggleDropdown} 
                    />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <ul>
                                <li onClick={() => navigate('/')} className="dropdown-item">
                                    <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px' }} />
                                    <span>Beranda</span>
                                </li>
                                <li onClick={handleLogout} className="dropdown-item">
                                    <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                                    <span>Logout</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarDashboard;
