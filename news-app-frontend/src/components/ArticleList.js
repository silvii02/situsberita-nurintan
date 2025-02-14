import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configUrl from '../configUrl';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import SidebarDashboard  from '../components/SidebarDashboard';
import '../assets/css/style.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;
  const location = useLocation();

  useEffect(() => {
    axios.get(`${configUrl.beBaseUrl}/api/articles`)
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });

    axios.get(`${configUrl.beBaseUrl}/api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Tidak ada Category';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `Pada: ${day}-${month}-${year} / ${hours}:${minutes}`;
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render untuk tampilan desktop
  const renderDesktopView = () => (
    <div>
    <div className='body-wrapper'>

       {location.pathname === '/artikellist' && <SidebarDashboard />} 
    <div className="article-list">
      {currentArticles.map(article => (
        <div key={article.id} className="article-card-home">
          <div className='body-article'>
            <div className='article-image-wrap'>
              <img 
                src={`${configUrl.beBaseUrl}${article.image_url}`} 
                alt={article.title} 
                className="article-image"
              />
            </div>
            <div className="article-content">
              <span className='title-article'>
                <Link to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`} style={{ textTransform: 'capitalize' }}>
                  {article.title}
                </Link>
              </span>
              <span className="article-body">
                {article.body.substring(0, 100)}...
              </span>
              <div className="article-meta">
                {formatDate(article.created_at)}
              </div>
            </div>
          </div>
        </div>
      ))}
      <Pagination 
        articlesPerPage={articlesPerPage} 
        totalArticles={articles.length} 
        paginate={paginate} 
        currentPage={currentPage}
      />
    </div>
    </div>
    </div>
  );

  // Render untuk tampilan mobile
  const renderMobileView = () => (
    <div className="article-list-mobile">
      {currentArticles.map(article => (
        <div key={article.id} className="article-card-mobile">
          <div className="body-article-mobile">
            <div className="article-image-wrap-mobile">
              <img 
                src={`${configUrl.beBaseUrl}${article.image_url}`} 
                alt={article.title} 
                className="article-image-mobile"
              />
            </div>
            <div className="article-content-mobile">
            <span className="title-article-mobile">
              <Link to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`}>
                {article.title.substring(0, 70)}
              </Link>
              <div className="article-date">
                {formatDate(article.created_at)}
              </div>
            </span>
            </div >
          </div>
        </div>
      ))}
      <Pagination 
        articlesPerPage={articlesPerPage} 
        totalArticles={articles.length} 
        paginate={paginate} 
        currentPage={currentPage}
      />
    </div>
    
  );
  

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </>
  );
};

const Pagination = ({ articlesPerPage, totalArticles, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const pageNumbers = [];
  
  // Generate page numbers
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push( totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }
  }

  return (
    <nav>
      <div className="pagination">
        {/* Previous Button */}
        {currentPage > 1 && (
          <button onClick={() => paginate(currentPage - 1)} className="page-link">
            Previous
          </button>
        )}

        {/* Page Numbers */}
        {totalPages > 5 && currentPage > 3 && (
          <>
            <button onClick={() => paginate(1)} className={`page-link ${currentPage === 1 ? 'active' : ''}`}>
              1
            </button>
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

        {/* Next Button */}
        {currentPage < totalPages && (
          <button onClick={() => paginate(currentPage + 1)} className="page-link">
            Next
          </button>
        )}
      </div>
    </nav>
  );
};

export default ArticleList;
