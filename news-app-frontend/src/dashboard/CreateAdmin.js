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
    const [tanggalLahir, setTanggalLahir] = useState(""); // ⬅️ baru
    const [alamat, setAlamat] = useState("");             // ⬅️ baru
    const [noTelepon, setNoTelepon] = useState("");        // ⬅️ baru
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/indexdashboard");
                return;
            }

            try {
                const response = await axios.get(`${configUrl.beBaseUrl}/api/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error.response?.data || error.message);
                navigate("/indexdashboard");
            }
        };
        fetchUserRole();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`${configUrl.beBaseUrl}/api/create-admin`, 
            {
                name,
                email,
                password,
                tanggal_lahir: tanggalLahir,
                alamat,
                nomor_telepon: noTelepon,
            }, 
            { headers: { Authorization: `Bearer ${token}` } });

            Swal.fire({
                title: "Admin berhasil ditambahkan!",
                icon: "success",
                draggable: true,
            }).then(() => {
                navigate("/indexdashboard");
            });

            setName("");
            setEmail("");
            setPassword("");
            setTanggalLahir("");
            setAlamat("");
            setNoTelepon("");
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
                    <input type="date" placeholder="Tanggal Lahir" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} required />
                    <input type="text" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
                    <input type="text" placeholder="No Telepon" value={noTelepon} onChange={(e) => setNoTelepon(e.target.value)} required />
                    <button type="submit">Tambah Admin</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAdmin;
