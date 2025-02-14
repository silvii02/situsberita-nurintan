import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../assets/css/style.css';
import configUrl from '../configUrl';
import DOMPurify from 'dompurify';
import Header from '../components/Header';  
import ShareButtons from '../components/ShareButtons';
import Footer from '../components/Footer'; 

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [comments, setComments] = useState([]);
  

  const [likeCount, setLikeCount] = useState(0);

  async function handleLike(articleId) {
        const response = await fetch(`${configUrl.beBaseUrl}/api/articles/${articleId}/like`, {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
          setLikeCount(prevCount => prevCount + 1);
            const data = await response.json();
            console.log(data.message);
        } else {
            const errorData = await response.json();
            console.error(errorData.error);
        }
    }

    
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await axios.get(`${configUrl.beBaseUrl}/api/articles/${id}/likes`);
        setLikeCount(response.data.like_count);
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
    };
    fetchLikeCount()
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsResponse = await axios.get(`${configUrl.beBaseUrl}/api/articles/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [id]);
  
    
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage

      // Menambahkan header Authorization jika ada token
      const response = await axios.get(`${configUrl.beBaseUrl}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Kirim token dengan request
        },
      });

      setArticle(response.data);

             // Set title halaman berdasarkan judul artikel
             document.title = response.data.title;
        
        // Fetch related articles
        const relatedResponse = await axios.get(`${configUrl.beBaseUrl}/api/articles/related/${response.data.category_id}/${id}`);
        setRelatedArticles(relatedResponse.data);



        setLoading(false);
      } catch (error) {
        console.error('Error fetching article or related articles:', error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${configUrl.beBaseUrl}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchArticle();
    fetchCategories();
    return () => {
    document.title = 'Situs Berita - situsintan.org';
  };
  }, [id]);

  const handleSubmitComent = async (e) => {
    e.preventDefault();
  
    // Bersihkan input untuk mencegah XSS
    const sanitizedComment = {
      name: DOMPurify.sanitize(newComment.name),
      body: DOMPurify.sanitize(newComment.body),
    };
  
    // Validasi untuk memastikan input tidak kosong setelah sanitasi
    if (!sanitizedComment.name || !sanitizedComment.body) return;
  
    setLoading(true); // Mulai loading
    try {
      const response = await axios.post(`${configUrl.beBaseUrl}/api/comments`, {
        article_id: id,
        name: sanitizedComment.name,
        
        body: sanitizedComment.body,
      });
  
      setComments((prevComments) => [...prevComments, response.data]);

      window.location.reload();
      
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setNewComment({ name: '', body: '' }); 
      setLoading(false); // Selesai loading
    }
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Kategori tidak ditemukan';
  };

  if (loading) {
    return <div className="cssload-dots"><i className="cssload-dot-1"></i><i className="cssload-dot-2"></i><i className="cssload-dot-3"></i><i className="cssload-dot-4"></i><i className="cssload-dot-5"></i><i className="cssload-dot-6"></i>
	</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  const imageUrl = `${configUrl.beBaseUrl}${article.image_url}`;
  const halDetail = `${configUrl.beBaseUrl}${article.slug}`;

  return (
    <div>
      <Header />

    <div className="article-container">
      
       {/* Breadcrumb */}
       <div className='breadcrumb-wrapper'>
       <nav className="breadcrumb">
        <Link to="/">Home</Link> 
        <Link to={`/kategori/${getCategoryName(article.category_id).toLowerCase().replace(/\s+/g, '-')}`}>
  {getCategoryName(article.category_id)}
</Link>
      </nav>
          </div>

      <div className="article-detail">
        
        {/* Judul Artikel */}
        <h1 style={{ textTransform: 'capitalize' }}>{article.title}</h1>
        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.content )}}/>

        {/* Meta (Tanggal) di bawah judul */}
        <p className="article-meta">
          {formatDate(article.created_at)}
        </p>

        {/* Garis pembatas */}
        <hr className="article-divider" />

        {/* Meta Penulis */}
        <p className="articlee-metaa">
          Penulis: <span className="author-name">{article.author_name}</span>
        </p>
    
        {/* Gambar Artikel */}
        <div style={{position:'relative'}}>
        <img src={imageUrl} alt={article.title} className="article-image-full" />
        <div className='logo-thumbnail'></div>
        </div>
    
        {/* Isi Artikel */}
        <span className='article-body'>
  {article.body.split('\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ))}
</span>

        <div>
          {article.linkVidio && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            <iframe
              width="397"
              height="230"
              src={article.linkVidio.replace("watch?v=", "embed/")}
              frameBorder="0"
              allowFullScreen
              title="Video Preview"
            ></iframe>
            </div>
         )}
        </div>

    
        {/* Footer Artikel */}
        {/* Footer Artikel */}
<div className='footer-detail-artikel'>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleLike(id)}>
      <span
        style={{
          background: "url(https://www.clipartmax.com/png/middle/280-2807326_cc-thumbs-up-comments-icon-jempol.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          height: "20px",
          width: "20px",
        }}
      ></span>
      <div style={{ marginLeft: "5px" }}>{likeCount}</div>
    </div>

    {/* Pastikan ini berada dalam elemen flex yang sama untuk sejajar */}
    <p className="article-meta1">
      - Dibaca: {article.views} Kali
    </p>
  </div>
