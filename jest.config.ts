/**
 * @file jest.config.ts
 * @description Jest configuration for Elastic Query Studio
 * @modified 2025-04-15
 * 
 * @history
 * - 2025-04-15 Initial version
 *   - Added TypeScript support
 *   - Configured VSCode mocking
 *   - Set up test environment
 *   - Added coverage settings
 */

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^vscode$': '<rootDir>/test/mocks/vscode.ts'
    },
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/types/**/*'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    clearMocks: true,
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    }
};

export default config; 