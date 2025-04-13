# Branch Naming Convention

## Basic Structure
```
<type>/<scope>[-<sub-scope>][-<issue-number>]
```

## Type Classification

### Main Types
- `fix/` : Bug fixes, current problem resolution
- `feature/` : New feature development
- `enhance/` : Existing feature improvement
- `refactor/` : Code refactoring
- `diagnose/` : Problem analysis and diagnosis
- `docs/` : Documentation related work
- `test/` : Testing related work
- `chore/` : Build, configuration changes, etc.
- `hotfix/` : Urgent fixes

## Naming Examples

### Basic Format
```
fix/host-connection
feature/api-spec-7.17
enhance/ui/icon-design
```

### With Issue Number
```
fix/host-connection-#123
feature/api-spec-#456
```

### With Sub-scope
```
fix/connection/host-timeout
enhance/ui/icon/design
feature/api/spec-7.17
```

## Usage Examples

### Problem Resolution
- `fix/host-connection` : Resolve host connection issue
- `fix/api/timeout` : Fix API timeout issue
- `hotfix/security-issue` : Urgent security issue fix

### Feature Development
- `feature/api-spec-7.17` : Add 7.17 version API spec
- `feature/ui/dark-theme` : Add dark theme feature
- `feature/auth/oauth` : Add OAuth authentication

### Feature Enhancement
- `enhance/ui/icon-design` : Improve UI icon design
- `enhance/performance/query` : Enhance query performance
- `enhance/ux/response-time` : Improve response time

### Refactoring
- `refactor/namespace-rename` : Change namespace
- `refactor/code-structure` : Improve code structure
- `refactor/api/client` : Refactor API client

### Problem Analysis
- `diagnose/connection-issue` : Analyze connection issues
- `diagnose/performance` : Analyze performance issues
- `diagnose/memory-leak` : Analyze memory leaks

### Documentation
- `docs/api-guide` : Write API guide
- `docs/setup-guide` : Write setup guide
- `docs/branch-naming` : Write branch naming convention

### Build & Configuration
- `chore/marketplace-setup` : Marketplace configuration
- `chore/dependency-update` : Update dependencies
- `chore/build-optimization` : Optimize build process

## Rules
1. Use lowercase English letters for all branch names.
2. Use hyphens (-) for word separation.
3. Use forward slashes (/) for category separation.
4. Add issue numbers at the end in '#number' format.
5. Branch names should clearly express the work content.
6. Use `hotfix/` for urgent fixes.

## Pull Request (PR) Rules

### When to Create a PR
- When feature development is complete
- When bug fixes are complete
- When code review is needed for changes
- When documentation work is complete

### PR Title Format
```
[<type>] <title> (#issue-number)
```

Examples:
- `[fix] Resolve host connection timeout issue (#123)`
- `[feature] Add Elasticsearch 7.17 API support (#456)`
- `[docs] Update API documentation (#789)`

### PR Description Requirements
1. Summary of changes
2. Detailed change description
3. Test results
4. Related issue numbers
5. Reviewer checklist

### PR Review Process
1. Request code review
2. Incorporate reviewer feedback
3. Merge after approval
4. Delete branch

## Notes
- Keep branch names concise and clear.
- Choose words that clearly express the work content.
- Use terms that team members can easily understand.
- Additional types can be defined based on project characteristics. 