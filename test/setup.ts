/**
 * @file setup.ts
 * @description Jest test environment setup and configuration
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * 
 * @changelog
 * - 2025-04-15 Test Framework Setup
 *   - Created Jest test environment configuration
 *   - Added global test setup and teardown
 *   - Configured Jest timeout settings
 *   - Added VSCode API mocking setup
 *   - Implemented test environment variables
 *   - Added mock console logging
 *   - Setup test data cleanup
 *   - Configured Jest custom matchers
 * 
 * This setup file provides:
 * - Global Jest configuration
 * - Test environment initialization
 * - Mock setup and teardown
 * - Custom test utilities
 * 
 * @example
 * // Referenced in jest.config.ts
 * setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
 */

import '@jest/globals'; 