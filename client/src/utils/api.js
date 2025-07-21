/**
 * API helper functions for making authenticated requests
 */

// API base URLs for production and development
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
    AI_BASE_URL: 'http://localhost:5001'
  },
  production: {
    API_BASE_URL: 'https://promptpal-umwk.onrender.com',    // Node backend
    AI_BASE_URL: 'https://promptpal-ai.onrender.com'        // Flask backend
  }
};

// Detect environment
const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const environment = isDevelopment ? 'development' : 'production';

export const API_BASE_URL = config[environment].API_BASE_URL;
export const AI_BASE_URL = config[environment].AI_BASE_URL;

// Helper function to build full URLs
export const buildUrl = (baseUrl, path) => {
  // If the path is already a full URL, return it as is
  if (path.startsWith('http')) {
    return path;
  }
  // Otherwise, join the base URL with the path
  return `${baseUrl}${path}`;
};

/**
 * Makes an authenticated request to the API
 * @param {string} url - The URL to make the request to
 * @param {string} method - The HTTP method to use
 * @param {object} data - The data to send in the request body
 * @returns {Promise<Response>} - The fetch response
 */
export const apiRequest = async (url, method = 'GET', data = null) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
    credentials: 'include', // Include cookies in requests
  };
  
  // Add body if data is provided
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  console.log(`Making ${method} request to ${url} with token:`, token ? 'Present' : 'Missing');
  
  return fetch(url, options);
};

/**
 * Makes a GET request to the API
 * @param {string} url - The URL to make the request to
 * @returns {Promise<any>} - The parsed response data
 */
export const get = async (url) => {
  // Check if the URL starts with http, otherwise prepend API_BASE_URL
  const fullUrl = buildUrl(API_BASE_URL, url);
  const response = await apiRequest(fullUrl);
  const responseData = await response.json();
  
  // If response is not OK, add the status to the error for better debugging
  if (!response.ok) {
    console.error(`API Error ${response.status}:`, responseData);
    const error = new Error(responseData.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }
  
  return responseData;
};

/**
 * Makes a POST request to the API
 * @param {string} url - The URL to make the request to
 * @param {object} data - The data to send in the request body
 * @returns {Promise<any>} - The parsed response data
 */
export const post = async (url, data) => {
  // Check if the URL starts with http, otherwise prepend API_BASE_URL
  const fullUrl = buildUrl(API_BASE_URL, url);
  const response = await apiRequest(fullUrl, 'POST', data);
  const responseData = await response.json();
  
  // If response is not OK, add the status to the error for better debugging
  if (!response.ok) {
    console.error(`API Error ${response.status}:`, responseData);
    const error = new Error(responseData.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }
  
  return responseData;
};

/**
 * Makes a PUT request to the API
 * @param {string} url - The URL to make the request to
 * @param {object} data - The data to send in the request body
 * @returns {Promise<any>} - The parsed response data
 */
export const put = async (url, data) => {
  // Check if the URL starts with http, otherwise prepend API_BASE_URL
  const fullUrl = buildUrl(API_BASE_URL, url);
  const response = await apiRequest(fullUrl, 'PUT', data);
  const responseData = await response.json();
  
  // If response is not OK, add the status to the error for better debugging
  if (!response.ok) {
    console.error(`API Error ${response.status}:`, responseData);
    const error = new Error(responseData.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }
  
  return responseData;
};

/**
 * Makes a DELETE request to the API
 * @param {string} url - The URL to make the request to
 * @returns {Promise<any>} - The parsed response data
 */
export const del = async (url) => {
  // Check if the URL starts with http, otherwise prepend API_BASE_URL
  const fullUrl = buildUrl(API_BASE_URL, url);
  const response = await apiRequest(fullUrl, 'DELETE');
  const responseData = await response.json();
  
  // If response is not OK, add the status to the error for better debugging
  if (!response.ok) {
    console.error(`API Error ${response.status}:`, responseData);
    const error = new Error(responseData.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }
  
  return responseData;
};
