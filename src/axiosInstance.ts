/**
 * @file axiosInstance.ts
 * @description Axios HTTP client configuration for Elasticsearch
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-01
 * 
 * This file provides:
 * - Configured Axios instance for Elasticsearch API calls
 * - Request and response interceptors for debugging
 * - Error handling and logging
 * - Custom headers configuration
 * 
 * @history
 * - 2024-03-01 Initial documented version
 *   - Created custom Axios instance
 *   - Added request/response interceptors
 *   - Implemented error handling
 *   - Added debug logging
 */

import axios from 'axios';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// export default axios.create({
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//     },
// });


const instance = axios.create({
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 추가
instance.interceptors.request.use(request => {
    console.log('Elasticsearch Request:', {
        method: request.method,
        url: request.url,
        baseURL: request.baseURL,
        headers: request.headers,
        data: request.data
    });
    return request;
});

// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => {
        console.log('Elasticsearch Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('Elasticsearch Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

export default instance;