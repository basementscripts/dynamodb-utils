// AWS SDK imports
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand
} from '@aws-sdk/lib-dynamodb'

// Internal utility imports
import {
	buildUpdateInput,
	buildQueryInput,
	buildGetInput,
	buildPutInput,
	buildDeleteInput
} from './utils'
import { Logger } from './utils/logger'
import {
	validateTableName,
	validateKey,
	validateTimestamp,
	validateLimit,
	validateNextToken,
	validateFilterExpression,
	validateProjectionExpression,
	validateKeyConditionExpression,
	validateUpdateExpression,
	validateConditionExpression,
	validateObject
} from './utils/validation'

// Type imports
import {
	QueryItemRequest,
	GetItemRequest,
	EntityRequest,
	CreateEntityRequest,
	DynamoDbOptions,
	Key,
	KeyedEntityRequest
} from './types'

// Error imports
import {
	ItemExistsError,
	ItemNotFoundError,
	QueryError,
	CreateError,
	DeleteError,
	UpdateError,
	ConnectionError,
	CredentialsError,
	PermissionError,
	RateLimitError,
	TimeoutError,
	ResourceNotFoundError,
	ResourceInUseError,
	ResourceNotAvailableError,
	ResourceNotSupportedError,
	ResourceNotAuthorizedError
} from './errors'

/**
 * A class that provides a high-level interface for interacting with Amazon DynamoDB
 * @class
 * @example
 * const dynamoDb = new DynamoDb({
 *   region: 'us-east-1',
 *   credentials: {
 *     accessKeyId: 'YOUR_ACCESS_KEY',
 *     secretAccessKey: 'YOUR_SECRET_KEY'
 *   }
 * })
 */
export class DynamoDb {
	/**
	 * DynamoDB Document Client instance
	 * @type {DynamoDBDocumentClient}
	 * @private
	 */
	private client: DynamoDBDocumentClient

	/**
	 * Logger instance for tracking operations
	 * @type {Logger}
	 * @private
	 */
	private logger: Logger

	/**
	 * Creates a new DynamoDb instance
	 * @param {DynamoDbOptions} [options={}] - Configuration options for the DynamoDB client
	 * @param {string} [options.region] - AWS region
	 * @param {string} [options.endpoint] - Custom endpoint URL
	 * @param {Object} [options.credentials] - AWS credentials
	 * @param {string} options.credentials.accessKeyId - AWS access key ID
	 * @param {string} options.credentials.secretAccessKey - AWS secret access key
	 * @throws {CredentialsError} If credentials are invalid
	 * @throws {PermissionError} If permissions are insufficient
	 * @throws {TimeoutError} If connection times out
	 * @throws {ResourceNotFoundError} If resources are not found
	 * @throws {ConnectionError} If connection fails
	 */
	constructor(private options: DynamoDbOptions = {}) {
		this.logger = new Logger()
		try {
			// set the dynamodb client
			const dynamodb = new DynamoDBClient(this.options)
			this.client = DynamoDBDocumentClient.from(dynamodb)
			this.logger.info('DynamoDB client initialized')
		} catch (e) {
			if (e instanceof Error) {
				if (e.message.includes('credentials')) {
					throw new CredentialsError(e.message)
				}
				if (e.message.includes('permission')) {
					throw new PermissionError(e.message)
				}
				if (e.message.includes('timeout')) {
					throw new TimeoutError(e.message)
				}
				if (e.message.includes('resource')) {
					throw new ResourceNotFoundError(e.message)
				}
				throw new ConnectionError(e.message)
			}
			throw new ConnectionError('Failed to initialize DynamoDB client')
		}
	}

