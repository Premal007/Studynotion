import axios from "axios"

// 1. Create a reusable Axios instance
export const axiosInstance = axios.create({});
// This lets you set up a base configuration for all HTTP requests if needed.

// 2. Define a generic API connector function
export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,           // HTTP method (GET, POST, etc.)
        url: `${url}`,                 // API endpoint URL
        data: bodyData ? bodyData : null, // Request body (for POST, PUT, etc.)
        headers: headers ? headers : null, // Custom headers (like auth tokens)
        params: params ? params : null,    // URL query parameters
    });
}