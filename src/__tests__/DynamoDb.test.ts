import { beforeEach, describe, expect, test } from '@jest/globals'
import { mockClient } from 'aws-sdk-client-mock'
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import { DynamoDb } from '../DynamoDb'
import {
	ItemExistsError,
	ItemNotFoundError,
	QueryError,
	CreateError,
	DeleteError,
	UpdateError
} from '../errors'
import { EntityKey, Key, KeyedEntityRequest, QueryEntityRequest } from '../types'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

// CONSTANTS
const TABLE = 'test'
const EMAIL = 'user@test.com'

// Helper function to create DynamoDB attribute values
const toAttributeValue = (value: string | number | boolean): AttributeValue => {
	if (typeof value === 'string') return { S: value }
	if (typeof value === 'number') return { N: String(value) }
	if (typeof value === 'boolean') return { BOOL: value }
	throw new Error(`Unsupported value type: ${typeof value}`)
}

describe('DynamoDb', () => {
	const ddbMock = mockClient(DynamoDBDocumentClient)

	const db = new DynamoDb({ region: 'us-east-1' })

	beforeEach(() => {
		ddbMock.reset()
	})

	const items: any = [
		{ id: '1ce7c08e-6c41-4a49-9a10-705c23748669', email: EMAIL },
		{ id: 'a61c255e-d004-4878-aba6-094c3d247d5c', email: EMAIL }
	]

	describe('queryRecord', () => {
		test('should return a single item', async () => {
			ddbMock.on(QueryCommand).resolves({
				Items: items
			})

			const record = await db.queryRecord({
				tableName: TABLE,
				params: {
					email: EMAIL
				}
			} as QueryEntityRequest)
			expect(record.id).toEqual(items[0].id)
		})

		test('should handle query errors', async () => {
			ddbMock.on(QueryCommand).rejects(new Error('Query failed'))

			await expect(
				db.queryRecord({
					tableName: TABLE,
					params: {
						email: EMAIL
					}
				} as QueryEntityRequest)
			).rejects.toThrow(QueryError)
		})
	})

	describe('query', () => {
		test('should return a list of items', async () => {
			ddbMock.on(QueryCommand).resolves({
				Items: items
			})
			const results = await db.query({
				tableName: TABLE,
				params: {
					email: EMAIL
				}
			} as QueryEntityRequest)
			expect(results).toStrictEqual(items)
		})

		test('should handle query errors', async () => {
			ddbMock.on(QueryCommand).rejects(new Error('Query failed'))

			await expect(
				db.query({
					tableName: TABLE,
					params: {
						email: EMAIL
					}
				} as QueryEntityRequest)
			).rejects.toThrow(QueryError)
		})
	})

	describe('create', () => {
		test('should create a new item', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			ddbMock.on(QueryCommand).resolves({
				Items: []
			})
			ddbMock.on(PutCommand).resolves({
				ConsumedCapacity: {
					CapacityUnits: 1,
					TableName: TABLE
				}
			})
			const record = await db.create({
				tableName: TABLE,
				key: {
					id: toAttributeValue(id)
				},
				params: {
					id,
					email: EMAIL
				}
			} as KeyedEntityRequest)
			expect(record.email).toEqual(EMAIL)
			expect(record).toHaveProperty('createdAt')
			expect(record).toHaveProperty('updatedAt')
		})

		test('should throw ItemExistsError if item already exists', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			const key = { id: { S: id } }

			// Mock the findRecord response to indicate item exists
			ddbMock.on(GetCommand).resolves({
				Item: {
					id: { S: id },
					email: { S: 'test@test.com' }
				}
			})

			await expect(
				db.create({
					tableName: TABLE,
					key,
					params: {
						email: 'new@test.com'
					}
				})
			).rejects.toThrow(ItemExistsError)
		})
	})

	describe('findRecord', () => {
		test('should return a single item', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			ddbMock.on(GetCommand).resolves({
				Item: { id, email: EMAIL }
			})
			const record = await db.findRecord({
				tableName: TABLE,
				key: {
					id: toAttributeValue(id)
				}
			} as KeyedEntityRequest)
			expect(record.email).toEqual(EMAIL)
		})

		test('should return undefined if item not found', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			ddbMock.on(GetCommand).resolves({
				Item: undefined
			})

			const record = await db.findRecord({
				tableName: TABLE,
				key: {
					id: toAttributeValue(id)
				}
			} as KeyedEntityRequest)

			expect(record).toBeUndefined()
		})
	})

	describe('update', () => {
		test('should update an item', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			const email = 'user1@test.com'
			ddbMock.on(GetCommand).resolves({
				Item: { id, email: EMAIL }
			})
			ddbMock.on(UpdateCommand).resolves({
				Attributes: {
					id,
					email
				}
			})
			const record = await db.update({
				tableName: TABLE,
				key: {
					id: toAttributeValue(id)
				},
				params: {
					email
				}
			} as KeyedEntityRequest)
			expect(record.email).toEqual(email)
		})

		test('should handle update errors', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			ddbMock.on(UpdateCommand).rejects(new Error('Update failed'))

			await expect(
				db.update({
					tableName: TABLE,
					key: {
						id: toAttributeValue(id)
					},
					params: {
						email: 'new@test.com'
					}
				} as KeyedEntityRequest)
			).rejects.toThrow(UpdateError)
		})
	})

	describe('delete', () => {
		test('should delete an item', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			ddbMock.on(DeleteCommand).resolves({
				ConsumedCapacity: {
					CapacityUnits: 1,
					TableName: TABLE
				}
			})

			const record = await db.delete({
				tableName: TABLE,
				key: {
					id: toAttributeValue(id)
				}
			} as KeyedEntityRequest)
			expect(record).toEqual({
				key: id,
				status: 'deleted'
			})
		})

		test('should handle delete errors', async () => {
			const id = 'caf9afcf-aeac-4ef2-afdc-cf5a30307c24'
			ddbMock.on(DeleteCommand).rejects(new Error('Delete failed'))

			await expect(
				db.delete({
					tableName: TABLE,
					key: {
						id: toAttributeValue(id)
					}
				} as KeyedEntityRequest)
			).rejects.toThrow(DeleteError)
		})
	})
})
