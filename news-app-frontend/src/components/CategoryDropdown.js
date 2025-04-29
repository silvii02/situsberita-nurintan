import React, { useEffect, useState } from 'react';
import { 
  FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaHome, FaGlobe, FaMapMarkerAlt, 
  FaFutbol, FaCar, FaChartLine, FaFlask, FaBook, FaLightbulb, FaNewspaper, FaVideo, FaPeopleArrows, FaHandHoldingHeart, FaEnvelopeOpenText 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios'; 
import '../assets/css/style.css';

const CategoryDropdown = ({ onClose }) => {
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories'); 
        setDynamicCategories(response.data);
      } catch (error) {
        console.error('Error fetching dynamic categories:', error.response?.data || error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="menu">
      <div className="header">
        <img className="headerImage1" src="/image/logo3.jpg" alt="Logo" />
      </div>

      <div className="menu-lists">
        {/* Kolom kiri */}
        <ul className="menu-list">
          <li><Link to="/"><FaHome style={{ color: '#007bff', marginRight: '11px' }} />Beranda</Link></li>
          <li><Link to="/TerkiniArticle"><FaLightbulb style={{ color: '#4caf50', marginRight: '11px' }} />Terkini</Link></li>
          <li><Link to="/PopularArticleList"><FaChartLine style={{ color: '#ff5722', marginRight: '11px' }} />Terpopuler</Link></li>
          <li><Link to="/about"><FaPeopleArrows style={{ color: '#9c27b0', marginRight: '11px' }} />About Us</Link></li>
          <li><Link to="/infoiklan"><FaEnvelopeOpenText style={{ color: '#795548', marginRight: '11px' }} />Info Iklan</Link></li>
          {/* Kategori dinamis masuk di kolom kiri */}
          {dynamicCategories.filter((_, index) => index % 2 === 0).map((category) => (
            <li key={category.id}>
              <Link to={`/kategori/${category.slug}`}>
                <FaBook style={{ color: '#673ab7', marginRight: '11px' }} />
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Kolom kanan */}
        <ul className="menu-list">
          <li><Link to="/help"><FaHandHoldingHeart style={{ color: '#ff5722', marginRight: '11px' }} />Help</Link></li>
          <li><Link to="/contact"><FaLightbulb style={{ color: '#ff5722', marginRight: '11px' }} />Hubungi Kami</Link></li>
          <li><Link to="/pedomanmedia"><FaNewspaper style={{ color: '#607d8b', marginRight: '11px' }} />Pedoman media</Link></li>
          <li><Link to="/privacypolicy"><FaBook style={{ color: '#3f51b5', marginRight: '11px' }} />Privacy Policy</Link></li>
          <li><Link to="/termsofuse"><FaChartLine style={{ color: '#ff9800', marginRight: '11px' }} />Terms Of Use</Link></li>

          {/* Kategori dinamis masuk di kolom kanan */}
          {dynamicCategories.filter((_, index) => index % 2 !== 0).map((category) => (
            <li key={category.id}>
              <Link to={`/kategori/${category.slug}`}>
                <FaBook style={{ color: '#673ab7', marginRight: '11px' }} />
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="social-media-icons">
        {/* Ikon sosial media tetap */}
        <a href="https://webmail.situsintan.org/" target="_blank" rel="noopener noreferrer">
          <img src="/image/email.jpg" alt="Gmail" style={{ width: '24px', height: '24px' }} />
        </a>
        <a href="https://www.instagram.com/nrintnslvnn?igsh=MTQ3bjExdXc4dzNsMQ==" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} style={{ color: '#E4405F' }} />
        </a>
        <a href="https://youtube.com/@nurintan2296?si=r4jBFQUIVn61fflt" target="_blank" rel="noopener noreferrer">
          <FaYoutube size={24} style={{ color: '#FF0000' }} />
        </a>
        <a href="https://x.com/Inta13923350Nur?t=3cw_mEVCFIH9upnMwCY4UA&s=09" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={24} style={{ color: '#1DA1F2' }} />
        </a>
      </div>
    </div>
  );
};

export default CategoryDropdown;
