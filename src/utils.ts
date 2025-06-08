// AWS SDK imports
import {
	AttributeValue,
	DeleteItemInput,
	GetItemInput,
	PutItemInput,
	QueryInput,
	UpdateItemInput
} from '@aws-sdk/client-dynamodb'

// Third-party imports
import { isEmpty } from 'lodash'

// Internal imports
import {
	PutItemRequest,
	QueryItemRequest,
	DeleteItemRequest,
	GetItemRequest,
	ScanInputRequest,
	Key,
	DynamoKey,
	UpdateItemRequest
} from './types'
import { allReservedWords } from './reserved'

/**
 * Convert a value to DynamoDB AttributeValue
 * @param value The value to convert
 * @returns {AttributeValue} The converted value
 */
export function toAttributeValue(
	value: string | number | boolean | null | undefined | any[] | Record<string, any>
): AttributeValue {
	if (value === undefined || value === null) {
		return { NULL: true }
	}
	if (typeof value === 'string') {
		return { S: value }
	}
	if (typeof value === 'number') {
		return { N: value.toString() }
	}
	if (typeof value === 'boolean') {
		return { BOOL: value }
	}
	if (Array.isArray(value)) {
		return { L: value.map(toAttributeValue) }
	}
	if (typeof value === 'object') {
		const result: Record<string, AttributeValue> = {}
		for (const [k, v] of Object.entries(value)) {
			result[k] = toAttributeValue(v)
		}
		return { M: result }
	}
	throw new Error(`Unsupported type for value: ${value}`)
}

/**
 * Convert a simple key to DynamoDB key
 * @param key The simple key to convert
 * @returns {DynamoKey} The converted DynamoDB key
 */
const toDynamoKey = (key: Key): Record<string, AttributeValue> => {
	return Object.entries(key).reduce((acc, [k, v]) => {
		if (v === undefined) {
			return acc
		}
		if (v === null) {
			return { ...acc, [k]: { NULL: true } }
		}
		if (typeof v === 'string') {
			return { ...acc, [k]: { S: v } }
		}
		if (typeof v === 'number') {
			return { ...acc, [k]: { N: String(v) } }
		}
		if (typeof v === 'boolean') {
			return { ...acc, [k]: { BOOL: v } }
		}
		if (Array.isArray(v)) {
			return { ...acc, [k]: { L: v.map(toAttributeValue) } }
		}
		if (typeof v === 'object') {
			return {
				...acc,
				[k]: {
					M: Object.entries(v).reduce(
						(obj, [key, val]) => ({
							...obj,
							[key]: toAttributeValue(val)
						}),
						{}
					)
				}
			}
		}
		return acc
	}, {})
}

/**
 * Build Put Item Input for Dynamo DB operation
 * @param request
 * @returns {PutItemInput}
 */
export const buildPutInput = ({ tableName, params }: PutItemRequest): PutItemInput => ({
	TableName: tableName,
	Item: Object.entries(params).reduce((acc, [k, v]) => ({ ...acc, [k]: toAttributeValue(v) }), {})
})

/**
 * Build Scan Input for Dynamo DB operation
 * @param {ScanInputRequest} request
 * @returns {ScanInput}
 */
export const buildScanInput = (request: ScanInputRequest) => {
	const options: any = {
		TableName: request.tableName,
		Limit: request.limit || 1000,
		Select: 'ALL_ATTRIBUTES'
	}
	if (request.startKey) {
		options.ExclusiveStartKey = request.startKey
	}

	// Handle projection expressions
	if (request.output) {
		options.ExpressionAttributeNames = {}
		const projection = request.output.map((attr) => {
			const token = `#${attr}`
			options.ExpressionAttributeNames[token] = attr
			return token
		})
		options.ProjectionExpression = projection.join(', ')
	}

	// Handle filter expressions
	if (request.params) {
		options.ExpressionAttributeValues = {}
		const filterExpressions: string[] = []

		// Initialize ExpressionAttributeNames if not already done
		if (!options.ExpressionAttributeNames) {
			options.ExpressionAttributeNames = {}
		}

		Object.entries(request.params).forEach(([attr, value], index) => {
			const token = `#${attr}`
			const filter = `:${attr.charAt(0)}${index}`

			options.ExpressionAttributeNames[token] = attr

			if (value !== undefined) {
				if (Array.isArray(value)) {
					filterExpressions.push(`contains(${token}, ${filter})`)
					options.ExpressionAttributeValues[filter] = toAttributeValue(value[0])
				} else if (typeof value === 'string' || typeof value === 'number') {
					filterExpressions.push(`${token} = ${filter}`)
					options.ExpressionAttributeValues[filter] = toAttributeValue(value)
				}
			}
		})

		if (filterExpressions.length > 0) {
			const filterExpressionContext = request.options?.filterExpressionContext || 'And'
			options.FilterExpression = filterExpressions.join(` ${filterExpressionContext} `)
		}
	}

	return options
}

