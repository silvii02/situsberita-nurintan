import React, { useState, useEffect } from "react";
import SidebarDashboard from '../components/SidebarDashboard';
import Swal from 'sweetalert2';
import configUrl from "../configUrl";

const DaftarIklan = () => {
    const [ads, setAds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const adsPerPage = 5;

    // State untuk modal edit
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAd, setEditAd] = useState(null);

    useEffect(() => {
        fetchAds();
    }, []);

    useEffect(() => {
        const closeModal = (e) => {
            if (e.target.className === 'edit-iklan') {
                setShowEditModal(false);
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setShowEditModal(false);
            }
        };

        document.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('click', closeModal);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);


    const fetchAds = async () => {
        try {
            const res = await fetch(`${configUrl.beBaseUrl}/api/ads`);
            const data = await res.json();
            console.log("Fetched ads:", data); // Tambahkan log ini
            setAds(data);
        } catch (err) {
            console.error("Error fetching ads:", err);
        }
    };
    
    const handleDelete = async (id) => {
        Swal.fire({
            text: "Apakah anda yakin akan menghapus iklan ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1F316F",
            cancelButtonColor: "#F5C647",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batalkan",
            reverseButtons: true,
            customClass: {
                cancelButton: 'swal-cancel-button321',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`${configUrl.beBaseUrl}/api/ads/${id}`, {
                        method: "DELETE",
                    });
                    fetchAds();
                    Swal.fire("Terhapus!", "Iklan berhasil dihapus.", "success");
                } catch (err) {
                    Swal.fire("Error!", "Terjadi kesalahan saat menghapus iklan.", "error");
                }
            }
        });
    };

    const handleEditClick = (ad) => {
        setEditAd(ad);
        setShowEditModal(true);
    };

    const renderImagePreview = () => {
        if (editAd.newImage) {
            return <img src={URL.createObjectURL(editAd.newImage)} alt="Preview" className="image-preview" />;
        } else if (editAd.image) {
            return <img src={`${configUrl.beBaseUrl}/storage/${editAd.image}`} alt="Current" className="image-preview" />;
        }
        return null;
    };

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setEditAd({ ...editAd, newImage: files[0] });
        } else {
            setEditAd({ ...editAd, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("advertiser_name", editAd.advertiser_name);
        formData.append("link", editAd.link);
        formData.append("position", editAd.position);
        formData.append("start_date", editAd.start_date);
        formData.append("end_date", editAd.end_date);
        if (editAd.newImage) {
            formData.append("image", editAd.newImage);
        }

        try {
            await fetch(`${configUrl.beBaseUrl}/api/ads/${editAd.id}?_method=PUT, {
                method: "POST",
                body: formData,
            }`);
            Swal.fire("Berhasil", "Iklan berhasil diperbarui", "success");
            setShowEditModal(false);
            fetchAds();
        } catch (err) {
            Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui iklan", "error");
        }
    };

    // Pagination logic
    const indexOfLastAd = currentPage * adsPerPage;
    const indexOfFirstAd = indexOfLastAd - adsPerPage;
    const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="admin-ads-list-container">
            <SidebarDashboard />
            <h3>Daftar Iklan yang ada</h3>
            <ul className="admin-ads-list">
                {ads.length > 0 ? (
                    currentAds.map((ad) => (
                        <li key={ad.id} className="admin-ads-list-item">
                            <strong>{ad.advertiser_name}</strong> ({ad.position}) -{" "}
                            <a href={ad.link} target="_blank" rel="noopener noreferrer">Lihat Iklan</a>
                            <br />
                            <img
                                src={`${configUrl.beBaseUrl}/storage/${ad.image}`}
                                alt={ad.advertiser_name}
                                className="admin-ads-image"
                            />
                            <br />
                            <div className="admin-ads-actions">
                                <button onClick={() => handleEditClick(ad)} className="admin-ads-edit-button">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(ad.id)} className="admin-ads-delete-button">
                                    Hapus
                                </button>
                            </div>

                        </li>
                    ))
                ) : (
                    <p>Tidak ada iklan yang tersedia</p>
                )}
            </ul>
            <Pagination
                itemsPerPage={adsPerPage}
                totalItems={ads.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            {/* Modal Edit */}
            {showEditModal && (
                <div className="edit-iklan">
                    <div className="edit-iklan123">
                        <h3>Edit Iklan</h3>
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                name="advertiser_name"
                                value={editAd.advertiser_name}
                                onChange={handleEditChange}
                                placeholder="Nama Pengiklan"
                                required
                            />
                            <input
                                type="text"
                                name="link"
                                value={editAd.link}
                                onChange={handleEditChange}
                                placeholder="Link Iklan"
                                required
                            />
                            <select name="position" value={editAd.position} onChange={handleEditChange}>
                                <option value="header">Header</option>
                                <option value="footer">Footer</option>
                            </select>
                            <input
                                type="date"
                                name="start_date"
                                value={editAd.start_date}
                                onChange={handleEditChange}
                            />
                            <input
                                type="date"
                                name="end_date"
                                value={editAd.end_date}
                                onChange={handleEditChange}
                            />
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleEditChange}
                            />
                             <div className="image12-preview-container">
                                {renderImagePreview()}
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowEditModal(false)}>Batal</button>
                                <button type="submit">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
                    <button onClick={() => paginate(currentPage - 1)} className="page-link">Previous</button>
                )}
                {totalPages > 5 && currentPage > 3 && (
                    <>
                        <button onClick={() => paginate(1)} className="page-link">1</button>
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
                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                        <span>...</span>
                        <button onClick={() => paginate(totalPages)} className="page-link">{totalPages}</button>
                    </>
                )}
                {currentPage < totalPages && (
                    <button onClick={() => paginate(currentPage + 1)} className="page-link">Next</button>
                )}
            </div>
        </nav>
    );
};

export default DaftarIklan;