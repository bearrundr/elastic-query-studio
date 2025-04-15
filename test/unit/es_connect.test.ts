/**
 * @file es_connect.test.ts
 * @description Test suite for Elasticsearch connection functionality
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2025-04-15
 * 
 * This test suite verifies:
 * - Elasticsearch connection functionality
 * - Basic cluster information retrieval
 * 
 * @history
 * - 2024-03-21 Initial documented version
 *   - Added basic connection test
 * - 2025-04-15 Code cleanup
 *   - Removed unused imports
 *   - Enhanced type checking compliance
 */

import { expect } from 'chai';
import axios from 'axios';
import settings from '../settings.json';

describe('Elasticsearch Connection Test', () => {
    it('should connect to Elasticsearch successfully', async () => {
        try {
            const response = await axios.get(settings.elasticsearch.url);
            const info = {
                version: response.data.version.number,
                clusterName: response.data.cluster_name
            };
            console.log('Elasticsearch Info:', info);
            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('version');
            expect(response.data).to.have.property('cluster_name');
        } catch (error) {
            console.error('Connection Error:', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    });
}); 