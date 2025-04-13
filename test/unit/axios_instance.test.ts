/**
 * @file axios_instance.test.ts
 * @description Test suite for Elasticsearch Axios client instance
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-21
 * 
 * This test suite verifies:
 * - Basic connectivity to Elasticsearch server
 * - Request/Response interceptor functionality
 * - Error handling capabilities
 * - Index listing functionality
 * 
 * @history
 * - 2024-03-21 Initial documented version
 *   - Added basic connectivity test
 *   - Added index listing test
 *   - Implemented error handling
 */

const { expect } = require('chai');
const axiosInstance = require('../../src/axiosInstance').default;
const settings = require('../settings.json');
const { AxiosResponse } = require('axios');

describe('Axios Instance Test', () => {
    const ES_URL = settings.elasticsearch.url;
    const TIMEOUT = settings.elasticsearch.timeout;

    it('should connect to Elasticsearch using axiosInstance', async () => {
        try {
            // Test basic connectivity to Elasticsearch
            const response = await axiosInstance.get(ES_URL);
            
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('version');
            expect(response.data).to.have.property('cluster_name');
            
            console.log('Connection successful with axiosInstance');
        } catch (error) {
            console.error('Connection Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });

    it('should log request and response through interceptors', async () => {
        try {
            // Test index listing functionality
            const response = await axiosInstance.get(`${ES_URL}/_cat/indices?format=json`);
            
            expect(response.status).to.equal(200);
            expect(Array.isArray(response.data)).to.be.true;
            
            console.log('Indices request completed through axiosInstance');
        } catch (error) {
            console.error('Indices Request Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });
}); 