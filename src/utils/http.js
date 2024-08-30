import axios from 'axios'
import { useUserStore } from '@/stores/userStore';

const httpInstance = axios.create({
  baseURL: "http://localhost:5146/", // 后端url !!!test
  timeout: 5000
});

// 拦截器
httpInstance.interceptors.request.use(config => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
}, e => Promise.reject(e));

httpInstance.interceptors.response.use(res => res.data, e => {
  return Promise.reject(e);
});

export default httpInstance;