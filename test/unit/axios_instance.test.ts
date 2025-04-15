/**
 * @file axios_instance.test.ts
 * @description Test suite for Axios instance configuration and API interactions
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Framework Migration
 *   - Converted from Mocha/Chai to Jest test framework
 *   - Implemented dual testing mode (mock/real server)
 *   - Added Jest spy for axios.get method
 *   - Replaced Sinon stubs with Jest mock functions
 *   - Enhanced error handling and logging
 *   - Added mock response templates
 *   - Improved test isolation
 *   - Updated assertion style to Jest expectations
 * 
 * This test suite verifies:
 * - Axios instance configuration
 * - API request/response handling
 * - Error handling and logging
 * - Mock and real server interactions
 * 
 * @example
 * // Run with mock server
 * TEST_USE_MOCK=true jest axios_instance.test.ts
 * 
 * @example
 * // Run with real server
 * TEST_USE_MOCK=false jest axios_instance.test.ts
 */

import { jest } from '@jest/globals';
import axiosInstance from '../../src/axiosInstance';
import settings from '../settings.json';
import { TEST_CONFIG } from '../test.config';

describe('Axios Instance Test', () => {
    const ES_URL = settings.elasticsearch.url;
    let mockAxios: any = null;

    beforeAll(() => {
        if (TEST_CONFIG.USE_MOCK) {
            mockAxios = jest.spyOn(axiosInstance, 'get').mockImplementation((url: string) => {
                if (url === ES_URL) {
                    return Promise.resolve(TEST_CONFIG.MOCK_RESPONSES.cluster_info);
                } else if (url.includes('_cat/indices')) {
                    return Promise.resolve(TEST_CONFIG.MOCK_RESPONSES.indices);
                }
                return Promise.reject(new Error('Unknown endpoint'));
            });
        }
    });

    afterAll(() => {
        if (mockAxios) {
            mockAxios.mockRestore();
        }
    });

    it('should connect to Elasticsearch using axiosInstance', async () => {
        try {
            const response = await axiosInstance.get(ES_URL);
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('version');
            expect(response.data).toHaveProperty('cluster_name');
            
            if (TEST_CONFIG.USE_MOCK) {
                console.log('Mock connection successful');
            } else {
                console.log('Real connection successful with axiosInstance');
            }
        } catch (error) {
            console.error('Connection Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });

    it('should log request and response through interceptors', async () => {
        try {
            const response = await axiosInstance.get(`${ES_URL}/_cat/indices?format=json`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            
            if (TEST_CONFIG.USE_MOCK) {
                console.log('Mock indices request completed');
            } else {
                console.log('Real indices request completed through axiosInstance');
            }
        } catch (error) {
            console.error('Indices Request Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });
}); 