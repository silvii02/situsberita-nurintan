import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';  
import Footer from '../components/Footer'; 
import configUrl from '../configUrl';

const TagArticlesPage = () => {
    const { tagId } = useParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(`${configUrl.beBaseUrl}/api/tag/${tagId}`);
                setArticles(response.data);
            } catch (error) {
                console.error('Error fetching articles by tag:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [tagId]);

    // Function to handle the back navigation
    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div>
        <Header />
        <div className="tag-articles-container">
            {/* Button for going back */}
            <div className="back-button" onClick={handleBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                {/* SVG icon for the back arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H3.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L3.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
                </svg>
                <span style={{ marginLeft: '8px' }}>Kembali</span>
            </div>

            {loading ? (
                <div classNameName="cssload-dots"><i className="cssload-dot-1"></i><i className="cssload-dot-2"></i><i className="cssload-dot-3"></i><i className="cssload-dot-4"></i><i className="cssload-dot-5"></i><i className="cssload-dot-6"></i>
	</div>
            ) : (
                <>
                    <h1>Artikel dengan Tag: #{tagId}</h1>
                    <ul>
                        {articles.map(article => (
                            <li key={article.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                {/* Image next to the title */}
                                <img 
                                    src={`${configUrl.beBaseUrl}${article.image_url}`} 
                                    alt={article.title} 
                                    style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                />
                                <Link to={`/articles/${article.id}/${article.slug}`}>
                                    <div>{article.title}</div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>\
        <Footer />
        </div>
    );
};

export default TagArticlesPage;
