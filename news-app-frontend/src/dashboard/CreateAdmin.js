import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import configUrl from "../configUrl";

const CreateAdmin = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/indexdashboard"); // Redirect kalau tidak ada token
                return;
            }

            try {
                console.log("Fetching user data...");
                const response = await axios.get(`${configUrl.beBaseUrl}/api/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User data fetched:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error.response?.data || error.message);
                navigate("/indexdashboard"); // Redirect kalau gagal fetch user
            }
        };
        fetchUserRole();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            console.log("Mengirim request dengan token:", token);

            const response = await axios.post(`${configUrl.beBaseUrl}/api/create-admin`, 
            { name, email, password }, 
            { headers: { Authorization: `Bearer ${token}` } });

            Swal.fire({
                title: "Admin berhasil ditambahkan!",
                icon: "success",
                draggable: true,
            }).then(() => {
                navigate("/indexdashboard"); // Redirect setelah klik "OK"
            });

            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Error response:", error.response?.data);
            setMessage(error.response?.data?.message || "Gagal menambahkan admin.");
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
        return <p>Anda tidak memiliki izin untuk menambahkan admin.</p>;
    }

    return (
        <div>
        <button className="back-button" onClick={() => navigate("/indexdashboard")}>
                Kembali
            </button>
        <div className="create-admin">
            <h2>Buat Admin Baru</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Tambah Admin</button>
            </form>
        </div>
        </div>
    );
};

export default CreateAdmin;
