import React, { useState, useEffect } from "react";
import SidebarDashboard from '../components/SidebarDashboard';
import Swal from 'sweetalert2';
import configUrl from "../configUrl";

const AdminAds = () => {
    const [ads, setAds] = useState([]);
    const [advertiserName, setAdvertiserName] = useState("");
    const [adMessage, setAdMessage] = useState("");
    const [image, setImage] = useState(null);
    const [link, setLink] = useState("");
    const [position, setPosition] = useState("sidebar");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetch(`${configUrl.beBaseUrl}/api/ads`)
            .then((res) => res.json())
            .then((data) => setAds(data))
            .catch((err) => console.error("Error fetching ads:", err));
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("advertiser_name", advertiserName);
        formData.append("ad_message", adMessage);
        formData.append("image", image);
        formData.append("link", link);
        formData.append("position", position);
        formData.append("start_date", startDate);
        formData.append("end_date", endDate);

        try {
            const response = await fetch(`${configUrl.beBaseUrl}/api/ads`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const newAd = await response.json(); // pastikan backend mengembalikan data iklan baru

                // Tambahkan iklan baru ke dalam list tanpa reload
                setAds((prevAds) => [...prevAds, newAd]);

                Swal.fire({
                    title: "Iklan berhasil ditambahkan!",
                    icon: "success",
                    confirmButtonColor: "#1F316F",
                    draggable: true
                });

                // Reset form input
                setAdvertiserName("");
                setAdMessage("");
                setImage(null);
                setLink("");
                setPosition("sidebar");
                setStartDate("");
                setEndDate("");
            } else {
                Swal.fire({
                    title: "Gagal menambahkan iklan",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error saat menambahkan iklan:", error);
            Swal.fire({
                title: "Terjadi kesalahan",
                text: "Silakan coba lagi nanti.",
                icon: "error"
            });
        }
    };

    return (
        <div className="admin-ads-container">
            <SidebarDashboard />
            <div className="admin-ads-form-container">
                <h2>Kelola Iklan</h2>
                <p>Tambahkan iklan baru dengan mengisi formulir di bawah ini.</p>
                <form onSubmit={handleSubmit} className="admin-ads-form">
                    <label>Nama Pengiklan</label>
                    <input type="text" value={advertiserName} onChange={(e) => setAdvertiserName(e.target.value)} required />

                    <label>Pesan Iklan</label>
                    <textarea
                        value={adMessage}
                        onChange={(e) => setAdMessage(e.target.value)}
                        required
                        placeholder="Contoh: Diskon hingga 20%! Pesan sekarang sebelum kehabisan!"
                    />

                    <label>Gambar Iklan</label>
                    <input type="file" onChange={handleImageChange} required />

                    <label>Link Iklan</label>
                    <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required />

                    <label>Posisi Iklan</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value)}>
                        <option value="header">Header</option>
                        <option value="footer">Footer</option>
                        <option value="sidebar">Sidebar</option>
                    </select>

                    <div className="admin-ads-date-container">
                        <div>
                            <label>Tanggal Mulai</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <label>Tanggal Berakhir</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className="admin-ads-button">Tambah Iklan</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAds;
