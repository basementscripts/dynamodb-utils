/**
 * Base error class for DynamoDB operations
 */
export class DynamoDbError extends Error {
	constructor(message: string, public readonly operation: string) {
		super(message)
		this.name = 'DynamoDbError'
	}
}

/**
 * Error thrown when an item already exists
 */
export class ItemExistsError extends DynamoDbError {
	constructor(tableName: string, key: Record<string, unknown>) {
		super(`Item already exists in table ${tableName} with key ${JSON.stringify(key)}`, 'create')
		this.name = 'ItemExistsError'
	}
}

/**
 * Error thrown when an item is not found
 */
export class ItemNotFoundError extends DynamoDbError {
	constructor(tableName: string, key: Record<string, unknown>) {
		super(`Item not found in table ${tableName} with key ${JSON.stringify(key)}`, 'find')
		this.name = 'ItemNotFoundError'
	}
}

/**
 * Error thrown when a query operation fails
 */
export class QueryError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'query')
		this.name = 'QueryError'
	}
}

/**
 * Error thrown when a create operation fails
 */
export class CreateError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'create')
		this.name = 'CreateError'
	}
}

/**
 * Error thrown when a delete operation fails
 */
export class DeleteError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'delete')
		this.name = 'DeleteError'
	}
}

/**
 * Error thrown when an update operation fails
 */
export class UpdateError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'update')
		this.name = 'UpdateError'
	}
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'validation')
		this.name = 'ValidationError'
	}
}

/**
 * Error thrown when a table operation fails
 */
export class TableOperationError extends DynamoDbError {
	constructor(message: string, operation: string) {
		super(message, operation)
		this.name = 'TableOperationError'
	}
}

/**
 * Error thrown when a connection to DynamoDB fails
 */
export class ConnectionError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'connection')
		this.name = 'ConnectionError'
	}
}

/**
 * Error thrown when credentials are invalid
 */
export class CredentialsError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'credentials')
		this.name = 'CredentialsError'
	}
}

/**
 * Error thrown when a permission is denied
 */
export class PermissionError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'permission')
		this.name = 'PermissionError'
	}
}

/**
 * Error thrown when a rate limit is exceeded
 */
export class RateLimitError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'rateLimit')
		this.name = 'RateLimitError'
	}
}

/**
 * Error thrown when a timeout occurs
 */
export class TimeoutError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'timeout')
		this.name = 'TimeoutError'
	}
}

/**
 * Error thrown when a resource is not found
 */
export class ResourceNotFoundError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'resource')
		this.name = 'ResourceNotFoundError'
	}
}

/**
 * Error thrown when a resource is already in use
 */
export class ResourceInUseError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'resource')
		this.name = 'ResourceInUseError'
	}
}

/**
 * Error thrown when a resource is not available
 */
export class ResourceNotAvailableError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'resource')
		this.name = 'ResourceNotAvailableError'
	}
}

/**
 * Error thrown when a resource is not supported
 */
export class ResourceNotSupportedError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'resource')
		this.name = 'ResourceNotSupportedError'
	}
}

/**
 * Error thrown when a resource is not authorized
 */
export class ResourceNotAuthorizedError extends DynamoDbError {
	constructor(message: string) {
		super(message, 'resource')
		this.name = 'ResourceNotAuthorizedError'
	}
}
