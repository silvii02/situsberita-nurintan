import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import configUrl from '../../configUrl';
import GoogleLoginButton from '../GoogleLoginButton';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State untuk "Tetap masuk"
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${configUrl.beBaseUrl}/api/login`, {
        email,
        password,
        rememberMe, // Kirim informasi "Tetap masuk" ke backend jika diperlukan
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userid', response.data.user.id);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate('/indexdashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div>
            <Link to="/" className="back-link">
        <span className="arrow">&#8592;</span> Kembali ke situsintan.org
      </Link>

<div className="login-container">
      <h1>Login</h1>
      <p className='p-login'>Gunakan layanan di bawah ini untuk masuk ke situsintan</p>
      <GoogleLoginButton />
      <p className="divider">Atau login dengan</p>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            name="email"
          />
        </div>
        <div>
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
       
        <button type="submit">Login</button>
      </form>

      <style>
        {`
          body {
            background-color: #f4f6f8;
            font-family: "Arial", sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .login-container {
            background-color: #ffffff;
            width: 360px;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .back-link {
               display: flex;
               align-items: center;
               text-decoration: none;
               color: #1F316F; /* Warna teks biru */
               font-size: 16px; /* Ukuran font lebih besar */
               font-weight: 500; /* Ketebalan teks medium */
               margin-bottom: 20px; /* Jarak bawah */
               margin-left: 20px; /* Jarak kiri */
             }
                  
             .back-link:hover {
               text-decoration: underline;
             }
                  
             .arrow {
               font-size: 20px; /* Ukuran panah sedikit lebih besar */
               margin-right: 8px; /* Jarak antara panah dan teks */
             }
            
          h1 {
            font-size: 24px;
            color: #333333;
            margin-bottom: 15px;
          }
          .p-login {
            font-size: 14px; 
            color: #555; 
            margin-bottom: 15px; 
            line-height: 1.5; 
            text-align: left; 
          }
          
          form {
            display: flex;
            flex-direction: column;
          }

          input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
          }

          input:focus {
            border-color: #007bff;
            outline: none;
          }


          button {
            padding: 10px;
            background-color: #1F316F;
            color: #ffffff;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          button:hover {
            background-color: #3B5A8C;
          }

          .divider {
            margin: 20px 0;
            font-size: 14px;
            color: #666;
          }
          .remember-me {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 14px;
            color: #555;
            margin-right: 185px;
          }

          .remember-me input {
             margin-right: 10px;
             transform: scale(1.2); /* Membesarkan checkbox */
          }

          .remember-me label {
            cursor: pointer;
            }

        `}
      </style>
    </div>
    </div>
  );
};

export default Login;
