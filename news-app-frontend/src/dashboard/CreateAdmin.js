import { useState, useEffect } from "react";
import axios from "axios";
import configUrl from "../configUrl";

const CreateAdmin = ({ user }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Jika user belum terdefinisi, jangan lanjut
        if (!user) return;
        console.log("User data:", user);  // Debug user data
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem("token"); // Ambil token dari localStorage
            console.log("token:", token);  // Debug token
            
            const response = await axios.post(`${configUrl.beBaseUrl}/api/create-admin`, {
                name,
                email,
                password
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
    
            console.log("Respons dari API:", response.data);  // Debug API response
    
            // Simpan token atau informasi admin jika diperlukan
            localStorage.setItem('userid', response.data.admin.id);            
            sessionStorage.setItem('token', response.data.token);
    
            setMessage("Admin berhasil ditambahkan!");
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error('Gagal menambahkan admin:', error.response?.data?.message || error.message);
            setMessage(error.response?.data?.message || "Terjadi kesalahan saat menambahkan admin");
        }
    };

    if (!user) {
        console.log("Menunggu data user...");
        return <p>Loading...</p>;
    }
    
    if (user.role !== "admin" && user.role !== "superadmin") {
        console.log("User role bukan admin atau superadmin, akses ditolak");
        return <p>Anda tidak memiliki izin untuk menambahkan admin.</p>;
    }       

    return (
        <div className="create-adminn">
            <h2>Buat Admin Baru</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Tambah Admin</button>
            </form>
        </div>
    );
};

export default CreateAdmin;
