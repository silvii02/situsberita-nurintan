import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../utils/axios';
import configUrl from '../configUrl';
import SidebarDashboard from '../components/SidebarDashboard';
import Swal from 'sweetalert2';

const Categories = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 9;

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error.response?.data || error.message);
            }
        };
        fetchCategories();
    }, [navigate]);

    const handleDelete = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn-hapus1-confirm",
                cancelButton: "btn-hapus2-cancel"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan dapat mengembalikan kategori ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Tidak, batalkan!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axiosInstance.delete(`/categories/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });

                    setCategories(categories.filter(category => category.id !== id));

                    swalWithBootstrapButtons.fire(
                        "Terhapus!",
                        "Kategori telah dihapus",
                        "success"
                    );
                } catch (error) {
                    console.error('Error deleting category:', error.response?.data || error.message);
                    swalWithBootstrapButtons.fire(
                        "Error!",
                        "Gagal menghapus kategori.",
                        "error"
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire(
                    "Dibatalkan",
                    "Kategori Anda aman :)",
                    "error"
                );
            }
        });
    };

    const addCategory = async () => {
        const { value: categoryName } = await Swal.fire({
            title: 'Tambah Kategori Baru',
            input: 'text',
            inputPlaceholder: 'Masukkan nama kategori',
            showCancelButton: true,
            confirmButtonText: 'Tambahkan',
            cancelButtonText: 'Batalkan',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn-category-confirm',
                cancelButton: 'btn-category-cancel'
            },
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'Nama kategori tidak boleh kosong';
                }
            }
        });

        if (categoryName) {
            try {
                const response = await axios.post(`${configUrl.beBaseUrl}/api/createcategory`, { name: categoryName });
                setCategories([...categories, response.data]);
                Swal.fire('Berhasil!', 'Kategori berhasil ditambahkan.', 'success');
            } catch (error) {
                console.error('There was an error adding the new category!', error);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menambahkan kategori.', 'error');
            }
        }
    };

    const handleEditCategoryChange = (event) => {
        setEditCategoryName(event.target.value);
    };

    const startEditCategory = (category) => {
        Swal.fire({
            title: 'Ubah Kategori',
            input: 'text',
            inputValue: category.name,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batalkan',
            preConfirm: (newName) => {
                if (!newName.trim()) {
                    Swal.showValidationMessage('Category name cannot be empty');
                }
                return newName;
            },
            customClass: {
                confirmButton: 'swal-simpan-btn',
                cancelButton: 'swal-batal-btn'
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value.trim()) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axiosInstance.put(`/categories/${category.id}`,
                        { name: result.value },
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                        }
                    );
                    setCategories(categories.map(cat => (cat.id === category.id ? response.data : cat)));
                    Swal.fire('Diperbarui!', 'Kategori telah diperbarui', 'success');
                } catch (error) {
                    console.error('Error updating category:', error.response?.data || error.message);
                    Swal.fire('Error!', 'Failed to update category.', 'error');
                }
            }
        });
    };

    const updateCategory = async (e) => {
        e.preventDefault();
        if (editCategoryName.trim()) {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.put(`/categories/${editCategoryId}`,
                    { name: editCategoryName },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                setCategories(categories.map(category => (category.id === editCategoryId ? response.data : category)));
                setEditCategoryId(null);
                setEditCategoryName('');
            } catch (error) {
                console.error('Error updating category:', error.response?.data || error.message);
                if (error.response?.status === 401) {
                    Swal.fire({
                        title: 'Unauthorized',
                        text: 'Your session has expired. Please log in again.',
                        icon: 'error',
                    });
                }
            }
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard-container">
            <SidebarDashboard />

            <div className="dashboard-content">
                <div className="categoryy-container">
                    <button className="button-create" onClick={addCategory}>Tambah Kategori</button>
                </div>

                {editCategoryId && (
                    <div className="categoryy-container">
                        <label className='editCategory'>Ubah Kategori</label>
                        <input
                            type="text"
                            value={editCategoryName}
                            onChange={handleEditCategoryChange}
                            placeholder="Edit category"
                        />
                        <button className='button-update' onClick={updateCategory}>Perbarui Kategori</button>
                    </div>
                )}

                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map((category, index) => (
                            <tr key={category.id}>
                                <td>{indexOfFirstCategory + index + 1}</td>
                                <td>{category.name}</td>
                                <td>
                                    <button className="categories-btn-edit" onClick={() => startEditCategory(category)}>Ubah</button>
                                    <button className="categories-btn-delete" onClick={() => handleDelete(category.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    articlesPerPage={categoriesPerPage}
                    totalArticles={categories.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

const Pagination = ({ articlesPerPage, totalArticles, paginate, currentPage }) => {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
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
                {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                        <span>...</span>
                        <button
                            onClick={() => paginate(totalPages)}
                            className={`page-link ${currentPage === totalPages ? 'active' : ''}`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                {currentPage < totalPages && (
                    <button onClick={() => paginate(currentPage + 1)} className="page-link">Next</button>
                )}
            </div>
        </nav>
    );
};

export default Categories;
