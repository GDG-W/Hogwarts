import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': 'default-src http:',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
});

// INTERCEPTORS
client.interceptors.request.use(
  async (config) => {
    // interceptor logic goes here. e.g additional headers, request encryption, session management, etc.

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  async (response) => {
    // interceptor logic goes here. e.g additional headers, request encryption, session management, etc.

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default client;
