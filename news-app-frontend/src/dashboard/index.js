import React, { useState, useEffect } from 'react';
import ChartArticlesPopular from '../components/ChartArticlesPopular';
import SidebarDashboard from '../components/SidebarDashboard'; 
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import CreateAdmin from './CreateAdmin';

const IndexDashboard = () => {
    const [articles, setArticles] = useState([]);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            } else {
                try {
                    const response = await axiosInstance.get('/articles', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setArticles(response.data);
                } catch (error) {
                    console.error('Error fetching articles:', error.response?.data || error.message);
                }
            }
        };
        fetchArticles();
    }, [navigate]);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                console.log("Fetching user data...");
                const response = await axiosInstance.get(`/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User data fetched:", response.data);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error.response?.data || error.message);
                navigate("/indexdashboard");
            }
        };
        fetchUserRole();
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <SidebarDashboard /> 
            <div className="dashboard-content"> {/* Wrapper untuk konten dashboard */}
                <ChartArticlesPopular />
                {/* Tambahkan Form CreateAdmin */}
                <div style={{ marginTop: '20px' }}>
                    <h2>Buat Admin Baru</h2>
                    <CreateAdmin user={userData} />
                </div>
            </div>
        </div>
    );
};

export default IndexDashboard;
