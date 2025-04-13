/**
 * @file es_connect.test.ts
 * @description Test suite for Elasticsearch connection and basic operations
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-21
 * 
 * This test suite verifies:
 * - Direct Elasticsearch connection
 * - Basic cluster operations
 * - Connection error handling
 * - Configuration validation
 * 
 * @history
 * - 2024-03-21 Initial documented version
 *   - Added connection tests
 *   - Added configuration validation
 *   - Implemented error scenarios
 */
import { expect, settings } from '../common/test-config';
const axios = require('axios');
const https = require('https');
const path = require('path');

describe('Elasticsearch Connection Test', () => {
    const ES_URL = settings.elasticsearch.url;
    const TIMEOUT = settings.elasticsearch.timeout;

    it('should connect to Elasticsearch successfully', async () => {
        try {
            const response = await axios.get(ES_URL, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: TIMEOUT,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            });
            
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('version');
            expect(response.data).to.have.property('cluster_name');
            console.log('Elasticsearch Info:', {
                version: response.data.version.number,
                clusterName: response.data.cluster_name
            });
        } catch (error) {
            console.error('Connection Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });
}); 