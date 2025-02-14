import React from 'react';
import { Link } from 'react-router-dom';
import configUrl from '../configUrl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ArticleCard = ({ article, index, onEdit, onDelete, onSetAsSlider, showControls }) => {
  const navigate = useNavigate();

      const handleSetAsSlider = async (articleId) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

          const isSlider = article.slider;
          await axios.post(`${configUrl.beBaseUrl}/api/articles/${article.id}/${isSlider ? 'unset-slider' : 'set-as-slider'}`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (onSetAsSlider) {
            onSetAsSlider(article.id, !isSlider);
          }

          window.location.reload();

        } catch (error) {
          console.error('Error setting article as slider headline:', error);
        }
      };

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `Pada: ${day}-${month}-${year} / ${hours}:${minutes} `;
      };

  return (
    <div className="article-card full-width-page">
      <div style={{display: "flex", alignItems: "center", gap: "3px"}}>
      <span style={{ fontSize: "17px"}}>{index + 1}. </span>
       <Link to={`/articles/${article.id}/${encodeURIComponent(article.slug)}`}>
      <span style={{fontSize: "18px", textTransform: 'capitalize'}}>{article.title}</span>
      </Link>
      </div>
     <div className='article-card-meta'>{formatDate(article.created_at)} </div>

      {showControls && (
        <div className="controls">
         <button onClick={() => onEdit(article.id)}>Ubah</button>
         <button onClick={() => onDelete(article.id)}>Hapus</button>
         <button onClick={handleSetAsSlider}>
           {article.slider ? 'Un-Set as HeadLine' : 'Set as HeadLine'}
         </button>
        </div>

      )}

    </div>
  );
};

export default ArticleCard;
