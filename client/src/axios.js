import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = JSON.parse(window.localStorage.getItem('userInfo')) ? `Bearer ${JSON.parse(window.localStorage.getItem('userInfo')).token}` : "";
  return config;
});

export default instance;