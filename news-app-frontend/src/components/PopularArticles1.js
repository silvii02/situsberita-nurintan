import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/style.css';
import { Link } from 'react-router-dom';
import configUrl from '../configUrl';

const PopularArticleList1 = () => {
  const [popularArticles, setPopularArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${configUrl.beBaseUrl}/api/articlespop`)
      .then(response => {
        const sortedArticles = response.data.sort((a, b) => b.views - a.views);
        setPopularArticles(sortedArticles);
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

  const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  const mostViewedArticle = popularArticles[0];

  return (
    <div>
      <h1 className="popular-article-h1">
        Terpopuler
        <span className="extra-decor decor-1"></span>
        <span className="extra-decor decor-2"></span>
      </h1>

      <div className="popular-article-list11">
        <div className="popular-article-list11-atas">
          {mostViewedArticle && (
            <div className="popular-article-card11">
              <img 
                src={`${configUrl.beBaseUrl}${mostViewedArticle.image_url}`} 
                alt={mostViewedArticle.title} 
                className="popular-article-image-overlay"
              />
              <div className="overlay-text">
                <Link 
                  to={`/articles/${mostViewedArticle.id}/${encodeURIComponent(mostViewedArticle.slug)}`} 
                  style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}
                >
                  {mostViewedArticle.title}
                </Link>
                <div className="popular-article-meta-info113">
                  <span className="popular-article-meta113">
                    {formatDate(mostViewedArticle.created_at)}
                  </span> 
                  <span className="popular-article-views113">
                    Dibaca: {mostViewedArticle.views} x
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="popular-article-list11-bawah">
          {error && <p className="error">{error}</p>}
          {popularArticles.slice(1).map(article => (
            <div key={article.id} className="popular-article-card11">
              <img 
                src={`${configUrl.beBaseUrl}${article.image_url}`} 
                alt={article.title} 
                className="popular-article-image11"
              />
              <div className="popular-article-card-content11">
                <Link 
                  to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`} 
                  style={{ textTransform: 'capitalize' }}
                >
                  {window.innerWidth <= 768 ? truncateText(article.title, 60) : article.title}
                </Link>
                <div className="popular-article-meta-info11">
                  <span className="popular-article-meta11 hide-on-mobile">
                    {formatDate(article.created_at)}
                  </span>
                  <span className="popular-article-views11">
                    Dibaca: {article.views} x
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularArticleList1;
