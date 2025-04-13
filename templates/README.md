# File Template Guidelines

## How to Use File Header Template

### Basic Rules
- All source files must use the `file-header.txt` template
- Header comments are required for all new files
- Comments must be placed at the top of the file

### Tag Descriptions
- `@file`: Filename (including extension)
- `@description`: Main purpose and functionality of the file
- `@author`: Author information
- `@copyright`: Copyright information
- `@license`: License information
- `@modified`: Last modification date (YYYY-MM-DD format)

### History Management
- Each change is recorded with a date
- Change descriptions should be specific and clear
- Record only significant changes (minor modifications are tracked through git commits)

### Example
```typescript
/**
 * @file example.ts
 * @description Example implementation file
 * @author CLOUDIN Inc. <bearrundr@hotmail.com>
 * @copyright (c) 2024 CLOUDIN Inc.
 * @license MIT
 * @modified 2024-03-01
 * 
 * This file provides:
 * - Core functionality description
 * - Key component details
 * - Usage examples
 * 
 * @history
 * - 2024-03-01 Initial version
 *   - Implemented basic functionality
 *   - Added test cases
 */
``` 