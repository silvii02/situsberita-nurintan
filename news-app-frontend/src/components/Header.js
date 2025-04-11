import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import configUrl from '../configUrl';
import axios from 'axios';
import CategoryDropdown from './CategoryDropdown';
import UserDropdown from './UserDropdown';
import AdsDisplay from './adsdisplay';
import '../assets/css/style.css';

const Header = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [menuDinamisVisible, setMenuDinamisVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowCategoryDropdown(false);
  };


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setMenuDinamisVisible(true); 
      } else {
        setMenuDinamisVisible(false); 
      }
    };

    window.addEventListener('scroll', handleScroll); 

    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, []);


  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    setIsLoggedIn(false);
    navigate('/'); // Pindah langsung ke halaman beranda
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const searchResponse = await axios.get(`${configUrl.beBaseUrl}/api/search`, {
        params: { query: searchQuery },
      });
      navigate('/search-results', {
        state: {
          results: searchResponse.data,
          keyword: searchQuery,
        },
      });
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div>
<AdsDisplay position="header" /> 
    <div className="headerContainer">
      <div className="headerTop">
        <a href="https://www.situsintan.org">
        <img className="headerImage" src="/image/logo3.jpg" alt="Logo" />
        </a>

      <div id='menu-dinamis' style={{ display: menuDinamisVisible ? 'block' : 'none' }}> 
      <ul className="" style={{ display: 'flex', gap:'10px'}}>
          <li><Link to="/" className="link-dinamis">Beranda</Link></li>
          <li><Link to="/TerkiniArticle" className="link-dinamis">Terkini</Link></li>
          <li><Link to="/PopularArticleList" className="link-dinamis">Terpopuler</Link></li>
          <li><Link to="/kategori/politik" className="link-dinamis">Politik</Link></li>
          <li><Link to="/kategori/edukasi" className="link-dinamis">Edukasi</Link></li>
          <li><Link to="/kategori/kesehatan" className="link-dinamis">Kesehatan</Link></li>
          <li><Link to="/kategori/internasional" className="link-dinamis">Internasional</Link></li>
          <li><Link to="/kategori/otomotif" className="link-dinamis">Otomotif</Link></li>
          {isLoggedIn && (
            <li><Link to="/indexdashboard" className="link-dinamis">Dashboard</Link></li>
          )}
        </ul>
      </div>

        <div className="icon-container">
          <div className="search-bar">
            <form style={{ position: "relative"}} onSubmit={handleSearch}>
              <input
                type="text4"
                placeholder="Cari Berita"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="searchIcon" onClick={handleSearch} />
            </form>
          </div>
          {isLoggedIn ? (
            <FaSignOutAlt className="userIcon" title="Klik untuk melihat opsi" onClick={toggleUserDropdown} />
          ) : (
            <FaUserCircle className="userIcon" title="Klik untuk log in" onClick={() => navigate('/login')} />
          )}
          {showCategoryDropdown ? (
            <FaTimes className="menuIcon" onClick={toggleCategoryDropdown} />
          ) : (
            <FaBars className="menuIcon" onClick={toggleCategoryDropdown} />
          )}
        </div>
      </div>

      <nav className="navbar">
        <ul className="navLinks">
          <li><Link to="/" className="link">Beranda</Link></li>
          <li><Link to="/TerkiniArticle" className="link">Terkini</Link></li>
          <li><Link to="/PopularArticleList" className="link">Terpopuler</Link></li>
          <li><Link to="/kategori/politik" className="link">Politik</Link></li>
          <li><Link to="/kategori/edukasi" className="link">Edukasi</Link></li>
          <li><Link to="/kategori/kesehatan" className="link">Kesehatan</Link></li>
          <li><Link to="/kategori/internasional" className="link">Internasional</Link></li>
          <li><Link to="/kategori/otomotif" className="link">Otomotif</Link></li>
          <li><Link to="/kategori/travel" className="link">Travel</Link></li>
          {isLoggedIn && (
            <li><Link to="/indexdashboard" className="link">Dashboard</Link></li>
          )}
        </ul>
      </nav>

      {isLoggedIn && showUserDropdown && <UserDropdown onLogout={handleLogout} />}
      {showCategoryDropdown && <CategoryDropdown />}
    </div>
    </div>
  );
};

export default Header;
