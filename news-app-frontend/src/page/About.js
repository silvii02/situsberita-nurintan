import React from 'react';
import Header from '../components/Header';  
import Footer from '../components/Footer';
import '../assets/css/style.css'; // Pastikan untuk menyesuaikan path CSS sesuai proyek Anda

const AboutUs = () => {
  return (
    <div>
      <Header />
    <div className="about-us-container">
      <img className="aboutImage" src="/image/logo4.png" alt="Logo" />
      <p>
        Selamat datang di <strong>situsintan.org</strong>, platform yang didedikasikan untuk menyajikan informasi bermanfaat dan inspiratif. Kami fokus pada konten berkualitas yang relevan dalam jangka panjang, mencakup berbagai topik seperti teknologi, Edukasi, kesehatan, nternasional, Otomotif, dan Politik. Setiap artikel dirancang untuk memberikan wawasan mendalam serta panduan praktis yang dapat diterapkan dalam kehidupan sehari-hari.
      </p>
      <p>
        kami berkomitmen untuk menyajikan informasi yang akurat dan terpercaya, tanpa mengikuti siklus berita harian. Kami mengundang Anda untuk menjelajahi konten kami dan terhubung melalui media sosial untuk mendapatkan pembaruan terbaru. Terima kasih telah mengunjungi <strong>situsintan.org</strong>, kami berharap informasi yang kami sajikan dapat menginspirasi dan memberikan manfaat bagi Anda.
      </p>
    </div>
    <Footer />
    </div>
  );
};


export default AboutUs;
