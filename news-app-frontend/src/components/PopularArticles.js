import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/style.css';
import { Link } from 'react-router-dom';
import configUrl from '../configUrl';
import Header from './Header';  
import Footer from './Footer'; 

const PopularArticleList = () => {
  const [popularArticles, setPopularArticles] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;

  useEffect(() => {
    axios.get(`${configUrl.beBaseUrl}/api/articlespop`)
      .then(response => {
        setPopularArticles(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching popular articles:', error);
        setError('Failed to fetch popular articles.');
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `Pada: ${day}-${month}-${year}`;
  };

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = popularArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />

      <div className="popular-article-list">
        <h1 className="header-ar-popular">
            Berita Terpopuler
            <span className="extra-decor decor-popular"></span>
            <span className="extra-decor decor-popular1"></span>
        </h1>
        {error && <p className="error">{error}</p>}
        {currentArticles.map(article => (
          <div key={article.id} className="popular-article-card">
            <img 
            src={`${configUrl.beBaseUrl}${article.image_url}`} 
            alt={article.title} 
            className="popular-article-image"
            />

            <div className="popular-article-card-content">
              <Link to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`} style={{ textTransform: 'capitalize' }}>
                {article.title}
              </Link>

              <div className="popular-article-meta-info">
                <span className="popular-article-meta">
                  {formatDate(article.created_at)}
                </span> - 
                <span className="popular-article-views">
                  Dibaca: {article.views} x
                </span>
              </div>
            </div>
          </div>
        ))}
        <Pagination 
          articlesPerPage={articlesPerPage} 
          totalArticles={popularArticles.length} 
          paginate={paginate} 
          currentPage={currentPage}
        />
      </div>

      <Footer />
    </div>
  );
};

const Pagination = ({ articlesPerPage, totalArticles, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalArticles / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <div className='pagination'>
        {pageNumbers.map(number => (
          <span key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className='page-link'>
              {number}
            </button>
          </span>
        ))}
      </div>
    </nav>
  );
};

export default PopularArticleList;
