import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Editor } from '@tinymce/tinymce-react';
import configUrl from '../configUrl';
import { IoMdCreate } from "react-icons/io";
import { FaSave, FaUndo } from "react-icons/fa";
import Swal from 'sweetalert2';
import SidebarDashboard from '../components/SidebarDashboard'; 
import ReloadButton from '../components/ReloadBtn';

const EditArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bodyLoaded, setBodyLoaded] = useState(false);
  const navigate = useNavigate();
  const [tags, setTags] = useState('');
  const [linkVidio, setLinkVidio] = useState('');
  const [showVidio, setShowVidio] = useState(null);

  useEffect(() => {
    const fetchArticleAndCategories = async () => {
      try {
        const articleResponse = await axios.get(`${configUrl.beBaseUrl}/api/articles/${id}`);
        // console.log(articleResponse.data, 'ini respon data'); // Log untuk memastikan data benar
        setArticle(articleResponse.data); // Pastikan data ini sesuai dengan yang diharapkan backend
  
        if (articleResponse.data.image_url) {
          setImagePreview(`${configUrl.beBaseUrl}${articleResponse.data.image_url}`);
        }
        setLinkVidio(articleResponse.data.linkVidio);
        const categoriesResponse = await axios.get(`${configUrl.beBaseUrl}/api/categories`);
        setCategories(categoriesResponse.data);
        setTags(articleResponse.data.tags || '');
        setBodyLoaded(true);
      } catch (error) {
        // console.error('Error fetching article or categories:', error);
      }
    };
  
    fetchArticleAndCategories();
  }, [id]);
  

  const handleEditorChange = (content, editor) => {
    setArticle(prevArticle => ({
      ...prevArticle,
      body: content
    }));
  };

  let sudahdibersihkan = '';
  const sanitizeHTML = (input) => {
    sudahdibersihkan = input
      .replace(/<\/?ul[^>]*>/gi, '')  // Menghapus tag <ul>
      .replace(/<\/?li[^>]*>/gi, '• ')  // Mengganti tag <li> dengan bullet
      .replace(/<\/?p[^>]*>/gi, '')  // Menghapus tag <p>
      .replace(/<\/?br[^>]*>/gi, '')  // Menghapus tag <br>
      .replace(/<\/?strong[^>]*>/gi, '')  // Menghapus tag <strong>
      .replace(/<a\b[^>]*>(.*?)<\/a>/gi, '')  // Menghapus tag <a>
      .replace(/<\/?em[^>]*>/gi, '')  // Menghapus tag <em>
      .replace(/&nbsp;/g, ' ')  // Menghapus &nbsp; dan menggantinya dengan spasi biasa
      .replace(/&ldquo;|&rdquo;/g, '"')  // Mengganti &ldquo; dan &rdquo; dengan tanda kutip biasa
      .replace(/&lsquo;|&rsquo;/g, "'")  // Mengganti &lsquo; dan &rsquo; dengan tanda kutip satu biasa
      .replace(/<section class="native-polling"><\/section>/gi, '')  // Menghapus <section class="native-polling"></section>
      .replace(/<div id="lastread"><\/div>/gi, '');  // Menghapus <div id="lastread"></div>
  
    return sudahdibersihkan;
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prevArticle => ({
      ...prevArticle,
      [name]: value
    }));
  };

  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handlePreviewVideo = () => {
    // Menampilkan video hanya jika URL video valid
    const videoId = linkVidio.split('v=')[1];
    if (videoId) {
      const ampersandPosition = videoId.indexOf('&');
      const cleanVideoId = ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
      setShowVidio(`https://www.youtube.com/embed/${cleanVideoId}`);
    } else {
      setShowVidio(''); // Reset jika URL tidak valid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(article,'ini artikel yanga akan dikirim');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const sanitizedBody = sanitizeHTML(article.body);
      let imageUrlToSave = article.image_url;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const uploadResponse = await axios.post(`${configUrl.beBaseUrl}/api/upload-image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });

        imageUrlToSave = uploadResponse.data.image_url;
      }

      const updatedArticle = {
        ...article,
        image_url: imageUrlToSave,
        body: sanitizedBody,
        tags: tags,
        linkVidio: linkVidio,
      };
      // console.log(token,'token');
      // console.log('Updated Article:', updatedArticle);
      // console.log(article,'ini artikel yang akan dikirim2');
      // console.log('Data to be sent:', updatedArticle);
      await axiosInstance.put(`/articles/${id}`, updatedArticle, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        title: "Artikel Berhasil Disimpan!",
        icon: "success",
        draggable: true
      }).then(() => {
        navigate(`/dashboard`);
      });

    } catch (error) {
      console.error('Error updating article:', error.response?.data || error.message);
  
      Swal.fire({
        title: "Gagal Menyimpan Artikel",
        text: error.response?.data?.message || "Terjadi kesalahan.",
        icon: "error",
      });
    }
  };

  if (!article) {
    return <div className="cssload-dots"><i className="cssload-dot-1"></i><i className="cssload-dot-2"></i><i className="cssload-dot-3"></i><i className="cssload-dot-4"></i><i className="cssload-dot-5"></i><i className="cssload-dot-6"></i>
	</div>;
  }

  const handleCancel = () => {
    navigate(`/dashboard`);
  };

  return (
    <div className="dashboard-container">
      <SidebarDashboard />
      <form className='form1' onSubmit={handleSubmit} >
      <div className="header-container">
        <IoMdCreate className="MdCreate" />
        <h1>Edit Article</h1>
      </div>

        <div className='form-group'>
          <label>Title</label>
          <input
            type="text2"
            name="title"
            value={article.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="tags">Tags</label>
          <input className='input'
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Masukkan tags artikel"
          />
        </div>

        <div style={{ marginBottom: "3px" }}>Image / Photo</div>
        <div className="file-upload-container">
          <label className="file-upload-box">
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
            />
            {!imagePreview && <span className="upload-icon">+</span>}
            {imagePreview && <div className='wrapper-change-foto'><span className="upload-change-foto">Change Photo ?</span><div className="upload-icon"> + </div></div>}
          </label>
          {imagePreview && (
            <div className="preview-container">
              <img src={imagePreview} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

          {/* Input untuk Link Video */}
         <div>
          <label className="linkVidio">Link Video</label>
          <input
            type="text"
            id="linkVidio"
            name="linkVidio"
            value={linkVidio}
            onChange={(e) => setLinkVidio(e.target.value)}
            placeholder="Masukan Link Video dari YouTube"
          />
          <button type="button" className="preview-vidio" onClick={handlePreviewVideo}>Preview Video</button>
        </div>

        {/* Preview Video */}
        {showVidio && (
          <div className="video-preview">
            <iframe
              width="250"
              height="200"
              src={showVidio}
              frameBorder="0"
              allowFullScreen
              title="Video Preview"
            ></iframe>
          </div>
        )}

        <div className="form-group">
          <label>Category</label>
          <select
            name="category_id"
            value={article.category_id}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">

          {/* Editor TinyMCE */}
          <Editor
            apiKey='pthxqalyzwo3xtrb7u6egadri1j7stnxclvxnufjktvvbs8k'
            init={{
              
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
            }}
            value={article.body}
            onEditorChange={handleEditorChange}
          />
        </div>
        
        <div className="button-container">
        <button className="reset-button" type="button" onClick={handleCancel}>
    <FaUndo style={{ marginRight: "5px" }} /> Batalkan
  </button>
  <button className="save-button" type="submit">
    <FaSave style={{ marginRight: "5px" }} /> Simpan Artikel
  </button>
</div>

      </form>
    </div>
  );
};

export default EditArticle;
