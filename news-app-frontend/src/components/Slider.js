import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import configUrl from '../configUrl';
import { Link } from 'react-router-dom';
import '../assets/css/style.css';



const ArticleSlider = () => {
  const [articles, setArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const sliderResponse = await axios.get(`${configUrl.beBaseUrl}/api/articleSlider`);
        setArticles(sliderResponse.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const settings = {
    dots: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: articles.length > 1,
    prevArrow: null,
    nextArrow: null,

  };

  return (
    <div>
    <div className="slider-container">
      <div className="article-slider">
        <Slider {...settings}>
          {articles.map(article => (
            <div key={article.id} className="item-slider">
              <Link to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`} className='headline-link'>
                <div className="image-container">
                  <img src={`${configUrl.beBaseUrl}${article.image_url}`} alt={article.title} className="headline-image" />
                  <div className="headline-overlay">
                    <h4 className="headline-title">{article.title}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      <div className="article-card-slider">
        {latestArticles.map(article => (
          <div key={article.id} className="article-card-item">
            <Link to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`} className="article-link">
              <img src={`${configUrl.beBaseUrl}${article.image_url}`} alt={article.title} className="article-card-image" />
              <span className="title-in-card">{article.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ArticleSlider;
