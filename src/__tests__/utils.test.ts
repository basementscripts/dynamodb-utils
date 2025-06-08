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
	ScanInputRequest,
	UpdateItemRequest,
	Key
} from '../types'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

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
				id: { S: '123' },
				name: { S: 'John Doe' }
			}
		})
	})

	test('should handle complex data types', () => {
		const request: PutItemRequest = {
			tableName: 'test',
			params: {
				id: '123',
				numbers: [1, 2, 3],
				nested: {
					name: 'John',
					age: 25
				},
				boolean: true,
				null: null
			}
		}

		const result = buildPutInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Item: {
				id: { S: '123' },
				numbers: { L: [{ N: '1' }, { N: '2' }, { N: '3' }] },
				nested: {
					M: {
						name: { S: 'John' },
						age: { N: '25' }
					}
				},
				boolean: { BOOL: true },
				null: { NULL: true }
			}
		})
	})
})

describe('buildScanInput', () => {
	test('should return ScanInput with correct properties', () => {
		const request: ScanInputRequest = {
			tableName: 'test',
			limit: 1000,
			params: {
				name: 'John Doe',
				age: 25
			}
		}

		const result = buildScanInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Limit: 1000,
			Select: 'ALL_ATTRIBUTES',
			ExpressionAttributeNames: {
				'#name': 'name',
				'#age': 'age'
			},
			ExpressionAttributeValues: {
				':n0': { S: 'John Doe' },
				':a1': { N: '25' }
			},
			FilterExpression: '#name = :n0 And #age = :a1'
		})
	})

	test('should handle array values', () => {
		const request: ScanInputRequest = {
			tableName: 'test',
			params: {
				tags: ['tag1', 'tag2']
			}
		}

		const result = buildScanInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Limit: 1000,
			Select: 'ALL_ATTRIBUTES',
			ExpressionAttributeNames: {
				'#tags': 'tags'
			},
			ExpressionAttributeValues: {
				':t0': { S: 'tag1' }
			},
			FilterExpression: 'contains(#tags, :t0)'
		})
	})

	test('should handle projection expressions', () => {
		const request: ScanInputRequest = {
			tableName: 'test',
			output: ['name', 'email']
		}

		const result = buildScanInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Limit: 1000,
			Select: 'ALL_ATTRIBUTES',
			ProjectionExpression: '#name, #email',
			ExpressionAttributeNames: {
				'#name': 'name',
				'#email': 'email'
			}
		})
	})
})

describe('buildUpdateInput', () => {
	test('should return UpdateItemInput with correct properties', () => {
		const request: UpdateItemRequest = {
			tableName: 'test',
			key: { id: { S: '123' } },
			params: {
				name: 'John Doe',
				age: 25
			}
		}

		const result = buildUpdateInput(request)
		const expected = {
			TableName: 'test',
			Key: { id: { S: '123' } },
			ReturnValues: 'ALL_NEW',
			ExpressionAttributeNames: {
				'#name': 'name',
				'#age': 'age',
				'#updatedAt': 'updatedAt'
			},
			ExpressionAttributeValues: {
				':n0': { S: 'John Doe' },
				':a1': { N: '25' },
				':u2': { N: expect.any(String) }
			},
			UpdateExpression: 'SET #name = :n0, #age = :a1, #updatedAt = :u2'
		}

		expect(result).toEqual(expected)
	})

	test('should handle complex data types', () => {
		const request: UpdateItemRequest = {
			tableName: 'test',
			key: { id: { S: '123' } },
			params: {
				numbers: [1, 2, 3],
				nested: { name: 'John', age: 25 },
				boolean: true,
				null: null
			}
		}

		const result = buildUpdateInput(request)
		const expected = {
			TableName: 'test',
			Key: { id: { S: '123' } },
			ReturnValues: 'ALL_NEW',
			ExpressionAttributeNames: {
				'#numbers': 'numbers',
				'#nested': 'nested',
				'#boolean': 'boolean',
				'#null': 'null',
				'#updatedAt': 'updatedAt'
			},
			ExpressionAttributeValues: {
				':n0': { L: [{ N: '1' }, { N: '2' }, { N: '3' }] },
				':n1': { M: { name: { S: 'John' }, age: { N: '25' } } },
				':b2': { BOOL: true },
				':n3': { NULL: true },
				':u4': { N: expect.any(String) }
			},
			UpdateExpression:
				'SET #numbers = :n0, #nested = :n1, #boolean = :b2, #null = :n3, #updatedAt = :u4'
		}

		expect(result).toEqual(expected)
	})
})

describe('buildQueryInput', () => {
	test('should return QueryInput with correct properties', () => {
		const request: QueryItemRequest = {
			tableName: 'test',
			indexName: 'test',
			limit: 10,
			nextToken: { id: { S: 'next-token' } },
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
			ExclusiveStartKey: { id: { S: 'next-token' } },
			ExpressionAttributeValues: {
				':n': { S: 'John Doe' },
				':a': { N: '25' }
			},
			KeyConditionExpression: 'name = :n and age = :a'
		})
	})

	test('should handle reserved words', () => {
		const request: QueryItemRequest = {
			tableName: 'test',
			params: {
				select: 'value',
				from: 'table'
			}
		}

		const result = buildQueryInput(request)

		expect(result).toEqual({
			TableName: 'test',
			ConsistentRead: true,
			ExpressionAttributeNames: {
				'#select': 'select',
				'#from': 'from'
			},
			ExpressionAttributeValues: {
				':s': { S: 'value' },
				':f': { S: 'table' }
			},
			KeyConditionExpression: '#select = :s and #from = :f'
		})
	})
})

describe('buildDeleteInput', () => {
	test('should return DeleteItemInput with correct properties', () => {
		const request: DeleteItemRequest = {
			tableName: 'test',
			key: { id: { S: '123' } }
		}

		const result = buildDeleteInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: { id: { S: '123' } }
		})
	})

	test('should handle complex keys', () => {
		const request: DeleteItemRequest = {
			tableName: 'test',
			key: {
				id: { S: '123' },
				sort: { S: '456' }
			}
		}

		const result = buildDeleteInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: {
				id: { S: '123' },
				sort: { S: '456' }
			}
		})
	})
})

describe('buildGetInput', () => {
	test('should return GetItemInput with correct properties', () => {
		const request: GetItemRequest = {
			tableName: 'test',
			key: { id: { S: '123' } }
		}

		const result = buildGetInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: { id: { S: '123' } }
		})
	})

	test('should handle complex keys', () => {
		const request: GetItemRequest = {
			tableName: 'test',
			key: {
				id: { S: '123' },
				sort: { S: '456' }
			}
		}

		const result = buildGetInput(request)

		expect(result).toEqual({
			TableName: 'test',
			Key: {
				id: { S: '123' },
				sort: { S: '456' }
			}
		})
	})
})

describe('keyInput', () => {
	test('should handle string keys', () => {
		const key = '123'
		const result = keyInput(key)
		expect(result).toEqual({ id: { S: '123' } })
	})

	test('should handle number keys', () => {
		const key = 123
		const result = keyInput(key)
		expect(result).toEqual({ id: { N: '123' } })
	})
})
