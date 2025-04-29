import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axios';
import configUrl from '../configUrl';
import SidebarDashboard from '../components/SidebarDashboard';
import { jsPDF } from 'jspdf';
import { FaDownload, FaPrint, FaPlus, FaSearch } from "react-icons/fa";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const articlesPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const response = await axiosInstance.get('/articles', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setArticles(response.data);
        } catch (error) {
          console.error('Error fetching articles:', error.response?.data || error.message);
        }
      }
    };
    fetchArticles();
  }, [navigate]);

  const handleEdit = (articleId) => {
    navigate(`/edit-article/${articleId}`);
  };

  const handleDelete = async (articleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Artikel yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Tidak, batalkan!',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn-dashboard1-confirm',
        cancelButton: 'btn-dashboard2-cancel'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${configUrl.beBaseUrl}/api/articles/${articleId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setArticles(articles.filter((article) => article.id !== articleId));
          Swal.fire('Terhapus!', 'Artikel Anda telah dihapus.', 'success');
        } catch (error) {
          console.error('Error deleting article:', error.response?.data || error.message);
          Swal.fire('Error!', 'Terjadi kesalahan saat menghapus artikel.', 'error');
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Dibatalkan', 'Artikel Anda aman :)', 'error');
      }
    });
  };

  const handleExportToExcel = () => {
    if (articles.length === 0) {
      Swal.fire('Oops!', 'Tidak ada data untuk diekspor.', 'info');
      return;
    }

    const dataToExport = articles.map((article, index) => ({
      NO: index + 1,
      TITLE: article.title,
      DATE: new Date(article.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Articles');
    XLSX.writeFile(workbook, 'Daftar_Artikel.xlsx');
  };

  const handleExportToPDF = () => {
    if (articles.length === 0) {
      Swal.fire('Oops!', 'Tidak ada data untuk dicetak.', 'info');
      return;
    }
    const doc = new jsPDF();
    doc.text('Daftar Artikel', 14, 10);

    const tableData = articles.map((article, index) => [
      index + 1,
      article.title,
      new Date(article.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
    ]);

    doc.autoTable({
      head: [['NO', 'TITLE', 'DATE']],
      body: tableData,
      startY: 14
    });

    doc.save('Daftar_Artikel.pdf');
  };

  const handleSetHeadline = async (articleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    try {
      await axiosInstance.post(`/articles/${articleId}/set-headline`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedArticles = articles.map((article) =>
        article.id === articleId ? { ...article, slider: 1 } : article
      );
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error setting headline:', error.response?.data || error.message);
    }
  };

  const handleUnsetHeadline = async (articleId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    try {
      await axiosInstance.post(`/articles/${articleId}/unset-headline`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedArticles = articles.map((article) =>
        article.id === articleId ? { ...article, slider: 0 } : article
      );
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error unsetting headline:', error.response?.data || error.message);
    }
  };

  // Pagination
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ display: 'flex' }}>
      <SidebarDashboard />
      <div className="dashboard">
        <h1>Dashboard Artikel</h1>

        <div className="export-buttons">
          <button className="export-btn" onClick={handleExportToExcel}>
            <FaDownload style={{ marginRight: '5px' }} /> Unduh Excel
          </button>
          <button className="export-btn export-pdf-btn" onClick={handleExportToPDF}>
            <FaPrint style={{ marginRight: '5px' }} /> Cetak PDF
          </button>
          <button className="btn-create" onClick={() => navigate('/create-article')}>
            <FaPlus style={{ marginRight: '5px' }} /> Create Article
          </button>
          <div className="dashboard-search">
        <input
          type="text"
          placeholder="Cari Artikel"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-search">
          <FaSearch />
        </button>

      </div>
        </div>
        

        

        {/* Tabel Artikel */}
        <table>
          <thead>
            <tr>
              <th>NO</th>
              <th>JUDUL</th>
              <th>TANGGAL</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((article, index) => (
              <tr key={article.id}>
                <td className="index">{index + 1 + (currentPage - 1) * articlesPerPage}</td>
                <td>
                  <Link
                    className="article-judul-link"
                    to={`/articles/${article.id}/${article.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}`}
                  >
                    {article.title}
                  </Link>
                </td>
                <td>{`Pada: ${new Date(article.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}`}</td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEdit(article.id)}>Ubah</button>
                    <button className="delete-btn" onClick={() => handleDelete(article.id)}>Hapus</button>
                    {article.slider ? (
                      <button className="unheadline-btn" onClick={() => handleUnsetHeadline(article.id)}>
                        Un-Set as Headline
                      </button>
                    ) : (
                      <button className="headline-btn" onClick={() => handleSetHeadline(article.id)}>
                        Set as Headline
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => paginate(currentPage - 1)} className="page-link">Previous</button>
            )}
            {totalPages > 5 && currentPage > 3 && (
              <>
                <button onClick={() => paginate(1)} className={`page-link ${currentPage === 1 ? 'active' : ''}`}>1</button>
                <span>...</span>
              </>
            )}
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`page-link ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            {currentPage < totalPages && (
              <button onClick={() => paginate(currentPage + 1)} className="page-link">Next</button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
