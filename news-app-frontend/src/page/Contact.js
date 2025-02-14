import React, { useState } from 'react';
import DOMPurify from 'dompurify';  // Import DOMPurify
import Header from '../components/Header';  
import Footer from '../components/Footer'; 
import Swal from 'sweetalert2';

function Contact() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    alamat: '',
    kota: '',
    berkaitanDengan: 'Berita',
    tautan: '',
    pesan: '',
  });

  const [messageSent, setMessageSent] = useState(false); 

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Sanitasi input sebelum digunakan
    const sanitizedFormData = {
      ...formData,
      nama: DOMPurify.sanitize(formData.nama),
      email: DOMPurify.sanitize(formData.email),
      alamat: DOMPurify.sanitize(formData.alamat),
      kota: DOMPurify.sanitize(formData.kota),
      tautan: DOMPurify.sanitize(formData.tautan),
      pesan: DOMPurify.sanitize(formData.pesan),
    };

    if (!sanitizedFormData.nama || !sanitizedFormData.email || !sanitizedFormData.pesan) {
      alert('Nama, email, dan pesan harus diisi.');
      return;
    }
  
    const subject = 'Pesan dari Kontak Form';
    const body = `
      Nama: ${sanitizedFormData.nama}
      Email: ${sanitizedFormData.email}
      Alamat: ${sanitizedFormData.alamat}
      Kota: ${sanitizedFormData.kota}
      Berkaitan dengan: ${sanitizedFormData.berkaitanDengan}
      Tautan: ${sanitizedFormData.tautan}
      Pesan: ${sanitizedFormData.pesan}
    `;
  
    const mailtoLink = `mailto:intan@situsintan.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    window.location.href = mailtoLink;

    // Kosongkan form
    setFormData({
      nama: '',
      email: '',
      alamat: '',
      kota: '',
      berkaitanDengan: 'Berita',
      tautan: '',
      pesan: '',
    });
  
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Pesan berhasil dikirim!',
        text: 'Terima kasih telah menghubungi kami.',
        showConfirmButton: false,
        timer: 5000,
      });
    }, 5000);
  };
  
  return (
    <div>
      <Header />

      <form className='contact' onSubmit={handleSubmit}>
        <h2>Hubungi Kami</h2>
        <p>Ajukan pertanyaan, kritik dan saran tentang situsintan.org</p>

        {messageSent && <p style={{ color: 'green' }}>Pesan berhasil dikirim!</p>}

        <div>
          <input
            type="text"
            id="nama"
            name="nama"
            placeholder="Nama"
            value={formData.nama}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            id="alamat"
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            id="kota"
            name="kota"
            placeholder="Kota"
            value={formData.kota}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Berkaitan dengan?</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="radio"
              id="berita"
              name="berkaitanDengan"
              value="Berita"
              checked={formData.berkaitanDengan === 'Berita'}
              onChange={handleChange}
            />
            <label htmlFor="berita">Berita</label>

            <input
              type="radio"
              id="iklan"
              name="berkaitanDengan"
              value="Iklan"
              checked={formData.berkaitanDengan === 'Iklan'}
              onChange={handleChange}
            />
            <label htmlFor="iklan">Iklan</label>

            <input
              type="radio"
              id="digital"
              name="berkaitanDengan"
              value="Digital"
              checked={formData.berkaitanDengan === 'Digital'}
              onChange={handleChange}
            />
            <label htmlFor="digital">Digital</label>

            <input
              type="radio"
              id="lainnya"
              name="berkaitanDengan"
              value="Lainnya"
              checked={formData.berkaitanDengan === 'Lainnya'}
              onChange={handleChange}
            />
            <label htmlFor="lainnya">Lainnya</label>
          </div>
        </div>

        <div>
          <input
            type="text"
            id="tautan"
            name="tautan"
            placeholder="Tautan (url) yang berkaitan"
            value={formData.tautan}
            onChange={handleChange}
          />
        </div>

        <div>
          <textarea
            id="pesan"
            name="pesan"
            placeholder="Pesan"
            value={formData.pesan}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Kirim</button>
      </form>

      <Footer />
    </div>
  );
}

export default Contact;
