import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import configUrl from '../configUrl';
import '../assets/css/style.css';

const TopTagsLink = ({ tagsartikel }) => {
  const [articles, setArticles] = useState([]);
   useEffect(() => {
     const fetchTopTagArticles = async () => {
       try {
         const response = await axios.get(`${configUrl.beBaseUrl}/api/articlestoptags`);
         setArticles(response.data);
    
       } catch (error) {
         console.error('Error fetching top tag articles:', error);
       }
     }
     fetchTopTagArticles();
   }, []);

  const parseTags = (tagsString) => {
    return tagsString.split(',').map(tag => tag.trim());
  };

  return (
        <div className="top-tag-link">
          <h4>#Trending</h4>
          <div className="top-tag-link-list">
            {articles.map(article => (
              <div key={article.id} className="card-tag-link">
                <span>
                    {parseTags(article.tags).map((tag, index) => (
                      <span key={index} className="link-tag">
                        <Link to={`/tags/${tag.replace(/\s+/g, '-').toLowerCase()}`}>#{tag}</Link>
                      </span>
                    ))}
                  </span>

              </div>
            ))}
          </div>
        </div>
      );
    };


export default TopTagsLink;
