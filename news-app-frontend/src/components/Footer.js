import React from 'react';
import AdsDisplay from './adsdisplay';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      <AdsDisplay position="footer" /> 
    <footer style={styles.footer}>
      <div style={styles.container}>
       
      </div>
      <div style={styles.copyright}>
        <p>&copy; 2024 situsintan.org. All Rights Reserved</p>
      </div>
    </footer>
    </div>
  );
}

const styles = {
  footer: {
    backgroundColor: '#f8f9fa',
    padding: '20px 0',
    textAlign: 'center',
    borderTop: '1px solid #e7e7e7',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  
  copyright: {
    backgroundColor: '#1F316F',
    color: '#ffffff',
    padding: '10px 0',
  },
};

export default Footer;