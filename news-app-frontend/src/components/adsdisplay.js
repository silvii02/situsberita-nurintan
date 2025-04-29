import React, { useState, useEffect } from "react";
import configUrl from '../configUrl';
import { AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";

const AdsDisplay = ({ position }) => {
    const [ads, setAds] = useState([]);
    const [closedAds, setClosedAds] = useState([]);

    // Ambil dari localStorage saat awal load
    useEffect(() => {
        const storedClosedAds = localStorage.getItem("closedAds");
        if (storedClosedAds) {
            setClosedAds(JSON.parse(storedClosedAds));
        }
    }, []);

    useEffect(() => {
        fetch(`${configUrl.beBaseUrl}/api/ads`)
            .then((res) => res.json())
            .then((data) => {
                const filteredAds = data.filter(
                    ad => ad.position === position && ad.status === 'active'
                );
                setAds(filteredAds);
            })
            .catch((err) => console.error("Error fetching ads:", err));
    }, [position]);

    const handleCloseAd = (id) => {
        const updatedClosedAds = [...closedAds, id];
        setClosedAds(updatedClosedAds);
        localStorage.setItem("closedAds", JSON.stringify(updatedClosedAds)); // simpan ke localStorage
    };

    const handleInfoClick = (link) => {
        window.open(link, "_blank");
    };

    return (
        <div className="ads-wrapper">
            {ads
                .filter(ad => !closedAds.includes(ad.id)) // Sembunyikan yang sudah ditutup
                .map((ad) => (
                    <div key={ad.id} className="ads-card">
                        <div className="ads-icon-buttons">
                            <button
                                className="ads-info-button"
                                title="Info Detail"
                                onClick={() => handleInfoClick(ad.link)}
                            >
                                <AiOutlineInfoCircle size={24} />
                            </button>
                            <button
                                className="ads-close-button"
                                title="Tutup Iklan"
                                onClick={() => handleCloseAd(ad.id)}
                            >
                                <AiOutlineCloseCircle size={24} />
                            </button>
                        </div>

                        <div className="ads-content">
                            <div className="ads-image">
                                <img
                                    src={`${configUrl.beBaseUrl}/storage/${ad.image}`}
                                    alt={ad.advertiser_name}
                                />
                            </div>

                            <div className="ads-text">
                                <h3 className="ads-title">{ad.advertiser_name}</h3>
                                <p className="ads-description">{ad.ad_message}</p>
                                <a
                                    href={ad.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ads-button"
                                >
                                    Klik Disini
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default AdsDisplay;
