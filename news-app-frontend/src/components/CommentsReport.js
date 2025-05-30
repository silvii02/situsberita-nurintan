import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCircleXmark, faEdit, faTrashAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import configUrl from '../configUrl';
import { useNavigate } from 'react-router-dom';

const CommentsReport = () => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [editComment, setEditComment] = useState(null);
    const [formData, setFormData] = useState({ name: '', body: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;
    

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${configUrl.beBaseUrl}/api/commentsreport`);
            // Pastikan komentar terbaru berada di atas dengan mengurutkan berdasarkan id secara descending
            const sortedComments = response.data.sort((a, b) => b.id - a.id);
            setComments(sortedComments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    

    const handleDelete = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-danger", 
                cancelButton: "btn btn-secondary" 
            },
            buttonsStyling: false
        });
    
        swalWithBootstrapButtons.fire({
            title: "Apakah Anda yakin ingin menghapus komentar ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "<span style='color: white;'>Ya, hapus ini!</span>", 
            cancelButtonText: "<span style='color: white;'>Tidak, batalkan!</span>", 
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${configUrl.beBaseUrl}/api/commentsreport/${id}`);
                    setComments(comments.filter(comment => comment.id !== id));
                    swalWithBootstrapButtons.fire({
                        title: "Dihapus!",
                        text: "Komentar Anda telah dihapus.",
                        icon: "success"
                        
                    });
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    swalWithBootstrapButtons.fire({
                        title: "Error",
                        text: "Terjadi kesalahan saat menghapus komentar.",
                        icon: "error"
                    });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Dibatalkan",
                    text: "Komentar Anda aman :)",
                    icon: "error"
                });
            }
        });
    };
    

    const handleEdit = (comment) => {
        setEditComment(comment);
        setFormData({ name: comment.name, body: comment.body });
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`${configUrl.beBaseUrl}/api/commentsreport/${id}`, formData);
            
            setComments(comments.map(comment => 
                comment.id === id ? response.data.comment : comment
            ));
            
            setEditComment(null);
    
            Swal.fire({
                title: "Berhasil Disimpan!",
                icon: "success",
                draggable: true
            });
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    

    return (
        <div>
        <button className="btn-back-dashboard" onClick={() => navigate('/indexdashboard')}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "8px" }} /> Kembali ke Halaman Dashboard
    </button>
            <div className="comments-container">
                
                <h2 className="comments-title">Daftar Komentar</h2>
                <table className="comments-report-table">
                    <thead>
                        <tr>
                            <th className="table-header">No</th>
                            <th className="table-header">Nama</th>
                            
                            <th className="table-header">Komentar</th>
                            <th className="table-header">Artikel</th>
                            <th className="table-header">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentComments.map((comment, index) => (
    <tr key={comment.id} className="table-row-CommentReport">
        <td className="table-cell">{indexOfFirstComment + index + 1}</td>

                                <td className="table-cell">{comment.name}</td>
                                
                                <td className="table-cell">{comment.body}</td>
                                <td className="table-cell">{comment.article?.title || 'Artikel tidak ditemukan'}</td>
                                <td className="table-actions">
                                <button className="btn-edit-commentreport" onClick={() => handleEdit(comment)}>
                            Ubah
                        </button>
                        <button className="btn-delete-commentreport" onClick={() => handleDelete(comment.id)}>
                            Hapus
                        </button>

            </td>


                </tr>
            ))}
        </tbody>
    </table>

    <Pagination
        itemsPerPage={commentsPerPage}
        totalItems={comments.length}
        paginate={paginate}
        currentPage={currentPage}
    />

    {editComment && (
    <div className="edit-comment-overlay" onClick={() => setEditComment(null)}>
        <div className="edit-comment-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="edit-title-commentreport">
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: "8px" }} /> Edit Komentar
        </h3>
        <form className="edit-form-commentreport" onSubmit={(e) => { e.preventDefault(); handleUpdate(editComment.id); }}>
    <div className="form-group">
        <label className="form-label">Nama:</label>
        <input 
            className="form-input" 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
        />
    </div>



    <div className="form-group">
        <label className="form-label">Komentar:</label>
        <textarea 
            className="form-textarea" 
            value={formData.body} 
            onChange={(e) => setFormData({ ...formData, body: e.target.value })} 
            required
        ></textarea>
    </div>

    <div className="comment-report-actions">
        <button className="btn-cancel-comment-report" type="button" onClick={() => setEditComment(null)}>
            <FontAwesomeIcon icon={faCircleXmark} style={{ marginRight: "5px" }} /> Batal
        </button>
        <button className="btn-save-comment-report" type="submit">
            <FontAwesomeIcon icon={faSave} style={{ marginRight: "5px" }} /> Simpan
        </button>
    </div>
</form>

        </div>
    </div>
)}

</div>
</div>

    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
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

    return (
        <nav>
            <div className="pagination">
                {currentPage > 1 && (
                    <button onClick={() => paginate(currentPage - 1)} className="page-link">
                        Previous
                    </button>
                )}
                {totalPages > 5 && currentPage > 3 && (
                    <>
                        <button onClick={() => paginate(1)} className="page-link">1</button>
                        <span>...</span>
                    </>
                )}
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => paginate(number)} className={`page-link ${currentPage === number ? 'active' : ''}`}>
                        {number}
                    </button>
                ))}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                        <span>...</span>
                        <button onClick={() => paginate(totalPages)} className="page-link">{totalPages}</button>
                    </>
                )}
                {currentPage < totalPages && (
                    <button onClick={() => paginate(currentPage + 1)} className="page-link">
                        Next
                    </button>
                )}
            </div>
        </nav>
    );
};

export default CommentsReport;