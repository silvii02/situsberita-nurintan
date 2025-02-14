import axios from 'axios';
import configUrl from '../../src/configUrl';

const axiosInstance = axios.create({
    baseURL: `${configUrl.beBaseUrl}/api`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authTokenSitusNews')}`
    }
  });
  
  export default axiosInstance;
