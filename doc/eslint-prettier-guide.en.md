# ESLint and Prettier Guide

## Overview
This guide explains how to use ESLint and Prettier in the Elastic Query Studio project for code quality and formatting.

## ESLint Configuration

### Basic Usage
```bash
# Run ESLint check
yarn lint:check

# Run ESLint and fix automatically
yarn lint
```

### Important Rules
1. TypeScript Specific
   - Function return types must be explicitly declared
   - Usage of 'any' type is restricted (warning)
   - Unused variables are flagged
   - Restricted console.log usage (warning)

2. Code Quality
   - No unused imports
   - No unnecessary type assertions
   - Consistent type definitions
   - Proper error handling required

### Custom Rules
```javascript
{
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["error", "warn"] }],
    // ... other rules
}
```

## Prettier Configuration

### Basic Usage
```bash
# Format code
yarn format
```

### Style Rules
- Tab Width: 4 spaces
- Max Line Length: 160 characters
- Semicolons: Required
- Quotes: Single
- Trailing Comma: ES5
- Arrow Function Parentheses: Always

### Configuration Details
```javascript
{
    "tabWidth": 4,
    "printWidth": 160,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "arrowParens": "always"
}
```

## VS Code Integration

### Required Extensions
1. ESLint
2. Prettier - Code formatter

### Recommended Settings
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

## Pre-commit Hooks
The project uses Husky for pre-commit hooks:
- ESLint check runs before commit
- Prettier formatting runs before commit

## Troubleshooting

### Common Issues
1. ESLint and Prettier Conflicts
   - Solution: Check .eslintrc.js and .prettierrc for conflicting rules
   
2. VSCode Not Formatting on Save
   - Solution: Verify VS Code settings and extension installation

3. Husky Hooks Not Running
   - Solution: Run `yarn postinstall` to reinstall hooks

### Override Rules
To temporarily disable ESLint rules:
```typescript
/* eslint-disable rule-name */
// Your code here
/* eslint-enable rule-name */
```

To temporarily disable Prettier:
```typescript
// prettier-ignore
const yourCode = here;
```

## Best Practices
1. Always run `yarn lint` before committing
2. Use `// eslint-disable-next-line` sparingly
3. Document any rule overrides in comments
4. Keep .eslintrc.js and .prettierrc in sync
5. Regularly update ESLint and Prettier versions

## Additional Resources
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/) 