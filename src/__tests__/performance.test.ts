import { DynamoDb } from '../DynamoDb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { performance } from 'perf_hooks'
import { describe, it, expect, beforeEach } from '@jest/globals'
import {
	QueryCommand,
	PutCommand,
	UpdateCommand,
	DeleteCommand,
	GetCommand
} from '@aws-sdk/lib-dynamodb'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { toAttributeValue, keyInput } from '../utils'

const TEST_TABLE = 'test-table'
const TEST_ID = '123'
const TEST_KEY = { id: { S: TEST_ID } }
const TEST_ITEM = {
	id: { S: TEST_ID },
	name: { S: 'test' },
	value: { N: '42' }
}

const ddbMock = mockClient(DynamoDBClient)

describe('DynamoDB Performance Tests', () => {
	let dynamoDb: DynamoDb

	beforeEach(() => {
		dynamoDb = new DynamoDb({
			region: 'us-east-1',
			endpoint: 'http://localhost:8000',
			credentials: {
				accessKeyId: 'test',
				secretAccessKey: 'test'
			}
		})
		ddbMock.reset()
		ddbMock.on(QueryCommand).resolves({
			Items: [TEST_ITEM],
			$metadata: {}
		})
		ddbMock.on(PutCommand).resolves({
			$metadata: {}
		})
		ddbMock.on(UpdateCommand).resolves({
			Attributes: TEST_ITEM,
			$metadata: {}
		})
		ddbMock.on(DeleteCommand).resolves({
			$metadata: {}
		})
		ddbMock.on(GetCommand).resolves({
			Item: TEST_ITEM,
			$metadata: {}
		})
	})

	describe('Query Performance', () => {
		it('should perform query operations within acceptable time limits', async () => {
			const start = performance.now()

			const result = await dynamoDb.query({
				tableName: TEST_TABLE,
				key: TEST_KEY,
				params: {
					':id': TEST_KEY.id
				},
				query: {
					KeyConditionExpression: 'id = :id',
					ExpressionAttributeValues: {
						':id': TEST_KEY.id
					}
				}
			})

			const end = performance.now()
			const duration = end - start

			// Query should complete within 100ms
			expect(duration).toBeLessThan(100)
			expect(result).toHaveLength(1)
			expect(result[0]).toEqual(TEST_ITEM)
		})

		it('should handle paginated queries efficiently', async () => {
			const start = performance.now()

			const result = await dynamoDb.queryWithPagination({
				tableName: TEST_TABLE,
				key: TEST_KEY,
				params: {
					':id': TEST_KEY.id
				},
				query: {
					KeyConditionExpression: 'id = :id',
					ExpressionAttributeValues: {
						':id': TEST_KEY.id
					}
				},
				limit: 100
			})

			const end = performance.now()
			const duration = end - start

			// Paginated query should complete within 200ms
			expect(duration).toBeLessThan(200)
			expect(result.items).toHaveLength(100)
			expect(result.nextToken).toEqual(TEST_KEY)
		})
	})

	describe('Create Performance', () => {
		it('should perform create operations within acceptable time limits', async () => {
			const start = performance.now()

			const result = await dynamoDb.create({
				tableName: TEST_TABLE,
				key: TEST_KEY,
				params: TEST_ITEM,
				createdAt: Date.now()
			})

			const end = performance.now()
			const duration = end - start

			// Create should complete within 100ms
			expect(duration).toBeLessThan(100)
			expect(result).toEqual(TEST_ITEM)
		})
	})

	describe('Update Performance', () => {
		it('should perform update operations within acceptable time limits', async () => {
			const start = performance.now()

			const result = await dynamoDb.update({
				tableName: TEST_TABLE,
				key: TEST_KEY,
				params: {
					UpdateExpression: 'SET updated = :updated',
					ExpressionAttributeValues: {
						':updated': { BOOL: true }
					}
				}
			})

			const end = performance.now()
			const duration = end - start

			// Update should complete within 100ms
			expect(duration).toBeLessThan(100)
			expect(result).toEqual(TEST_ITEM)
		})
	})

	describe('Delete Performance', () => {
		it('should perform delete operations within acceptable time limits', async () => {
			const start = performance.now()

			const result = await dynamoDb.delete({
				tableName: TEST_TABLE,
				key: TEST_KEY
			})

			const end = performance.now()
			const duration = end - start

			// Delete should complete within 100ms
			expect(duration).toBeLessThan(100)
			expect(result).toEqual({
				key: JSON.stringify(TEST_KEY),
				status: 'deleted'
			})
		})
	})

	describe('Batch Operations Performance', () => {
		it('should handle multiple operations efficiently', async () => {
			const start = performance.now()

			// Perform multiple operations
			const results = await Promise.all([
				dynamoDb.create({
					tableName: TEST_TABLE,
					key: TEST_KEY,
					params: TEST_ITEM,
					createdAt: Date.now()
				}),
				dynamoDb.query({
					tableName: TEST_TABLE,
					key: TEST_KEY,
					params: {
						':id': TEST_KEY.id
					},
					query: {
						KeyConditionExpression: 'id = :id',
						ExpressionAttributeValues: {
							':id': TEST_KEY.id
						}
					}
				}),
				dynamoDb.update({
					tableName: TEST_TABLE,
					key: TEST_KEY,
					params: {
						UpdateExpression: 'SET updated = :updated',
						ExpressionAttributeValues: {
							':updated': { BOOL: true }
						}
					}
				}),
				dynamoDb.delete({
					tableName: TEST_TABLE,
					key: TEST_KEY
				})
			])

			const end = performance.now()
			const duration = end - start

			// Batch operations should complete within 400ms
			expect(duration).toBeLessThan(400)
			expect(results).toHaveLength(4)
		})
	})
})
