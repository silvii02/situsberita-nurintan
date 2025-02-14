import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../utils/AuthContext';
import configUrl from '../configUrl';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${configUrl.beBaseUrl}/api/googleredirect`, {
                token: credentialResponse.credential, // token dari Google
            });
            
            const { token, user, status } = response.data;
            let validemail = response.data.user.email;


            if (validemail !=='nurintansilviani@gmail.com' || status === 'user_not_found') {
                alert('Email Anda tidak terdaftar di sistem kami. Silakan gunakan email yang terdaftar.');
                return;
            }

            // Simpan token dan data user jika email valid
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userid', JSON.stringify(user));

            localStorage.setItem('token', token);
            localStorage.setItem('userid', JSON.stringify(user));

            login();
            navigate('/indexdashboard');
        } catch (error) {
            console.error('Login Failed:', error);
            alert('Email ini tidak bisa digunakan untuk login.');
        }
    };

    return (
        <GoogleOAuthProvider clientId="1063218490939-j8eil2n0fa30d22clleboevpmcaugrg8.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
