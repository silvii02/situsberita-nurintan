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
    const categoriesPerPage = 7; 
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
    const [newCategory, setNewCategory] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null); // ID kategori yang sedang diedit
    const [editCategoryName, setEditCategoryName] = useState(''); // Nama kategori yang sedang diedit

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
                    const token = localStorage.getItem('token'); // Ambil token dari local storage
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
            reverseButtons: true, // Menukar posisi tombol
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
    //   const handleNewCategoryChange = (event) => {
    //     setNewCategory(event.target.value);
    //   };

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
                const token = localStorage.getItem('token'); // Ambil token dari local storage
                const response = await axiosInstance.put(`/categories/${editCategoryId}`, 
                    { name: editCategoryName },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Sertakan token di header
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

                {editCategoryId && ( // Form untuk edit kategori
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
                                    <button className="categories-btn-edit" onClick={() => startEditCategory(category)}>
                                        Ubah
                                    </button>
                                    <button className="categories-btn-delete" onClick={() => handleDelete(category.id)}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination 
                    categoriesPerPage={categoriesPerPage} 
                    totalCategories={categories.length} 
                    paginate={paginate} 
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};

// Komponen Pagination
const Pagination = ({ categoriesPerPage, totalCategories, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalCategories / categoriesPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <nav>
            <div className="pagination">
                {pageNumbers.map(number => (
                    <span key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </span>
                ))}
            </div>
        </nav>
    );
};

export default Categories;
