import { describe, expect, test } from '@jest/globals'
import {
	buildPutInput,
	buildScanInput,
	buildUpdateInput,
	buildQueryInput,
	buildDeleteInput,
	buildGetInput,
	keyInput
} from '../utils'
import type {
	DeleteItemRequest,
	GetItemRequest,
	PutItemRequest,
	QueryItemRequest,
	ScanInputRequest
} from '../types'

describe('buildPutInput', () => {
	test('should return PutItemInput with correct properties', () => {
		const request: PutItemRequest = {
			tableName: 'test',
			params: {
				id: '123',
				name: 'John Doe'
			}
		}

		const result = buildPutInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Item: {
				id: '123',
				name: 'John Doe'
			}
		})
	})
})

describe('buildScanInput', () => {
	test('should return ScanInput with correct properties', () => {
		const request: ScanInputRequest = {
			tableName: 'test',
			limit: 1000,
			startKey: 'start-key',
			params: {
				name: 'John Doe',
				age: 25
			},
			output: ['email']
		}

		const result = buildScanInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Limit: 1000,
			Select: 'ALL_ATTRIBUTES',
			ExclusiveStartKey: 'start-key',
			ExpressionAttributeNames: {
				'#name': 'name',
				'#age': 'age'
			},
			ExpressionAttributeValues: {
				':n': 'John Doe',
				':a': 25
			},
			FilterExpression: '#name = :n, #age = :a'
		})
	})
})

describe('buildUpdateInput', () => {
	test('should return UpdateItemInput with correct properties', () => {
		const request = {
			tableName: 'test',
			key: { id: '123' },
			params: {
				name: 'John Doe',
				age: 25
			}
		}

		const result = buildUpdateInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: { id: '123' },
			ReturnValues: 'ALL_NEW',
			ExpressionAttributeValues: {
				':n': 'John Doe',
				':a': 25
			},
			ExpressionAttributeNames: {
				'#name': 'name'
			},
			UpdateExpression: 'SET #name = :n, age = :a'
		})
	})
})

describe('buildQueryInput', () => {
	test('should return QueryInput with correct properties', () => {
		const request: QueryItemRequest = {
			tableName: 'test',
			indexName: 'test',
			limit: 10,
			nextToken: { id: 'next-token' } as any,
			params: {
				name: 'John Doe',
				age: 25
			}
		}

		const result = buildQueryInput(request)

		expect(result).toEqual({
			TableName: 'test',
			IndexName: 'test',
			Limit: 10,
			ConsistentRead: true,
			ExclusiveStartKey: { id: 'next-token' },
			ExpressionAttributeValues: {
				':n': 'John Doe',
				':a': 25
			},
			ExpressionAttributeNames: {
				'#name': 'name'
			},
			KeyConditionExpression: '#name = :n and age = :a'
		})
	})
})

describe('buildDeleteInput', () => {
	test('should return DeleteItemInput with correct properties', () => {
		const request: DeleteItemRequest = {
			tableName: 'test',
			key: { id: '123' } as any
		}

		const result = buildDeleteInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: { id: '123' }
		})
	})
})

describe('buildGetInput', () => {
	test('should return GetItemInput with correct properties', () => {
		const request: GetItemRequest = {
			tableName: 'test',
			key: { id: '123' } as any
		}

		const result = buildGetInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: { id: '123' }
		})
	})
})

describe('keyInput', () => {
	test('should return Record<string, AttributeValue> with correct properties', () => {
		const key = '123'

		const result = keyInput(key)

		expect(result).toEqual({ id: '123' })
	})
})
