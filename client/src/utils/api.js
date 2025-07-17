/**
 * API helper functions for making authenticated requests
 */

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
  const response = await apiRequest(url);
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
  const response = await apiRequest(url, 'POST', data);
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
  const response = await apiRequest(url, 'PUT', data);
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
  const response = await apiRequest(url, 'DELETE');
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
