import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import configUrl from '../configUrl'; // Pastikan kamu sudah mengimpor `configUrl` jika dibutuhkan

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // Menyimpan keyword pencarian

  // Ambil hasil pencarian yang dikirim dari Header
  useEffect(() => {
    if (location.state && location.state.results) {
      setSearchResults(location.state.results);
    }
    if (location.state && location.state.keyword) {
      setSearchKeyword(location.state.keyword); // Ambil kata kunci pencarian
    }
  }, [location]);

    // Fungsi untuk keluar dari halaman pencarian
    const handleExit = () => {
      navigate(-1); // Kembali ke halaman sebelumnya
    };

  return (
    <div className="search-results-container">
       <div className="search-header1">
       <button className="exit-button" onClick={handleExit}>
          <FontAwesomeIcon icon={faArrowLeft} /> {/* Icon exit */}
        </button>
        <p onClick={handleExit} style={{ cursor: 'pointer' }}>Keluar</p> 
        </div>
      <h2>Hasil Pencarian {searchKeyword ? `untuk "${searchKeyword}"` : ''}</h2>

      {searchResults.length === 0 ? (
        <p>Tidak ada hasil ditemukan.</p>
      ) : (
        <ul>
          {searchResults.map((result, index) => (
            <li key={index} className="search-result-item">
              {/* Menambahkan gambar */}
              <div className="search-result-image-wrap">
                <img 
                  src={`${configUrl.beBaseUrl}${result.image_url}`} // Menambahkan URL gambar dari result.image_url
                  alt={result.title} 
                  className="search-result-image" 
                />
              </div>
              <div>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
              <Link to={`/articles/${result.id}/${result.slug}`}>Baca selengkapnya</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
