import React, { useEffect, useState } from 'react';
import configUrl from '../configUrl';
import '../assets/css/style.css';

const GoogleTrend = () => {
    const [rssItems, setRssItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = `${configUrl.beBaseUrl}/api/trends`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tidak dapat mengambil data RSS');
                }
                return response.text();
            })
            .then(data => {
                const trimmedData = data.trim();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(trimmedData, "application/xml");

                if (xmlDoc.querySelector("parsererror")) {
                    throw new Error("Gagal memparsing XML");
                }

                const items = xmlDoc.querySelectorAll("item");
                const rssData = Array.from(items).flatMap(item => {
                    const newsItems = item.querySelectorAll("ht\\:news_item, news_item");
                    return Array.from(newsItems).map(news => ({
                        title: news.querySelector("ht\\:news_item_title, news_item_title")?.textContent.trim() || 'No Title',
                        url: news.querySelector("ht\\:news_item_url, news_item_url")?.textContent.trim() || '#',
                        picture: news.querySelector("ht\\:news_item_picture, news_item_picture")?.textContent.trim() || '',
                        source: news.querySelector("ht\\:news_item_source, news_item_source")?.textContent.trim() || 'Unknown Source',
                        snippet: news.querySelector("ht\\:news_item_snippet, news_item_snippet")?.textContent.trim() || '',
                        pubDate: item.querySelector("pubDate")?.textContent.trim() || '',
                    }));
                });
                const limitedRssData = rssData.slice(0, 16);
                setRssItems(limitedRssData);
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    return (
    <div>
        <h1 className="google-trend-h1">
        Rekomendasi
        <span className="extra-decor decor-11"></span>
        <span className="extra-decor decor-21"></span>
    </h1>
        <div className='wrapper-rss-feed'>
            {error ? (
                <p>{error}</p>
            ) : (
                <div id="rss-feed">
                    {rssItems.length > 0 ? (
                        rssItems.map((item, index) => (
                            <div key={index}>

                                <p style={{fontSize: "12px", textAlign: "left"}}>{item.pubDate}</p>

                                <div className="title-gtrend"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></div>
                               
                                <div style={{height: "168px", overflow: "hidden"}}>
                                {item.picture && <img src={item.picture} alt={item.title} />}
                                </div>

                                <p>{item.snippet}</p>
                                <p>{item.source}</p>
                                
                            </div>
                        ))
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            )}
        </div>
        </div>
    );
}

export default GoogleTrend;