/**
 * Build Update Item Input for Dynamo DB operation
 * @param request
 */
export function buildUpdateInput(request: UpdateItemRequest): UpdateItemInput {
	validateTableName(request.tableName)
	if (request.key) {
		validateKey(request.key)
	}
	if (request.params) {
		validateObject(request.params, 'Params')
	}

	const ts = Date.now()
	validateTimestamp(ts)

	const params = {
		...request.params,
		updatedAt: ts
	}

	const names: Record<string, string> = {}
	const values: Record<string, AttributeValue> = {}
	const expressions: string[] = []

	Object.entries(params).forEach(([key, value], index) => {
		const nameKey = `#${key}`
		const valueKey = `:${key.charAt(0)}${index}`
		names[nameKey] = key
		values[valueKey] = toAttributeValue(value)
		expressions.push(`${nameKey} = ${valueKey}`)
	})

	return {
		TableName: request.tableName,
		Key: request.key,
		ReturnValues: 'ALL_NEW',
		ExpressionAttributeNames: names,
		ExpressionAttributeValues: values,
		UpdateExpression: `SET ${expressions.join(', ')}`
	}
}

/**
 * Build Query Item Input for dynamodb
 * @param {QueryItemRequest} request
 * @returns {QueryInput}
 */
export const buildQueryInput = (request: QueryItemRequest): QueryInput => {
	const options: QueryInput = {
		TableName: request.tableName,
		IndexName: request.indexName,
		ExpressionAttributeValues: {},
		ConsistentRead: true
	}
	if (request.limit) {
		options.Limit = request.limit
	}
	if (request.nextToken) {
		options.ExclusiveStartKey = request.nextToken
	}
	const keyExpressions: string[] = []
	const paramAttrs: string[] = Object.keys(request.params)

	const expressionNames: any = {}

	paramAttrs.forEach((attr: string) => {
		let filter: string = `:${attr.charAt(0)}`
		if (options.ExpressionAttributeValues.hasOwnProperty(filter)) {
			filter = `:${attr.charAt(0)}${attr.charAt(1)}`
		}
		const value = request.params[attr]
		options.ExpressionAttributeValues[filter] = toAttributeValue(value)

		const isReservedWord = allReservedWords.includes(attr as any)
		let token = attr
		if (isReservedWord) {
			token = `#${attr}`
			expressionNames[token] = attr
		}
		keyExpressions.push(`${token} = ${filter}`)
	})
	if (!isEmpty(expressionNames)) {
		options.ExpressionAttributeNames = expressionNames
	}
	options.KeyConditionExpression = keyExpressions.join(' and ')
	return options
}

/**
 * Build Delete Item Input for dynamodb
 * @param {DeleteItemRequest} request
 * @returns {DeleteItemInput}
 */
export const buildDeleteInput = (request: DeleteItemRequest): DeleteItemInput => ({
	TableName: request.tableName,
	Key: request.key
})

/**
 * Build Get Item Input for dynamodb
 * @param {GetItemRequest} request
 * @returns {GetItemInput}
 */
export const buildGetInput = (request: GetItemRequest): GetItemInput => ({
	TableName: request.tableName,
	Key: request.key
})

/**
 * Build key input for dynamodb
 * @param {string|number} key
 * @returns {Record<string, AttributeValue>}
 */
export const keyInput = (key: string | number): Record<string, AttributeValue> => ({
	id: toAttributeValue(key)
})

function validateTableName(tableName: string | undefined): void {
	if (!tableName) {
		throw new Error('TableName is required')
	}
}

function validateKey(key: Record<string, any>): void {
	if (!key || Object.keys(key).length === 0) {
		throw new Error('Key is required and must not be empty')
	}
}

function validateObject(obj: Record<string, any>, name: string): void {
	if (!obj || Object.keys(obj).length === 0) {
		throw new Error(`${name} is required and must not be empty`)
	}
}

function validateTimestamp(ts: number): void {
	if (!ts || isNaN(ts)) {
		throw new Error('Invalid timestamp')
	}
}
