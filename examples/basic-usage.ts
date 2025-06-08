import { DynamoDb } from '../src/dynamodb'
import { DynamoDbOptions, EntityKey, Key } from '../src/types'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

// Initialize the DynamoDB client
const options: DynamoDbOptions = {
	region: 'us-east-1',
	credentials: {
		accessKeyId: 'YOUR_ACCESS_KEY_ID',
		secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
	}
}

const dynamoDb = new DynamoDb(options)

// Example 1: Create a new item
async function createItem() {
	try {
		const item = await dynamoDb.create({
			tableName: 'Users',
			key: {
				key: 'user123',
				sort: 'profile'
			} as EntityKey,
			params: {
				name: 'John Doe',
				email: 'john@example.com',
				age: 30
			}
		})
		console.log('Created item:', item)
	} catch (e) {
		console.error('Failed to create item:', e)
	}
}

// Example 2: Query items
async function queryItems() {
	try {
		const items = await dynamoDb.query({
			tableName: 'Users',
			query: {
				age: 30
			},
			limit: 10
		})
		console.log('Query results:', items)
	} catch (e) {
		console.error('Failed to query items:', e)
	}
}

// Example 3: Find a specific item
async function findItem() {
	try {
		const item = await dynamoDb.findRecord({
			tableName: 'Users',
			key: {
				key: 'user123',
				sort: 'profile'
			} as EntityKey
		})
		console.log('Found item:', item)
	} catch (e) {
		console.error('Failed to find item:', e)
	}
}

// Example 4: Update an item
async function updateItem() {
	try {
		const updatedItem = await dynamoDb.update({
			tableName: 'Users',
			key: {
				key: 'user123',
				sort: 'profile'
			} as EntityKey,
			params: {
				age: 31,
				lastUpdated: '2024-03-20'
			}
		})
		console.log('Updated item:', updatedItem)
	} catch (e) {
		console.error('Failed to update item:', e)
	}
}

// Example 5: Delete an item
async function deleteItem() {
	try {
		const result = await dynamoDb.delete({
			tableName: 'Users',
			key: {
				key: 'user123',
				sort: 'profile'
			} as EntityKey
		})
		console.log('Deleted item:', result)
	} catch (e) {
		console.error('Failed to delete item:', e)
	}
}

// Example 6: Query with filters
async function queryWithFilters() {
	try {
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
		console.log('Filtered query results:', items)
	} catch (e) {
		console.error('Failed to query with filters:', e)
	}
}

// Example 7: Query with pagination
async function queryWithPagination() {
	try {
		const items = await dynamoDb.query({
			tableName: 'Users',
			query: {
				age: 30
			},
			limit: 10,
			nextToken: {
				key: { S: 'user123' },
				sort: { S: 'profile' }
			} as Key
		})
		console.log('Paginated query results:', items)
	} catch (e) {
		console.error('Failed to query with pagination:', e)
	}
}

// Example 8: Query with projection
async function queryWithProjection() {
	try {
		const items = await dynamoDb.query({
			tableName: 'Users',
			query: {
				age: 30
			},
			output: ['name', 'email'],
			limit: 10
		})
		console.log('Projected query results:', items)
	} catch (e) {
		console.error('Failed to query with projection:', e)
	}
}

// Example 9: Query with key condition
async function queryWithKeyCondition() {
	try {
		const items = await dynamoDb.query({
			tableName: 'Users',
			query: {
				age: 30
			},
			key: {
				key: 'user123',
				sort: 'profile'
			} as EntityKey,
			limit: 10
		})
		console.log('Key condition query results:', items)
	} catch (e) {
		console.error('Failed to query with key condition:', e)
	}
}

// Example 10: Query with update condition
async function queryWithUpdateCondition() {
	try {
		const items = await dynamoDb.query({
			tableName: 'Users',
			query: {
				age: 30
			},
			key: {
				key: 'user123',
				sort: 'profile'
			} as EntityKey,
			params: {
				':age': 30
			},
			limit: 10
		})
		console.log('Update condition query results:', items)
	} catch (e) {
		console.error('Failed to query with update condition:', e)
	}
}

// Run the examples
async function runExamples() {
	await createItem()
	await queryItems()
	await findItem()
	await updateItem()
	await deleteItem()
	await queryWithFilters()
	await queryWithPagination()
	await queryWithProjection()
	await queryWithKeyCondition()
	await queryWithUpdateCondition()
}

runExamples().catch(console.error)
