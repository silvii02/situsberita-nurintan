import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import ikon panah
import axios from 'axios';
import configUrl from '../../configUrl';

const Passwordreset = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError("Password baru tidak cocok!");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`${configUrl.beBaseUrl}/api/reset-password`, {
                email,
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess(response.data.message);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Unauthorized: Token tidak valid atau telah kedaluwarsa.");
            } else if (err.response && err.response.data.errors) {
                setError(err.response.data.errors);
            } else {
                setError(err.response.data.message || "Terjadi kesalahan!");
            }
        }
    };

    return (
        <div className='passwordreset'>
            {/* Tambahkan link untuk kembali */}
            <Link to="/" className="back-linkk">
                <FaArrowLeft /> Kembali
            </Link>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password Lama</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password Baru</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Konfirmasi Password Baru</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default Passwordreset;
