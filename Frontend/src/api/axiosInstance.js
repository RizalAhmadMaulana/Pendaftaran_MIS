import axios from 'axios';

/**
 * Konfigurasi Dasar API Client untuk Portal Pendaftaran MIS
 * Mendukung akses dinamis berstandar industri:
 * 1. Prioritas utama: Nilai dari file .env (VITE_API_BASE_URL)
 * 2. Smart Host Replacement: Jika diakses via IP LAN (misal 192.168.1.74), otomatis menyesuaikan host agar tidak mentok di localhost
 * 3. Fallback cerdas: Mengikuti hostname browser
 */
export const getBaseApiUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl) {
      // Jika browser dibuka via IP LAN dan URL .env masih tertulis localhost, gantikan ke IP host secara otomatis
      if (host !== 'localhost' && host !== '127.0.0.1' && envUrl.includes('localhost')) {
        return envUrl.replace('localhost', host);
      }
      return envUrl;
    }
    return `http://${host}:8001/api`;
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';
};

/**
 * Mengembalikan root host backend tanpa suffix '/api'
 * Contoh: 'http://localhost:8001' atau 'https://ppdb.mentariku.org'
 * Digunakan untuk URL asset media/dokumen dan tautan Django Admin
 */
export const getBackendOrigin = () => {
  const apiUrl = getBaseApiUrl();
  return apiUrl.replace(/\/api\/?$/, '');
};

const axiosInstance = axios.create({
  baseURL: getBaseApiUrl(),
  withCredentials: true,
});

// Request Interceptor: Otomatis sisipkan JWT token Authorization jika user login
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Tangani error 401 Unauthorized secara elegan
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
