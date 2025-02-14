import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';  
import Footer from '../components/Footer'; 
import configUrl from '../configUrl'; // Assuming you have a config file for your base URL

const CategoryArticles = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${configUrl.beBaseUrl}/api/categories/${slug}/articles`);
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [slug]);

  if (loading) {
    return <div className="cssload-dots"><i className="cssload-dot-1"></i><i className="cssload-dot-2"></i><i className="cssload-dot-3"></i><i className="cssload-dot-4"></i><i className="cssload-dot-5"></i><i className="cssload-dot-6"></i>
	</div>;
  }

  return (
    <div>
      <Header />
      <div className="category-articles1">
        <h1>Artikel-artikel dalam Kategori "{slug}"</h1>
        <div className="article-list1-category">
          {articles.map((article) => (
            <div key={article.id} className="article-card-categoryyy"> {/* Menggunakan kelas .article-card */}
              <img 
                src={`${configUrl.beBaseUrl}${article.image_url}`} 
                alt={article.title} 
                className="article-category-image2" 
              />
              <div className="article-card-category-content"> {/* Menggunakan kelas .article-card-content */}
                <a href={`/articles/${article.id}/${encodeURIComponent(article.slug)}`}>{article.title}</a>
                <div className="meta">
                <span className="date">
                  Pada: {new Date(article.created_at).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).replace(',', '/')}
                </span>

                  <span>Dibaca: {article.views} Kali</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryArticles;
