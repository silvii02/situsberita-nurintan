import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faTags, faEdit, faRightToBracket, faSignOutAlt, faBell, faTimes, faBullhorn, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import configUrl from '../configUrl';
import '../assets/css/style.css';

const SidebarDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadComments, setUnreadComments] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [unreadCommentList, setUnreadCommentList] = useState([]);

    useEffect(() => {
        fetchUnreadComments();
    }, []);

    const fetchUnreadComments = async () => {
        try {
            const response = await axios.get(`${configUrl.beBaseUrl}/api/commentsreport/unread`);
            setUnreadComments(response.data.length);
            setUnreadCommentList(response.data);
        } catch (error) {
            console.error('Error fetching unread comments:', error);
        }
    };

    const handleNotificationClick = async () => {
        if (!showPopup) {
            try {
                await axios.post(`${configUrl.beBaseUrl}/api/commentsreport/mark-all-read`);
                setUnreadComments(0);
                // Jangan panggil fetchUnreadComments() di sini
            } catch (error) {
                console.error('Error marking comments as read:', error);
            }
        }
    
        setShowPopup(!showPopup); // Pindahkan ini ke akhir agar tidak conflict saat async jalan
    };
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        Swal.fire({
            title: "Berhasil Logout!",
            icon: "success",
            confirmButtonText: "OK"
        }).then(() => {
            navigate('/');
        });
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className='sidebar-dashboard'>
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
                        <Link to='/dashboard' className={location.pathname === '/dashboard' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faEdit} /> Manage Article
                        </Link>
                    </li>
                    <li className='sidebar-left'>
                        <Link to='/kategori' className={location.pathname === '/kategori' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faTags} /> Category
                        </Link>
                    </li>
                    <li className='sidebar-left'>
                        <Link to='/AdminAds' className={location.pathname === '/AdminAds' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faBullhorn} /> Pasang Iklan
                        </Link>
                    </li>
                    <li className='sidebar-left'>
                        <Link to='/DaftarIklan' className={location.pathname === '/DaftarIklan' ? 'active' : ''}>
                            <FontAwesomeIcon icon={faClipboardList} /> Daftar Iklan
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="menu-right header-dashboard">
                <div className="header-profile">
                    <h1>Hallo, Admin!</h1>
                    <div className="notification-container" onClick={handleNotificationClick}>
                        <FontAwesomeIcon icon={faBell} className="notification-icon" />
                        {unreadComments > 0 && (
                            <span className="notification-badge">{unreadComments}</span>
                        )}
                    </div>

                    {showPopup && (
                        <div className="notification-popup-comment">
                            <div className="popup-header">
                                <h3>Komentar Belum Dibaca</h3>
                                <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={() => setShowPopup(false)} />
                            </div>
                            <ul className="popup-list-comment">
                                {unreadCommentList.length > 0 ? unreadCommentList.map((comment) => (
                                    <li key={comment.id} className="popup-item-comment">
                                        <strong>{comment.name}:</strong> {comment.body}
                                    </li>
                                )) : (
                                    <li className="popup-item-comment">Tidak ada komentar baru.</li>
                                )}
                            </ul>
                            <button className="see-all-btn-comment" onClick={() => navigate('/commentsreport')}>Lihat Semua Komentar</button>
                        </div>
                    )}

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
