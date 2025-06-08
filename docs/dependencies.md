# Dependency Management

## Core Dependencies

- `@aws-sdk/client-dynamodb`: AWS SDK for DynamoDB operations
- `@aws-sdk/lib-dynamodb`: AWS SDK utilities for DynamoDB
- `lodash`: Utility library for common operations

## Development Dependencies

- `@babel/preset-env`: Babel preset for modern JavaScript
- `@babel/preset-typescript`: Babel preset for TypeScript
- `@jest/globals`: Jest testing framework
- `@types/jest`: TypeScript definitions for Jest
- `@types/lodash`: TypeScript definitions for Lodash
- `@types/node`: TypeScript definitions for Node.js
- `aws-sdk-client-mock`: Mocking utilities for AWS SDK
- `jest`: JavaScript testing framework
- `make-coverage-badge`: Tool for generating coverage badges
- `nodemon`: Development server with auto-reload
- `typescript`: TypeScript compiler

## Dependency Management

### Updating Dependencies

To update dependencies to their latest versions:

```bash
yarn update-deps
```

This will:

1. Run an interactive upgrade process
2. Perform a security audit
3. Generate a dependency report

### Checking Dependencies

To check for outdated dependencies and security issues:

```bash
yarn check-deps
```

### Security

Regular security audits are performed using `yarn audit`. Any security vulnerabilities should be addressed promptly.

### Version Requirements

- Node.js: >= 14.0.0
- TypeScript: >= 4.0.0
- Yarn: >= 1.22.0

## CI/CD

Dependency checks are integrated into the CI pipeline to ensure:

- All dependencies are up to date
- No security vulnerabilities exist
- TypeScript types are properly maintained
