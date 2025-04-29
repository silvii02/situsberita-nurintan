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
  const articlesPerPage = 6;

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
  const totalPages = Math.ceil(popularArticles.length / articlesPerPage);
  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }
  }

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
        <nav>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => paginate(currentPage - 1)} className="page-link">Previous</button>
            )}

            {totalPages > 5 && currentPage > 3 && (
              <>
                <button onClick={() => paginate(1)} className={`page-link ${currentPage === 1 ? 'active' : ''}`}>1</button>
                <span>...</span>
              </>
            )}

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`page-link ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span>...</span>
                <button
                  onClick={() => paginate(totalPages)}
                  className={`page-link ${currentPage === totalPages ? 'active' : ''}`}
                >
                  {totalPages}
                </button>
              </>
            )}

            {currentPage < totalPages && (
              <button onClick={() => paginate(currentPage + 1)} className="page-link">Next</button>
            )}
          </div>
        </nav>

      </div>
    </div>
  );
};
export default PopularArticleList;
