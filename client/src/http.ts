// src/http.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const apiVersion = import.meta.env.VITE_API_VERSION;

const http = axios.create({
  baseURL: `${baseURL}/${apiVersion}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default http;
