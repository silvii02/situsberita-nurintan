import React, { useState, useEffect } from "react";
import SidebarDashboard from '../components/SidebarDashboard';

const DaftarIklan = () => {
    const [ads, setAds] = useState([]);

    // Fetch data iklan dari API
    useEffect(() => {
        fetch("http://localhost:8000/api/ads")
            .then((res) => res.json())
            .then((data) => setAds(data))
            .catch((err) => console.error("Error fetching ads:", err));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus iklan ini?")) {
            await fetch(`http://localhost:8000/api/ads/${id}`, {
                method: "DELETE",
            });
            alert("Iklan berhasil dihapus");
            setAds(ads.filter((ad) => ad.id !== id));
        }
    };

    return (
        <div className="admin-ads-list-container">
            <SidebarDashboard />
            <h3>Daftar Iklan yang ada</h3>
            <ul className="admin-ads-list">
                {ads.length > 0 ? (
                    ads.map((ad) => (
                        <li key={ad.id} className="admin-ads-list-item">
                            <strong>{ad.advertiser_name}</strong> ({ad.position}) -{" "}
                            <a href={ad.link} target="_blank" rel="noopener noreferrer">
                                Lihat Iklan
                            </a>
                            <br />
                            <img
                                src={`http://localhost:8000/storage/${ad.image}`}
                                alt={ad.advertiser_name}
                                className="admin-ads-image"
                            />
                            <br />
                            <button onClick={() => handleDelete(ad.id)} className="admin-ads-delete-button">
                                Hapus
                            </button>
                        </li>
                    ))
                ) : (
                    <p>Tidak ada iklan yang tersedia</p>
                )}
            </ul>
        </div>
    );
};

export default DaftarIklan;
