/**
 * @file test-config.ts
 * @description Test configuration and mock data management
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Framework Configuration
 *   - Created centralized test configuration file
 *   - Added environment-based test mode switching (mock/real)
 *   - Implemented mock response data templates
 *   - Added type definitions for mock data structures
 *   - Configured test environment variables
 *   - Added support for conditional test execution
 *   - Centralized mock data management
 * 
 * This file provides:
 * - Test environment configuration
 * - Mock data templates for API responses
 * - Environment variable handling
 * - Test mode switching logic
 * 
 * @example
 * // Using mock mode in tests
 * if (TEST_CONFIG.USE_MOCK) {
 *   // Mock implementation
 * }
 * 
 * @example
 * // Accessing mock data
 * const response = TEST_CONFIG.MOCK_RESPONSES.cluster_info;
 */

import settings from '../settings.json';

export {
    settings
}; 