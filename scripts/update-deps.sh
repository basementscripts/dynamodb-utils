#!/bin/bash

# Update dependencies
echo "Updating dependencies..."
yarn upgrade-interactive --latest

# Run security audit
echo "Running security audit..."
yarn audit

# Generate dependency report
echo "Generating dependency report..."
yarn list --pattern "@aws-sdk|lodash" > dependency-report.txt

echo "Dependency update complete. Check dependency-report.txt for details." 