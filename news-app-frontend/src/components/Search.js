import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import configUrl from '../configUrl';

const Search = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query) return;
  
    try {
      const response = await axios.get(`${configUrl.beBaseUrl}/api/search`, {
        params: { query }
      });
      const results = response.data;
  
      console.log('Navigating with results:', results); // Debugging
  
      navigate('/search-results', { state: { query, results } });
    } catch (error) {
      console.error('Error fetching results', error);
    }
  };
  
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="search-page">
      <h1>Cari Berita</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
