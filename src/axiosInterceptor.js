import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Retrieve the JWT from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach the token as an authorization header
  }
  return config;
});

export default axios;
