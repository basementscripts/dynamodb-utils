# `@basementscripts/dynamodb-utils`

A TypeScript wrapper around the AWS SDK for DynamoDB, simplifying common operations such as querying, scanning, creating, updating, and deleting items.

## Features

- TypeScript support
- Simplified API for common DynamoDB operations
- Built-in error handling and logging
- Input validation
- Timestamp management
- Comprehensive documentation

## Installation

```bash
npm install @basementscripts/dynamodb-utils
```

## Quick Start

```typescript
import { DynamoDb } from '@basementscripts/dynamodb-utils'

// Initialize the DynamoDB client
const dynamoDb = new DynamoDb({
	region: 'us-east-1',
	credentials: {
		accessKeyId: 'YOUR_ACCESS_KEY_ID',
		secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
	}
})

// Create a new item
const item = await dynamoDb.create({
	tableName: 'Users',
	key: {
		key: 'user123',
		sort: 'profile'
	},
	params: {
		name: 'John Doe',
		email: 'john@example.com',
		age: 30
	}
})

// Query items
const items = await dynamoDb.query({
	tableName: 'Users',
	query: {
		age: 30
	},
	limit: 10
})

// Find a specific item
const foundItem = await dynamoDb.findRecord({
	tableName: 'Users',
	key: {
		key: 'user123',
		sort: 'profile'
	}
})

// Update an item
const updatedItem = await dynamoDb.update({
	tableName: 'Users',
	key: {
		key: 'user123',
		sort: 'profile'
	},
	params: {
		age: 31,
		lastUpdated: '2024-03-20'
	}
})

// Delete an item
const result = await dynamoDb.delete({
	tableName: 'Users',
	key: {
		key: 'user123',
		sort: 'profile'
	}
})
```

## Advanced Usage

### Query with Filters

```typescript
const items = await dynamoDb.query({
	tableName: 'Users',
	query: {
		age: 30
	},
	filters: ['name = :name'],
	params: {
		':name': 'John Doe'
	},
	limit: 10
})
```

### Query with Pagination

```typescript
const items = await dynamoDb.query({
	tableName: 'Users',
	query: {
		age: 30
	},
	limit: 10,
	nextToken: {
		key: { S: 'user123' },
		sort: { S: 'profile' }
	}
})
```

### Query with Projection

```typescript
const items = await dynamoDb.query({
	tableName: 'Users',
	query: {
		age: 30
	},
	output: ['name', 'email'],
	limit: 10
})
```

### Query with Key Condition

```typescript
const items = await dynamoDb.query({
	tableName: 'Users',
	query: {
		age: 30
	},
	key: {
		key: 'user123',
		sort: 'profile'
	},
	limit: 10
})
```

### Query with Update Condition

```typescript
const items = await dynamoDb.query({
	tableName: 'Users',
	query: {
		age: 30
	},
	key: {
		key: 'user123',
		sort: 'profile'
	},
	params: {
		':age': 30
	},
	limit: 10
})
```

## Error Handling

The package provides several error classes for different scenarios:

```typescript
import {
	DynamoDbError,
	ItemExistsError,
	ItemNotFoundError,
	QueryError,
	CreateError,
	DeleteError,
	UpdateError,
	ValidationError
} from '@basementscripts/dynamodb-utils'

try {
	const item = await dynamoDb.create({
		tableName: 'Users',
		key: {
			key: 'user123',
			sort: 'profile'
		},
		params: {
			name: 'John Doe',
			email: 'john@example.com',
			age: 30
		}
	})
} catch (e) {
	if (e instanceof ItemExistsError) {
		console.error('Item already exists:', e.message)
	} else if (e instanceof ValidationError) {
		console.error('Validation error:', e.message)
	} else if (e instanceof CreateError) {
		console.error('Create error:', e.message)
	} else {
		console.error('Unknown error:', e)
	}
}
```

## Logging

The package includes a built-in logger for tracking operations and errors:

```typescript
import { Logger, LogLevel } from '@basementscripts/dynamodb-utils'

const logger = new Logger({
	level: LogLevel.DEBUG,
	prefix: '[DynamoDB]',
	includeTimestamp: true,
	includeStack: true
})

logger.debug('Debug message')
logger.info('Info message')
logger.warn('Warning message')
logger.error('Error message', new Error('Something went wrong'))
```

## Validation

The package includes several validation utilities for ensuring data integrity:

```typescript
import {
	validateRequired,
	validateNonEmptyString,
	validateNumberRange,
	validateType,
	validateArray,
	validateObject,
	validateTableName,
	validateKey,
	validateTimestamp,
	validateLimit,
	validateNextToken,
	validateFilterExpression,
	validateProjectionExpression,
	validateKeyConditionExpression,
	validateUpdateExpression,
	validateConditionExpression
} from '@basementscripts/dynamodb-utils'

// Validate required value
validateRequired(value, 'Value')

// Validate non-empty string
validateNonEmptyString(value, 'String')

// Validate number range
validateNumberRange(value, 'Number', 0, 100)

// Validate type
validateType<string>(value, 'Value', 'string')

// Validate array
validateArray<string>(value, 'Array')

// Validate object
validateObject(value, 'Object')

// Validate table name
validateTableName(value)

// Validate key
validateKey(value)

// Validate timestamp
validateTimestamp(value)

// Validate limit
validateLimit(value)

// Validate next token
validateNextToken(value)

// Validate filter expression
validateFilterExpression(value)

// Validate projection expression
validateProjectionExpression(value)

// Validate key condition expression
validateKeyConditionExpression(value)

// Validate update expression
validateUpdateExpression(value)

// Validate condition expression
validateConditionExpression(value)
```

## Timestamp Management

The package includes several utilities for handling timestamps:

```typescript
import {
	convertTimestamp,
	convertToTimezone,
	convertToUTC,
	convertToISO,
	convertToUnix,
	getCurrentTimestamp,
	getCurrentTimestampSeconds,
	getCurrentTimestampISO,
	getCurrentTimestampUTC,
	getCurrentTimestampInTimezone,
	getCurrentTimestampInFormat,
	getCurrentTimestampInTimezoneAndFormat
} from '@basementscripts/dynamodb-utils'

// Convert timestamp
const timestamp = convertTimestamp(Date.now(), {
	timezone: 'UTC',
	format: 'iso'
})

// Convert to timezone
const timezoneTimestamp = convertToTimezone(Date.now(), 'America/New_York')

// Convert to UTC
const utcTimestamp = convertToUTC(Date.now())

// Convert to ISO
const isoTimestamp = convertToISO(Date.now())

// Convert to Unix
const unixTimestamp = convertToUnix(Date.now())

// Get current timestamp
const currentTimestamp = getCurrentTimestamp()

// Get current timestamp in seconds
const currentTimestampSeconds = getCurrentTimestampSeconds()

// Get current timestamp in ISO format
const currentTimestampISO = getCurrentTimestampISO()

// Get current timestamp in UTC format
const currentTimestampUTC = getCurrentTimestampUTC()

// Get current timestamp in timezone
const currentTimestampInTimezone = getCurrentTimestampInTimezone('America/New_York')

// Get current timestamp in format
const currentTimestampInFormat = getCurrentTimestampInFormat('iso')

// Get current timestamp in timezone and format
const currentTimestampInTimezoneAndFormat = getCurrentTimestampInTimezoneAndFormat(
	'America/New_York',
	'iso'
)
```

## API Documentation

For detailed API documentation, see [API.md](docs/api.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
