/**
 * @file axiosInstance.ts
 * @description Axios instance configuration for Elasticsearch API calls
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Framework Migration
 *   - Migrated test framework from Mocha/Chai to Jest
 *   - Added support for both real server and mock testing
 *   - Implemented test configuration for flexible test environments
 *   - Updated test hooks (before/after → beforeAll/afterAll)
 *   - Replaced Sinon spies/stubs with Jest mock functions
 *   - Enhanced test isolation and maintainability
 *   - Added comprehensive mock data for API responses
 *   - Improved test coverage and reliability
 * 
 * @example
 * // Using the axios instance
 * const response = await axiosInstance.get('/endpoint');
 * 
 * @example
 * // Running tests with mock
 * // yarn test:mock
 * 
 * @example
 * // Running tests with real server
 * // yarn test:real
 */

import axios from 'axios';
import https from 'https';

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
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
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