</div>

        
      </div>
      <ShareButtons articleUrl={halDetail} articleTitle={article.title} articleId={article.id} />


      {/* Komentar Facebook */}
      <div className="fb-comments" data-href={halDetail} data-width="780" data-numposts="5"></div>
  
      {/* Kolom Komentar */}
      <div className="comments-section">
        <h3>Komentar</h3>

        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={comment.id || index} className="comment">
                <div>
                  <img src="https://cdn.iconscout.com/icon/free/png-256/free-batman-icon-download-in-svg-png-gif-file-formats--logo-dc-superhero-hero-justice-pack-avatars-icons-28695.png" width="20px" height="auto" alt="Avatar" />
                  <strong>{comment.name}</strong>
                </div>
                <p>{comment.body}</p>
              </div>
            ))
          ) : (
            <span>Belum ada komentar.</span>
          )}
        </div>

        <div className="comment-form">
          <h3>Tinggalkan Komentar</h3>
          <form>
            <div>
              <label htmlFor="name">Nama</label>
              <input
                type="text1"
                id="name"
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                required
              />
            </div>
           
      <div>
        <label htmlFor="comment">Komentar</label>
        <textarea
          id="comment"
          value={newComment.body}
          onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          rows={5}
          required
        ></textarea>
      </div>
      <button className='button-comment' type="submit" onClick={handleSubmitComent}>Kirim Komentar</button>
    </form>
  </div>

</div>


      {/* Artikel Terkait */}
      <div className="related-articles">
        <h1 className="articles-terkait-h1">
        Artikel Terkait
        <span className="extra-decor decor-00"></span>
        <span className="extra-decor decor-01"></span>
      </h1>
        {relatedArticles.length > 0 ? (
          <div className="popular-article-list1">
            {relatedArticles.map(relatedArticle => (
              <div key={relatedArticle.id} className="popular-article-card1">
                <img 
                  src={`${configUrl.beBaseUrl}${relatedArticle.image_url}`} 
                  alt={relatedArticle.title} 
                  className="popular-article-image1"
                />
                <div className="popular-article-card-content1">
                  <Link to={`/articles/${relatedArticle.id}/${encodeURIComponent(relatedArticle.slug)}`} style={{ textTransform: 'capitalize' }}>
                    {relatedArticle.title}
                  </Link>
                  <div className="popular-article-meta-info1">
                    <span className="popular-article-meta1">
                      {formatDate(relatedArticle.created_at)}
                    </span> - 
                    <span className="popular-article-views1">
                      Dibaca: {relatedArticle.views} Kali
                    </span>
                  </div>
                </div>
              </div>
            )) }
          </div>
        ) : (
          <span>Tidak ada artikel terkait.</span>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ArticleDetail;
