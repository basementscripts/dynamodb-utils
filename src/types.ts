import { AttributeValue, PutItemInput, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'

export interface DynamoDbOptions extends DynamoDBClientConfig {
	// Add any additional options specific to our implementation
	region?: string
	endpoint?: string
	credentials?: {
		accessKeyId: string
		secretAccessKey: string
	}
}

// Internal type for DynamoDB attribute values
export interface DynamoKey {
	[index: string]: AttributeValue
}

// Public interface for DynamoDB key values
export type Key = Record<string, AttributeValue>

// Alias for Key type used in entity operations
export type EntityKey = Key

export interface DynamoTable {
	attributes: Record<string, unknown>
	readCapacity?: number
	writeCapacity?: number
}

export interface Identifier {
	id?: string
}

export interface Service {
	service?: string
}

export interface TableOperation {
	tableName: string
	indexName?: string
}

export interface IndexOption {
	pk?: string
}

export interface QueryRequest {
	query?: Record<string, unknown>
}

export interface PartitionKey {
	key?: Key
}

export interface ParamRequest {
	params?: Record<string, unknown>
}

export interface FilteredRequest {
	filters?: string[]
}

export interface PageableRequest {
	limit?: number
	nextToken?: Key
}

export interface ListOutput {
	output?: string[]
}

export interface DynamoItemInput extends PutItemInput, Resource {}

export interface Resource extends Identifier, Service {}

export interface TableConfiguration extends TableOperation, IndexOption, DynamoTable {}

export interface PutItemRequest {
	tableName: string
	params: Record<string, any>
}

export interface UpdateItemRequest {
	tableName: string
	key: Record<string, any>
	params: Record<string, any>
}

export interface GetItemRequest extends TableOperation, PartitionKey {}

export interface DeleteItemRequest extends TableOperation, PartitionKey {}

export interface QueryItemRequest
	extends TableOperation,
		QueryRequest,
		ParamRequest,
		PageableRequest,
		FilteredRequest,
		ListOutput {}

export interface GetItemsRequest
	extends TableOperation,
		ParamRequest,
		FilteredRequest,
		ListOutput {}

export interface ScanInputRequestOptions {
	filterExpressionContext?: 'And' | 'Or'
}

export interface ScanInputRequest {
	tableName?: string
	startKey?: string
	limit?: number
	params?: Record<string, unknown>
	output?: string[]
	options?: ScanInputRequestOptions
}

export interface DynamoRequest {
	tableName?: string
	params?: Record<string, unknown>
	output?: string[]
}

export interface EntityRequest {
	tableName: string
	key?: Key
	params?: Record<string, unknown>
	updatedAt?: number
}

export interface KeyedEntityRequest {
	tableName: string
	key: Key
	params?: Record<string, unknown>
}

export interface QueryEntityRequest {
	tableName: string
	params: Record<string, unknown>
	output?: string[]
}

export interface CreateEntityRequest extends EntityRequest {
	createdAt?: number
}
