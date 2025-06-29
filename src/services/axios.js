import axios from 'axios';

const apiHandler = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // send cookies!
});

export default apiHandler;