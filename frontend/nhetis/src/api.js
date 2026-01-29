import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  
  return config;
});

export default API;
