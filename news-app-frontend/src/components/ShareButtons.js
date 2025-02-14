import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const ShareButtons = ({ articleUrl, articleTitle, articleId }) => {
    // Membuat slug dari judul artikel
    const titleSlug = articleTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // Ambil path tanpa domain atau subdomain dari articleUrl
    const cleanArticlePath = articleUrl.replace(/^https?:\/\/[^/]+/, '');

    // Membentuk URL final dengan titleSlug
    const formattedUrl = `https://www.situsintan.org/articles/${articleId}/${titleSlug}${cleanArticlePath}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formattedUrl)
            .then(() => alert("Link berhasil disalin ke clipboard!"))
            .catch(err => alert("Gagal menyalin link ke clipboard."));
    };

    return (
        <div className="social-share">
            <p>Share Artikel ini ke:</p>
            <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(formattedUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a 
                href={`https://wa.me/?text=${encodeURIComponent(formattedUrl)}`} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon icon={faWhatsapp} />
            </a>
            <button 
                onClick={copyToClipboard} 
                style={{
                    border: "none", 
                    backgroundColor: "#6c757d", // Warna abu-abu
                    borderRadius: "50%", 
                    width: "40px", 
                    height: "40px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    cursor: "pointer",
                    color: "white"
                }}
            >
                <FontAwesomeIcon icon={faLink} />
            </button>
        </div>
    );
};

export default ShareButtons;
