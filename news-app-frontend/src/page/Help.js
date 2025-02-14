import React from 'react';
import Header from '../components/Header';  
import Footer from '../components/Footer'; 

const Help = () => {
  return (
    <div>
        <Header />
    <div className="help-container">
      <section className="help-section">
        <h3>BANTUAN :: HELP</h3>
        <p>Bagaimana mem-posting berita/tulisan di situsintan.org? Ikuti langkah-langkah berikut ini:</p>
      </section>

      <section className="help-section">
        <h3>DAFTAR/REGISTER</h3>
        <p>
          Anda harus mendaftar untuk menjadi anggota situsintan.org Klik menu DAFTAR/REGISTER yang 
          berada di bagian kiri-atas, di bawah Kanal Rubrik. Anda harus mengisi box dialog dengan 
          Nama User, alamat E-mail, dan Password.
        </p>
      </section>

      <section className="help-section">
        <h3>MASUK/LOGIN</h3>
        <p>
          Setelah selesai mendaftar, silakan klik menu MASUK/LOGIN dan isi dengan nama "User" 
          dan "Password", seperti yang telah Anda daftarkan.
        </p>
      </section>

      <section className="help-section">
        <h3>FACEBOOK CONNECT</h3>
        <p>
          Facebook Connect adalah fasilitas yang memungkinkan pengguna (user) Facebook untuk 
          "menghubungkan" identitas mereka ke situs manapun. Facebook Connect juga merupakan 
          salah satu cara untuk memudahkan para pembaca untuk register, login ke website yang 
          menyediakan fasilitas Facebook Connect tanpa harus perlu mengisikan nama, email, dan url.
        </p>
        <br></br>
        <p>
          Untuk menggunakan fasilitas facebook connect, tekan tombol Facebook Connect, apabila 
          akun facebook anda belum terhubung dengan situsintan.org, maka akan muncul dialog untuk 
          pendaftaran dimana anda tidak perlu untuk melengkapi semua data, hanya diperlukan username 
          (apabila username anda telah digunakan orang lain maka anda diharuskan mencari username yang berbeda).
        </p>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default Help;
