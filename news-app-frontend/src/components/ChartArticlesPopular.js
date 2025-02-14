import React, { useState, useEffect } from 'react';
import { FaFolder, FaPen, FaUsers, FaChartBar } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import configUrl from '../configUrl';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Ambil data kategori dari API
  useEffect(() => {
    const fetchCategoriesCount = async () => {
      try {
        const response = await axios.get(`${configUrl.beBaseUrl}/api/categories`);
        setCategoriesCount(response.data.length);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    };

    fetchCategoriesCount();
  }, []);

  // Ambil data artikel untuk chart dan Manage Article
  useEffect(() => {
    const fetchArticlesCount = async () => {
      try {
        const response = await axios.get(`${configUrl.beBaseUrl}/api/articles`);
        setArticlesCount(response.data.length);
        
        // Urutkan artikel berdasarkan views, dan ambil 10 artikel dengan views terbanyak
        const sortedArticles = response.data.sort((a, b) => b.views - a.views).slice(0, 10);
        setArticles(sortedArticles); // Hanya menyimpan 10 artikel teratas untuk chart
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticlesCount();
  }, []);

  // Data untuk dashboard cards
  const dataCards = [
    { 
      icon: <FaFolder />, 
      title: 'Category', 
      count: categoriesCount, 
      color: '#f9f9f9', 
      className: 'categories-carddd', 
      onClick: () => navigate('/kategori') // Navigasi ke halaman kategori
    },
    { 
      icon: <FontAwesomeIcon icon={faEdit} />, 
      title: 'Manage Article', 
      count: articlesCount, 
      color: '#f9f9f9', 
      className: 'manage-article-carddd', 
      onClick: () => navigate('/dashboard') // Navigasi ke halaman manage artikel
    },
    { 
      icon: <FaUsers />, 
      title: 'Users', 
      count: 1, 
      color: '#f9f9f9', 
      className: 'users-carddd' 
    },
  ];

  // Mengambil judul dan views dari 10 artikel teratas untuk chart
  const labels = articles.map(article => {
    return article.title.length > 16 ? article.title.slice(0, 16) + '...' : article.title;
  });
  const data = articles.map(article => article.views);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Views',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      {/* Kartu Dashboard */}
      <div className="dashboard-cards-container1">
        {dataCards.map((item, index) => (
          <div className={`dashboard-card1 ${item.className}`}
          key={index} 
          style={{ backgroundColor: item.color }}
          onClick={item.onClick}
          >
            <div className="icon-container1">
              {item.icon}
            </div>
            <div className="card-content1">
              <h3>{item.title}</h3>
              <p>{item.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Artikel Populer */}
      <div className="chart-container">
        <h2 className="chart-title">
          <FaChartBar style={{ marginRight: '5px' }} />
          Statistic View Posts
        </h2>
        {loading ? <div className="cssload-dots"><i className="cssload-dot-1"></i><i className="cssload-dot-2"></i><i className="cssload-dot-3"></i><i className="cssload-dot-4"></i><i className="cssload-dot-5"></i><i className="cssload-dot-6"></i>
          </div> : error ? <p>Error: {error}</p> : <Bar data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
};

export default Dashboard;
