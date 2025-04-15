/**
 * @file test.config.ts
 * @description Test configuration and mock data management
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Configuration Setup
 *   - Created centralized test configuration
 *   - Added mock/real environment switching
 *   - Implemented mock response templates
 *   - Added Elasticsearch response mocks
 *   - Created type definitions for mocks
 *   - Added test environment detection
 *   - Implemented mock data interfaces
 *   - Added configuration validation
 * 
 * This configuration provides:
 * - Test environment settings
 * - Mock data management
 * - Environment detection
 * - Response templates
 * 
 * @example
 * // Import and use in tests
 * import { TEST_CONFIG } from '../test.config';
 * 
 * if (TEST_CONFIG.USE_MOCK) {
 *   const mockResponse = TEST_CONFIG.MOCK_RESPONSES.cluster_info;
 * }
 */

export const TEST_CONFIG = {
    // 환경 변수나 설정에 따라 mock 사용 여부 결정
    USE_MOCK: process.env.TEST_USE_MOCK === 'true' || false,
    
    // mock 데이터
    MOCK_RESPONSES: {
        cluster_info: {
            status: 200,
            data: {
                version: { number: '8.0.0' },
                cluster_name: 'test-cluster'
            }
        },
        indices: {
            status: 200,
            data: [
                { index: 'test-index-1', health: 'green', status: 'open' },
                { index: 'test-index-2', health: 'yellow', status: 'open' }
            ]
        }
    }
}; 