	/**
	 * Queries a DynamoDB table using the specified parameters
	 * @param {T} request - The query request parameters
	 * @param {string} request.tableName - The name of the table to query
	 * @param {Key} [request.key] - The key to query with
	 * @param {number} [request.limit] - Maximum number of items to return
	 * @param {Key} [request.nextToken] - The key to start querying from
	 * @param {string[]} [request.filters] - Filter expressions to apply
	 * @param {string[]} [request.output] - Attributes to return in the result
	 * @param {Record<string, unknown>} [request.query] - Query conditions
	 * @returns {Promise<Record<string, unknown>[]>} Array of items matching the query
	 * @throws {QueryError} If the query operation fails
	 * @example
	 * const results = await dynamoDb.query({
	 *   tableName: 'Users',
	 *   key: { id: '123' },
	 *   limit: 10,
	 *   filters: ['age > :age'],
	 *   output: ['name', 'email']
	 * })
	 */
	public async query<T extends EntityRequest & QueryItemRequest>(
		request: T
	): Promise<Record<string, unknown>[]> {
		try {
			validateTableName(request.tableName)
			if (request.key) {
				validateKey(request.key)
			}
			if (request.limit) {
				validateLimit(request.limit)
			}
			if (request.nextToken) {
				validateNextToken(request.nextToken)
			}
			if (request.filters) {
				request.filters.forEach(validateFilterExpression)
			}
			if (request.output) {
				request.output.forEach(validateProjectionExpression)
			}
			if (request.query) {
				validateKeyConditionExpression(JSON.stringify(request.query))
			}

			this.logger.debug(`Querying table ${request.tableName}`)
			const cmd = new QueryCommand(buildQueryInput(request))
			const results = await this.client.send(cmd)
			this.logger.info(`Query completed for table ${request.tableName}`)
			return results.Items || []
		} catch (e) {
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new QueryError(e.message))
				throw new QueryError(e.message)
			}
			this.logger.logDynamoDbError(new QueryError('Failed to query table'))
			throw new QueryError('Failed to query table')
		}
	}

	/**
	 * Queries a DynamoDB table and returns the first matching item
	 * @param {T} request - The query request parameters
	 * @param {string} request.tableName - The name of the table to query
	 * @param {Key} [request.key] - The key to query with
	 * @param {string[]} [request.output] - Attributes to return in the result
	 * @param {Record<string, unknown>} [request.query] - Query conditions
	 * @returns {Promise<Record<string, unknown> | undefined>} The first matching item or undefined
	 * @throws {QueryError} If the query operation fails
	 * @example
	 * const user = await dynamoDb.queryRecord({
	 *   tableName: 'Users',
	 *   key: { id: '123' }
	 * })
	 */
	public async queryRecord<T extends EntityRequest & QueryItemRequest>(
		request: T
	): Promise<Record<string, unknown> | undefined> {
		try {
			validateTableName(request.tableName)
			if (request.key) {
				validateKey(request.key)
			}
			if (request.output) {
				request.output.forEach(validateProjectionExpression)
			}
			if (request.query) {
				validateKeyConditionExpression(JSON.stringify(request.query))
			}

			this.logger.debug(`Querying single record from table ${request.tableName}`)
			// Optimize for single record query by using GetItem instead of Query
			if (request.key && !request.query && !request.filters) {
				const getRequest: GetItemRequest = {
					tableName: request.tableName,
					key: request.key
				}
				const cmd = new GetCommand(buildGetInput(getRequest))
				const result = await this.client.send(cmd)
				this.logger.info(`Get record completed for table ${request.tableName}`)
				return result.Item
			}

			// Fall back to Query with limit 1 if we need to use query conditions
			const queryRequest = {
				...request,
				limit: 1
			}
			const cmd = new QueryCommand(buildQueryInput(queryRequest))
			const results = await this.client.send(cmd)
			this.logger.info(`Query record completed for table ${request.tableName}`)
			return results.Items?.[0]
		} catch (e) {
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new QueryError(e.message))
				throw new QueryError(e.message)
			}
			this.logger.logDynamoDbError(new QueryError('Failed to query record'))
			throw new QueryError('Failed to query record')
		}
	}

	/**
	 * Queries a DynamoDB table with pagination
	 * @param {T} request - The query request parameters
	 * @param {string} request.tableName - The name of the table to query
	 * @param {Key} [request.key] - The key to query with
	 * @param {number} [request.limit] - Maximum number of items to return per page
	 * @param {Key} [request.nextToken] - The key to start querying from
	 * @param {string[]} [request.filters] - Filter expressions to apply
	 * @param {string[]} [request.output] - Attributes to return in the result
	 * @param {Record<string, unknown>} [request.query] - Query conditions
	 * @returns {Promise<{ items: Record<string, unknown>[], nextToken?: Key }>} Paginated results
	 * @throws {QueryError} If the query operation fails
	 * @example
	 * const { items, nextToken } = await dynamoDb.queryWithPagination({
	 *   tableName: 'Users',
	 *   limit: 10
	 * })
	 */
	public async queryWithPagination<T extends EntityRequest & QueryItemRequest>(
		request: T
	): Promise<{ items: Record<string, unknown>[]; nextToken?: Key }> {
		try {
			validateTableName(request.tableName)
			if (request.key) {
				validateKey(request.key)
			}
			if (request.limit) {
				validateLimit(request.limit)
			}
			if (request.nextToken) {
				validateNextToken(request.nextToken)
			}
			if (request.filters) {
				request.filters.forEach(validateFilterExpression)
			}
			if (request.output) {
				request.output.forEach(validateProjectionExpression)
			}
			if (request.query) {
				validateKeyConditionExpression(JSON.stringify(request.query))
			}

			this.logger.debug(`Querying table ${request.tableName} with pagination`)
			const cmd = new QueryCommand(buildQueryInput(request))
			const results = await this.client.send(cmd)
			this.logger.info(`Query with pagination completed for table ${request.tableName}`)
			return {
				items: results.Items || [],
				nextToken: results.LastEvaluatedKey
			}
		} catch (e) {
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new QueryError(e.message))
				throw new QueryError(e.message)
			}
			this.logger.logDynamoDbError(new QueryError('Failed to query table with pagination'))
			throw new QueryError('Failed to query table with pagination')
		}
	}

	/**
	 * Creates a new item in a DynamoDB table
	 * @param {T} request - The create request parameters
	 * @param {string} request.tableName - The name of the table to create the item in
	 * @param {Key} [request.key] - The key for the new item
	 * @param {Record<string, unknown>} request.params - The attributes for the new item
	 * @returns {Promise<Record<string, unknown>>} The created item
	 * @throws {ItemExistsError} If an item with the same key already exists
	 * @throws {CreateError} If the create operation fails
	 * @example
	 * const user = await dynamoDb.create({
	 *   tableName: 'Users',
	 *   key: { id: '123' },
	 *   params: { name: 'John', age: 25 }
	 * })
	 */
	public async create<T extends CreateEntityRequest & QueryItemRequest>(
		request: T
	): Promise<Record<string, unknown>> {
		try {
			validateTableName(request.tableName)
			if (request.key) {
				validateKey(request.key)
			}
			if (request.params) {
				validateObject(request.params, 'Params')
			}

			// Only check for item existence if a key is provided
			if (request.key) {
				try {
					const found = await this.findRecord({
						tableName: request.tableName,
						key: request.key
					})
					if (found) {
						throw new ItemExistsError(request.tableName, request.key)
					}
				} catch (e) {
					// If the error is ItemExistsError, rethrow it
					if (e instanceof ItemExistsError) {
						throw e
					}
					// Otherwise, continue with creation
				}
			}

			const ts = Date.now()
			validateTimestamp(ts)
			const options = {
				tableName: request.tableName,
				key: request.key,
				params: {
					...request.params,
					...request.key, // Include key in params for PutCommand
					createdAt: ts,
					updatedAt: ts
				}
			}

			this.logger.debug(`Creating item in table ${request.tableName}`)
			const cmd = new PutCommand(buildPutInput(options))
			await this.client.send(cmd)
			this.logger.info(`Item created in table ${request.tableName}`)
			return options.params
		} catch (e) {
			if (e instanceof ItemExistsError) {
				this.logger.logDynamoDbError(e)
				throw e
			}
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new CreateError(e.message))
				throw new CreateError(e.message)
			}
			this.logger.logDynamoDbError(new CreateError('Failed to create item'))
			throw new CreateError('Failed to create item')
		}
	}

	/**
	 * Finds a single item in a DynamoDB table by its key
	 * @param {T} request - The find request parameters
	 * @param {string} request.tableName - The name of the table to find the item in
	 * @param {Key} request.key - The key of the item to find
	 * @returns {Promise<Record<string, unknown> | undefined>} The found item or undefined
	 * @throws {ItemNotFoundError} If the item is not found
	 * @example
	 * const user = await dynamoDb.findRecord({
	 *   tableName: 'Users',
	 *   key: { id: '123' }
	 * })
	 */
	public async findRecord<T extends EntityRequest & GetItemRequest>(
		request: T
	): Promise<Record<string, unknown> | undefined> {
		try {
			validateTableName(request.tableName)
			if (request.key) {
				validateKey(request.key)
			}

			this.logger.debug(`Finding record in table ${request.tableName}`)
			const cmd = new GetCommand(buildGetInput(request))
			const results = await this.client.send(cmd)
			this.logger.info(`Find record completed for table ${request.tableName}`)
			return results.Item
		} catch (e) {
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new ItemNotFoundError(request.tableName, request.key || {}))
				throw new ItemNotFoundError(request.tableName, request.key || {})
			}
			this.logger.logDynamoDbError(new ItemNotFoundError(request.tableName, request.key || {}))
			throw new ItemNotFoundError(request.tableName, request.key || {})
		}
	}

	/**
	 * Deletes an item from a DynamoDB table
	 * @param {T} request - The delete request parameters
	 * @param {string} request.tableName - The name of the table to delete the item from
	 * @param {Key} request.key - The key of the item to delete
	 * @returns {Promise<{ key: string; status: string }>} The deleted item's key and status
	 * @throws {DeleteError} If the delete operation fails
	 * @example
	 * const result = await dynamoDb.delete({
	 *   tableName: 'Users',
	 *   key: { id: '123' }
	 * })
	 */
	public async delete<T extends EntityRequest & GetItemRequest>(
		request: T
	): Promise<{ key: string; status: string }> {
		try {
			validateTableName(request.tableName)
			if (request.key) {
				validateKey(request.key)
			}

			this.logger.debug(`Deleting item from table ${request.tableName}`)
			const cmd = new DeleteCommand(buildDeleteInput(request))
			await this.client.send(cmd)
			this.logger.info(`Item deleted from table ${request.tableName}`)
			return {
				key: request.key?.id?.S || '',
				status: 'deleted'
			}
		} catch (e) {
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new DeleteError(e.message))
				throw new DeleteError(e.message)
			}
			this.logger.logDynamoDbError(new DeleteError('Failed to delete item'))
			throw new DeleteError('Failed to delete item')
		}
	}

	/**
	 * Updates an item in a DynamoDB table
	 * @param {T} request - The update request parameters
	 * @param {string} request.tableName - The name of the table to update the item in
	 * @param {Key} request.key - The key of the item to update
	 * @param {Record<string, unknown>} request.params - The attributes to update
	 * @returns {Promise<Record<string, unknown> | undefined>} The updated item
	 * @throws {ItemNotFoundError} If the item is not found
	 * @throws {UpdateError} If the update operation fails
	 * @example
	 * const user = await dynamoDb.update({
	 *   tableName: 'Users',
	 *   key: { id: '123' },
	 *   params: { name: 'John', age: 26 }
	 * })
	 */
	public async update<T extends KeyedEntityRequest & GetItemRequest>(
		request: T
	): Promise<Record<string, unknown> | undefined> {
		try {
			validateTableName(request.tableName)
			validateKey(request.key)
			if (!request.params) {
				throw new UpdateError('Update params are required')
			}
			validateObject(request.params, 'Params')

			this.logger.debug(`Updating record in table ${request.tableName}`)
			const cmd = new UpdateCommand(
				buildUpdateInput({
					tableName: request.tableName,
					key: request.key,
					params: request.params
				})
			)
			const result = await this.client.send(cmd)
			this.logger.info(`Update completed for table ${request.tableName}`)
			return result.Attributes
		} catch (e) {
			if (e instanceof Error) {
				this.logger.logDynamoDbError(new UpdateError(e.message))
				throw new UpdateError(e.message)
			}
			this.logger.logDynamoDbError(new UpdateError('Failed to update record'))
			throw new UpdateError('Failed to update record')
		}
	}
}
