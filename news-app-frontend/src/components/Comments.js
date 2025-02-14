import React, { useEffect, useState } from "react";
import axios from "axios";

const Comments = ({ articleId }) => {
    const [comments, setComments] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", body: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/comments/${articleId}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleEdit = (comment) => {
        setEditingId(comment.id);
        setFormData({ name: comment.name, email: comment.email, body: comment.body });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
            try {
                await axios.delete(`http://localhost:8000/api/comments/${id}`);
                fetchComments();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:8000/api/comments/${editingId}`, formData);
            } else {
                await axios.post("http://localhost:8000/api/comments", { ...formData, article_id: articleId });
            }
            setEditingId(null);
            setFormData({ name: "", email: "", body: "" });
            fetchComments();
        } catch (error) {
            console.error("Error saving comment:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Komentar</h2>

            {/* Form Tambah / Edit Komentar */}
            <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
                <input
                    type="text"
                    placeholder="Nama"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                />
                <textarea
                    placeholder="Komentar"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    required
                ></textarea>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    {editingId ? "Update Komentar" : "Tambah Komentar"}
                </button>
            </form>

            {/* List Komentar */}
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id} className="p-4 border-b flex justify-between items-center">
                            <div>
                                <p className="font-bold">{comment.name}</p>
                                <p className="text-gray-500 text-sm">{comment.email}</p>
                                <p>{comment.body}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(comment)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                                <button onClick={() => handleDelete(comment.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Tidak ada komentar.</p>
            )}
        </div>
    );
};

export default Comments;
