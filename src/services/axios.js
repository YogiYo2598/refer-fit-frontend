import axios from 'axios';

const apiHandler = axios.create({
  baseURL: '/api',
  withCredentials: true // send cookies!
});

export default apiHandler;