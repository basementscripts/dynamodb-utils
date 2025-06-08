# API Documentation: `@basementscripts/dynamodb-utils`

## Overview

The `@basementscripts/dynamodb-utils` package provides a wrapper around the AWS SDK for DynamoDB, simplifying common operations such as querying, scanning, creating, updating, and deleting items. The package is built using TypeScript and is compatible with AWS SDK v3.

## Installation

```bash
npm install @basementscripts/dynamodb-utils
```

## Configuration

The package can be configured using the `DynamoDbOptions` interface:

```typescript
interface DynamoDbOptions {
	region?: string
	endpoint?: string
	credentials?: {
		accessKeyId: string
		secretAccessKey: string
	}
}
```

## API Reference

### DynamoDb Class

The main class for interacting with DynamoDB.

#### Constructor

```typescript
constructor(options: DynamoDbOptions = {})
```

Creates a new instance of the DynamoDB client.

#### Methods

##### query

```typescript
async query<T extends EntityRequest & QueryItemRequest>(
  request: T
): Promise<Record<string, unknown>[]>
```

Queries the table by attributes.

**Parameters:**

- `request`: The query request object containing:
  - `tableName`: The name of the table to query
  - `query`: The query conditions
  - `limit`: The maximum number of items to return
  - `nextToken`: The token for pagination
  - `filters`: Additional filter expressions
  - `output`: The attributes to return
  - `params`: Additional parameters for the query

**Returns:**

- A promise that resolves to an array of items matching the query

**Throws:**

- `QueryError`: If the query fails
- `ValidationError`: If the request is invalid

##### queryRecord

```typescript
async queryRecord<T extends EntityRequest & QueryItemRequest>(
  request: T
): Promise<Record<string, unknown> | undefined>
```

Queries the table and returns the first item.

**Parameters:**

- `request`: The query request object (same as `query`)

**Returns:**

- A promise that resolves to the first item matching the query, or undefined if no items match

**Throws:**

- `QueryError`: If the query fails
- `ValidationError`: If the request is invalid

##### create

```typescript
async create<T extends CreateEntityRequest & QueryItemRequest>(
  request: T
): Promise<Record<string, unknown>>
```

Creates a new item in the table.

**Parameters:**

- `request`: The create request object containing:
  - `tableName`: The name of the table
  - `key`: The primary key of the item
  - `params`: The attributes of the item

**Returns:**

- A promise that resolves to the created item

**Throws:**

- `ItemExistsError`: If an item with the same key already exists
- `CreateError`: If the creation fails
- `ValidationError`: If the request is invalid

##### findRecord

```typescript
async findRecord<T extends EntityRequest & GetItemRequest>(
  request: T
): Promise<Record<string, unknown> | undefined>
```

Finds a specific item in the table.

**Parameters:**

- `request`: The find request object containing:
  - `tableName`: The name of the table
  - `key`: The primary key of the item

**Returns:**

- A promise that resolves to the found item, or undefined if no item matches

**Throws:**

- `ItemNotFoundError`: If the item is not found
- `ValidationError`: If the request is invalid

##### update

```typescript
async update<T extends EntityRequest & GetItemRequest>(
  request: T
): Promise<Record<string, unknown> | undefined>
```

Updates an item in the table.

**Parameters:**

- `request`: The update request object containing:
  - `tableName`: The name of the table
  - `key`: The primary key of the item
  - `params`: The attributes to update

**Returns:**

- A promise that resolves to the updated item

**Throws:**

- `ItemNotFoundError`: If the item is not found
- `UpdateError`: If the update fails
- `ValidationError`: If the request is invalid

##### delete

```typescript
async delete<T extends EntityRequest & GetItemRequest>(
  request: T
): Promise<EntityKey & { status: string }>
```

Deletes an item from the table.

**Parameters:**

- `request`: The delete request object containing:
  - `tableName`: The name of the table
  - `key`: The primary key of the item

**Returns:**

- A promise that resolves to the deleted item's key and status

**Throws:**

- `DeleteError`: If the deletion fails
- `ValidationError`: If the request is invalid

## Error Handling

The package provides several error classes for different scenarios:

- `DynamoDbError`: Base error class for all DynamoDB operations
- `ItemExistsError`: Thrown when an item already exists
- `ItemNotFoundError`: Thrown when an item is not found
- `QueryError`: Thrown when a query operation fails
- `CreateError`: Thrown when a create operation fails
- `DeleteError`: Thrown when a delete operation fails
- `UpdateError`: Thrown when an update operation fails
- `ValidationError`: Thrown when validation fails
- `ConnectionError`: Thrown when a connection to DynamoDB fails
- `CredentialsError`: Thrown when credentials are invalid
- `PermissionError`: Thrown when a permission is denied
- `RateLimitError`: Thrown when a rate limit is exceeded
- `TimeoutError`: Thrown when a timeout occurs
- `ResourceNotFoundError`: Thrown when a resource is not found
- `ResourceInUseError`: Thrown when a resource is already in use
- `ResourceNotAvailableError`: Thrown when a resource is not available
- `ResourceNotSupportedError`: Thrown when a resource is not supported
- `ResourceNotAuthorizedError`: Thrown when a resource is not authorized

## Logging

The package includes a built-in logger for tracking operations and errors. The logger can be configured using the `LoggerOptions` interface:

```typescript
interface LoggerOptions {
	level: LogLevel
	prefix?: string
	includeTimestamp?: boolean
	includeStack?: boolean
}
```

The logger supports the following log levels:

- `DEBUG`: Detailed information for debugging
- `INFO`: General information about operations
- `WARN`: Warning messages
- `ERROR`: Error messages

## Validation

The package includes several validation utilities for ensuring data integrity:

- `validateRequired`: Validates that a value is not null or undefined
- `validateNonEmptyString`: Validates that a string is not empty
- `validateNumberRange`: Validates that a number is within a range
- `validateType`: Validates that a value is of a specific type
- `validateArray`: Validates that a value is an array
- `validateObject`: Validates that a value is an object
- `validateTableName`: Validates that a value is a valid table name
- `validateKey`: Validates that a value is a valid key
- `validateTimestamp`: Validates that a value is a valid timestamp
- `validateLimit`: Validates that a value is a valid limit
- `validateNextToken`: Validates that a value is a valid next token
- `validateFilterExpression`: Validates that a value is a valid filter expression
- `validateProjectionExpression`: Validates that a value is a valid projection expression
- `validateKeyConditionExpression`: Validates that a value is a valid key condition expression
- `validateUpdateExpression`: Validates that a value is a valid update expression
- `validateConditionExpression`: Validates that a value is a valid condition expression

## Timestamp Management

The package includes several utilities for handling timestamps:

- `convertTimestamp`: Converts a timestamp to a specific timezone and format
- `convertToTimezone`: Converts a timestamp to a specific timezone
- `convertToUTC`: Converts a timestamp to UTC
- `convertToISO`: Converts a timestamp to ISO format
- `convertToUnix`: Converts a timestamp to Unix format
- `getCurrentTimestamp`: Gets the current timestamp in milliseconds
- `getCurrentTimestampSeconds`: Gets the current timestamp in seconds
- `getCurrentTimestampISO`: Gets the current timestamp in ISO format
- `getCurrentTimestampUTC`: Gets the current timestamp in UTC format
- `getCurrentTimestampInTimezone`: Gets the current timestamp in a specific timezone
- `getCurrentTimestampInFormat`: Gets the current timestamp in a specific format
- `getCurrentTimestampInTimezoneAndFormat`: Gets the current timestamp in a specific timezone and format
