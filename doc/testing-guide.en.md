# Testing Guide

## Overview
This guide explains how to write and run tests in the Elastic Query Studio project using Jest.

## Test Structure

### Directory Organization
```
test/
├── unit/                 # Unit tests
├── mocks/               # Mock implementations
├── common/              # Shared test utilities
└── setup.ts            # Jest setup configuration
```

### Test File Naming
- Test files should end with `.test.ts`
- Name should reflect the module being tested
- Example: `axios_instance.test.ts` for testing `axiosInstance.ts`

## Writing Tests

### Basic Test Structure
```typescript
import { jest } from '@jest/globals';
import { featureToTest } from '../../src/feature';

describe('Feature Name', () => {
    // Setup before tests
    beforeAll(() => {
        // Global setup
    });

    // Cleanup after tests
    afterAll(() => {
        // Global cleanup
    });

    // Individual test
    it('should do something specific', () => {
        // Test implementation
        expect(result).toBe(expectedValue);
    });
});
```

### Test Environment Modes
The project supports two testing modes:
```bash
# Run tests with mock server
yarn test:mock

# Run tests with real server
yarn test:real
```

### Using Mocks

#### Mock Configuration
```typescript
import { TEST_CONFIG } from '../test.config';

if (TEST_CONFIG.USE_MOCK) {
    mockAxios = jest.spyOn(axiosInstance, 'get')
        .mockImplementation((url: string) => {
            return Promise.resolve(TEST_CONFIG.MOCK_RESPONSES.cluster_info);
        });
}
```

#### Mock Response Templates
```typescript
// test/test.config.ts
export const TEST_CONFIG = {
    MOCK_RESPONSES: {
        cluster_info: {
            status: 200,
            data: {
                version: { number: '8.0.0' },
                cluster_name: 'test-cluster'
            }
        }
    }
};
```

### Testing Async Code
```typescript
it('should handle async operations', async () => {
    try {
        const response = await axiosInstance.get(url);
        expect(response.status).toBe(200);
    } catch (error) {
        fail('Should not throw an error');
    }
});
```

### Error Handling Tests
```typescript
it('should handle errors appropriately', async () => {
    expect.assertions(1);
    try {
        await functionThatThrows();
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});
```

## Best Practices

### Test Organization
1. Group related tests using `describe` blocks
2. Use clear, descriptive test names
3. Follow the Arrange-Act-Assert pattern
4. Keep tests independent and isolated

### Mocking Guidelines
1. Mock external dependencies
2. Use `beforeAll`/`afterAll` for mock setup/cleanup
3. Prefer Jest mocks over manual mocks
4. Document mock behavior in comments

### Assertions
1. Use specific matchers
2. Test both positive and negative cases
3. Verify error conditions
4. Check edge cases

### Code Coverage
```bash
# Generate coverage report
yarn test:coverage
```

Coverage goals:
- Statements: > 80%
- Branches: > 80%
- Functions: > 90%
- Lines: > 80%

## Common Patterns

### Testing VSCode Extensions
```typescript
import * as vscode from 'vscode';
import { mockVscode } from '../mocks/vscode';

jest.mock('vscode', () => mockVscode);

describe('VSCode Extension', () => {
    it('should handle VSCode API calls', () => {
        // Test implementation
    });
});
```

### Testing API Calls
```typescript
describe('API Tests', () => {
    it('should handle successful API calls', async () => {
        const response = await axiosInstance.get(url);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('version');
    });
});
```

## Troubleshooting

### Common Issues
1. Tests timing out
   - Solution: Adjust timeout in jest.config.ts
   
2. Mock not working
   - Solution: Verify mock setup and cleanup

3. Coverage not reporting
   - Solution: Check jest coverage configuration

## Additional Resources
- [Jest Documentation](https://jestjs.io/)
- [Jest API Reference](https://jestjs.io/docs/api)
- [Testing VSCode Extensions](https://code.visualstudio.com/api/working-with-extensions/testing-extension) 