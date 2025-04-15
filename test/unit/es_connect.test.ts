/**
 * @file es_connect.test.ts
 * @description Test suite for Elasticsearch connection functionality
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Framework Migration
 *   - Migrated from Mocha/Chai to Jest framework
 *   - Implemented environment-aware testing (mock/real)
 *   - Added Jest mocks for Elasticsearch responses
 *   - Converted Sinon spies to Jest spyOn
 *   - Enhanced connection error handling
 *   - Added structured mock responses
 *   - Improved test reliability
 *   - Updated to Jest assertion patterns
 * 
 * This test suite validates:
 * - Elasticsearch connection setup
 * - Cluster information retrieval
 * - Connection error handling
 * - Response data validation
 * 
 * @example
 * // Execute with mock environment
 * TEST_USE_MOCK=true jest es_connect.test.ts
 * 
 * @example
 * // Execute with real Elasticsearch
 * TEST_USE_MOCK=false jest es_connect.test.ts
 */

import { jest } from '@jest/globals';
import axiosInstance from '../../src/axiosInstance';
import settings from '../settings.json';
import { TEST_CONFIG } from '../test.config';

describe('Elasticsearch Connection Test', () => {
    let mockAxios: any = null;

    beforeAll(() => {
        if (TEST_CONFIG.USE_MOCK) {
            mockAxios = jest.spyOn(axiosInstance, 'get').mockImplementation((url: string) => {
                return Promise.resolve(TEST_CONFIG.MOCK_RESPONSES.cluster_info);
            });
        }
    });

    afterAll(() => {
        if (mockAxios) {
            mockAxios.mockRestore();
        }
    });

    it('should connect to Elasticsearch successfully', async () => {
        try {
            const response = await axiosInstance.get(settings.elasticsearch.url);
            const info = {
                version: response.data.version.number,
                clusterName: response.data.cluster_name
            };
            
            if (TEST_CONFIG.USE_MOCK) {
                console.log('Mock Elasticsearch Info:', info);
            } else {
                console.log('Real Elasticsearch Info:', info);
            }
            
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('version');
            expect(response.data).toHaveProperty('cluster_name');
        } catch (error) {
            console.error('Connection Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });
}); 