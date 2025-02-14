import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import configUrl from '../configUrl';
import '../assets/css/style.css';

const TopTags = ({ tagsartikel }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchTopTagArticles = async () => {
      try {
        const response = await axios.get(`${configUrl.beBaseUrl}/api/articlestoptags`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching top tag articles:', error);
      }
    };

    fetchTopTagArticles();
  }, []);

  return (
    <section className="top-tag-articles">
      <h1 className="top-tag-articles-h1">
        Trending Hari Ini
        <span className="extra-decor decor-12"></span>
        <span className="extra-decor decor-22"></span>
      </h1>
      <div className="top-tag-articles-list">
        {articles.map(article => (
          <article key={article.id} className="card-tag">
            <img
              src={`${configUrl.beBaseUrl}${article.image_url}`}
              alt={`Image for article: ${article.title}`}
            />
            <div className="card-content">
              <Link to={`/articles/${article.id}/${article.slug}`} aria-label={`Read more about ${article.title}`}>
                <h3>{article.title}</h3>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TopTags;
