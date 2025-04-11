import React, { useState, useEffect } from "react";

const AdsDisplay = ({ position }) => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/ads")
            .then((res) => res.json())
            .then((data) => {
                const filteredAds = data.filter(ad => ad.position === position);
                setAds(filteredAds);
            })
            .catch((err) => console.error("Error fetching ads:", err));
    }, [position]);

    const handleCloseAd = (id) => {
        setAds((prevAds) => prevAds.filter(ad => ad.id !== id));
    };

    return (
        <div className="ads-display-container">
            {ads.map((ad) => (
                <div key={ad.id} className="ads-display-card">
                    <div className="ads-display-icons">
  <button
    className="ads-icon-info"
    title="Info Detail"
    onClick={() => window.open(ad.link, "_blank")}
  >
    ℹ️
  </button>
  <button
    className="ads-icon-close"
    title="Tutup Iklan"
    onClick={() => handleCloseAd(ad.id)}
  >
    ✕
  </button>
</div>

                    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="ads-display-link">
                        <div className="ads-display-image-container">
                            <img src={`http://localhost:8000/storage/${ad.image}`} alt={ad.advertiser_name} className="ads-display-image" />
                        </div>
                        <div className="ads-display-text-container">
                            <h3 className="ads-display-title">{ad.advertiser_name}</h3>
                            <p className="ads-display-message">{ad.ad_message}</p>
                            <button className="ads-display-button">Klik Disini</button>
                        </div>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default AdsDisplay;
