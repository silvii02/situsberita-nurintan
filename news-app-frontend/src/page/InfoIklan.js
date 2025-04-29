import React from 'react';
import Header from '../components/Header';  
import Footer from '../components/Footer';

const InfoIklan = () => {
  return (
    <div>
    <Header />
    <div className="info-iklan-container">
      <div className="info-iklan-card">
        <h3 className="info-iklan-card-title">Info Iklan</h3>
        <p className="info-iklan-card-text">
          Untuk informasi pemasangan iklan silakan menghubungi:
        </p>


        <div className="info-iklan-harga">
          <p><strong>Silahkan Hubungi :</strong></p>
          <p><span>Kartika</span> <a href="tel:0895375675558">(0895-3756-75558)</a></p>
          <p><span>Anjani</span> <a href="tel:089602797724">(0896-0279-7724)</a></p>
          <p><span>Intan</span> <a href="tel:083819868916">(0838-1986-8916)</a></p>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default InfoIklan;
