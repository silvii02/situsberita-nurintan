import React from 'react';
import { 
  FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaHome, FaGlobe, FaMapMarkerAlt, 
  FaFutbol, FaCar, FaChartLine, FaFlask, FaBook, FaLightbulb, FaNewspaper, FaVideo, FaPeopleArrows, FaHandHoldingHeart, FaEnvelope 
} from 'react-icons/fa'; // Import ikon tambahan jika perlu
import { Link } from 'react-router-dom';
import '../assets/css/style.css';

const CategoryDropdown = ({ onClose }) => {
  return (
    <div className="menu">
      <div className="header">
        <img className="headerImage1" src="/image/logo3.jpg" alt="Logo" />
      </div>
      <div className="menu-lists">
        <ul className="menu-list">
          <li><Link to="/"><FaHome style={{ color: '#007bff', marginRight: '11px' }} />Beranda</Link></li>
          <li><Link to="/TerkiniArticle"><FaLightbulb style={{ color: '#4caf50', marginRight: '11px' }} />Terkini</Link></li>
          <li><Link to="PopularArticleList"><FaChartLine style={{ color: '#ff5722', marginRight: '11px' }} />Terpopuler</Link></li>
          <li><Link to="/kategori/travel"><FaMapMarkerAlt style={{ color: '#ff9800', marginRight: '11px' }} />Travel</Link></li>
          <li><Link to="/kategori/politik"><FaNewspaper style={{ color: '#ff1744', marginRight: '11px' }} />Politik</Link></li>
          <li><Link to="/kategori/edukasi"><FaBook style={{ color: '#673ab7', marginRight: '11px' }} />Edukasi</Link></li>
          <li><Link to="/kategori/kesehatan"><FaFlask style={{ color: '#4caf50', marginRight: '11px' }} />Kesehatan</Link></li>
          <li><Link to="/kategori/internasional"><FaGlobe style={{ color: '#03a9f4', marginRight: '11px' }} />Internasional</Link></li>
          <li><Link to="/kategori/bola"><FaFutbol style={{ color: '#ffc107', marginRight: '11px' }} />Bola</Link></li>
        </ul>
        <ul className="menu-list">
          <li><Link to="/kategori/otomotif"><FaCar style={{ color: '#795548', marginRight: '11px' }} />Otomotif</Link></li>
          <li><Link to="/kategori/sport"><FaChartLine style={{ color: '#009688', marginRight: '11px' }} />Sport</Link></li>
          <li><Link to="/kategori/video"><FaVideo style={{ color: '#d32f2f', marginRight: '11px' }} />Video</Link></li>
          <li><Link to="/about"><FaPeopleArrows style={{ color: '#9c27b0', marginRight: '11px' }} />About Us</Link></li>
          <li><Link to="/help"><FaHandHoldingHeart style={{ color: '#ff5722', marginRight: '11px' }} />Help</Link></li>
          <li><Link to="/contact"><FaLightbulb style={{ color: '#ff5722', marginRight: '11px' }} />Hubungi Kami</Link></li>
          <li><Link to="/pedomanmedia"><FaNewspaper style={{ color: '#607d8b', marginRight: '11px' }} />Pedoman media</Link></li>
          <li><Link to="/privacypolicy"><FaBook style={{ color: '#3f51b5', marginRight: '11px' }} />Privacy Policy</Link></li>
          <li><Link to="/termsofuse"><FaChartLine style={{ color: '#ff9800', marginRight: '11px' }} />Terms Of Use</Link></li>
        </ul>
      </div>
      <div className="social-media-icons">
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
