import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { IoMdCreate } from "react-icons/io";
import { FaSave, FaUndo } from "react-icons/fa";
import SidebarDashboard from '../components/SidebarDashboard'; 
import '../assets/css/style.css';
import axios from 'axios';
import configUrl from '../configUrl';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CreateArticle() {
  const [title, setTitle] = useState('');
  const [titleWarning, setTitleWarning] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const [linkVidio, setLinkVidio] = useState('');
  const [showVidio, setShowVidio] = useState(null);



  useEffect(() => {
    const userData = localStorage.getItem('userid');
    // console.log(userData, "ini userData");
    let Iduser = 0;
    if (userData) {
      let userId = JSON.parse(userData);
      Iduser = userId.id;

      if (!Iduser || isNaN(Number(Iduser))) {
        console.error("Iduser tidak valid:", Iduser);
        Iduser = 2; 
      }
      
      
      // console.log(typeof(Iduser), "ini type Iduser");
      setAuthorId(Number(Iduser));
  } else {
      console.log('Data user tidak ditemukan di localStorage');
  }

  }, [navigate]);

  useEffect(() => {
    axios.get(`${configUrl.beBaseUrl}/api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

  const handleEditorChange = (content) => {
    setBody(content);
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
  
    // Fungsi untuk memformat judul agar setiap kata dimulai dengan huruf kapital
    const capitalizeTitle = (input) => {
      return input
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
  
    const handleTitleChange = (e) => {
      const formattedTitle = capitalizeTitle(e.target.value);
      setTitle(formattedTitle);
    };

  const handleSubmit = () => {
    let sanitizebody = sanitizeHTML(body);
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', sanitizebody);
    formData.append('category_id', selectedCategory);
    formData.append('author_id', authorId);
    formData.append('tags', tags);
    formData.append('linkVidio', linkVidio);
  
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
  
    console.log({
      title,
      body: sanitizebody,
      category_id: selectedCategory,
      author_id: authorId,
      tags,
    }); // Log data yang akan dikirim
  
    axios.post(`${configUrl.beBaseUrl}/api/articles`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      Swal.fire({
        title: 'Success!',
        text: 'Artikel berhasil disimpan!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => navigate('/dashboard'));
    })
    .catch(error => {
      console.error('There was an error creating the article!', error.response.data);
    });
  };
  
  const checkTitleExists = async (title) => {
    try {
      const response = await axios.post(`${configUrl.beBaseUrl}/api/checktitle`, {
        title: title, // Kirim title dalam body request
      });
      console.log(response, 'ini res[pon cek judul');
  
      if (response.data.exists) {
        setTitleWarning('Judul telah digunakan, silakan ganti dengan yang lain.');
      } else {
        setTitleWarning('');
      }
    } catch (error) {
      console.error('Error checking title:', error);
    }
  };
  
  
  return (
    <div className="dashboard-container">
      <div>
      <SidebarDashboard />
      </div>
      <div className='right-dashboard'>
      <form className='form1'>
      <div className="header-container">
        <IoMdCreate className="MdCreate" />
        <h1>Create Article</h1>
      </div>


        {/* Input untuk Title */}
        <div>
          <label className="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            onBlur={() => checkTitleExists(title)}
            placeholder="Enter article title"
          />
          
        </div>
{titleWarning && <div className="warning-message">{titleWarning}</div>}

        
        <div className='formGroup'>
          <label className="tags">Tags</label>
          <input className='input'
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Contoh: viral, trending, terkini"
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
            {imagePreview && (
              <div className='wrapper-change-foto'>
                <span className="upload-change-foto">Change Photo ?</span>
                <div className="upload-icon"> + </div>
              </div>
            )}
          </label>
          {imagePreview && (
            <div className="preview-container">
              <img src={imagePreview} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

         
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


        <div>
          <label className='category'>Category</label>
          <select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

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
          initialValue="situsintan.org"
          onEditorChange={handleEditorChange}
        />

<div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
<button 
  type="reset" 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: '10px', 
    backgroundColor: '#FFC107', 
    color: '#000', 
    padding: '10px 20px', 
    border: 'none', 
    cursor: 'pointer',
    width: '150px' // Atur lebar sesuai kebutuhan
  }}
>
  <FaUndo style={{ marginRight: '5px', color: 'black' }} />
  Batalkan
</button>

            <button 
              type="button" 
              onClick={handleSubmit} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#1F316F', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              <FaSave style={{ marginRight: '5px' }} />
              Simpan
            </button>
          </div>

      </form>
    </div>
    </div>
  );
}
