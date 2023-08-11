import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import {
	buildUpdateInput,
	buildQueryInput,
	buildGetInput,
	buildPutInput,
	buildDeleteInput
} from './utils'
import { QueryItemRequest, GetItemRequest, EntityRequest, CreateEntityRequest } from './types'

export class DynamoDb {
	/**
	 * DynamoDB Client
	 * @type {DynamoDBDocumentClient}
	 * @private
	 */
	private client: DynamoDBDocumentClient

	constructor(private options: any = {}) {
		// set the dynamodb client
		const dynamodb = new DynamoDBClient(this.options)
		this.client = DynamoDBDocumentClient.from(dynamodb)
	}

	/**
	 * Query the table by attributes
	 * @param {EntityRequest} request
	 */
	public async query<T extends EntityRequest & QueryItemRequest>(request: T): Promise<any> {
		try {
			const cmd = new QueryCommand(buildQueryInput(request))
			const results = await this.client.send(cmd)
			return results.Items
		} catch (e) {
			throw new Error(e.message)
		}
	}

	/**
	 * Query the Users table by attribute and return the first item
	 * @param {EntityRequest} request
	 */
	public async queryRecord<T extends EntityRequest & QueryItemRequest>(request: T): Promise<any> {
		const [record] = await this.query(request)
		return record
	}

	/**
	 * Create a new user
	 * @param {CreateEntityRequest} request
	 */
	public async create<T extends CreateEntityRequest & QueryItemRequest>(request: T): Promise<any> {
		try {
			// check to see if user exists in table, if so throw
			const found = await this.queryRecord(request)
			if (found) {
				throw new Error(`AlreadyExists!`)
			}
			const ts = Date.now()
			const options = {
				tableName: request.tableName,
				key: request.key,
				params: {
					...request.params,
					createdAt: ts,
					updatedAt: ts
				}
			}

			const cmd = new PutCommand(buildPutInput(options))
			// Put the Item into DynamoDb
			await this.client.send(cmd)
			return options.params
		} catch (e) {
			throw new Error(e.message)
		}
	}

	/**
	 * Find Entity Item
	 * @param {EntityRequest} request
	 */
	public async findRecord<T extends EntityRequest & GetItemRequest>(request: T): Promise<any> {
		try {
			const cmd = new GetCommand(buildGetInput(request))
			const results = await this.client.send(cmd)
			return results.Item
		} catch (e) {
			throw new Error(e.message)
		}
	}

	/**
	 * Delete Entity Item
	 * @param {EntityRequest} request
	 */
	public async delete<T extends EntityRequest & GetItemRequest>(request: T): Promise<any> {
		try {
			const cmd = new DeleteCommand(buildDeleteInput(request))
			await this.client.send(cmd)
			return {
				...request.key,
				status: 'deleted'
			}
		} catch (e) {
			throw new Error(e.message)
		}
	}

	/**
	 * Update DynamoDB Entity Item
	 * @param {EntityRequest} request
	 */
	public async update<T extends EntityRequest & GetItemRequest>(request: T): Promise<any> {
		try {
			const item = await this.findRecord(request)
			if (!item) {
				throw new Error(`NotExist`)
			}
			const options: EntityRequest = {
				...request,
				updatedAt: Date.now()
			}
			const cmd = new UpdateCommand(buildUpdateInput(options))
			const results = await this.client.send(cmd)
			return results.Attributes
		} catch (e) {
			throw new Error(e.message)
		}
	}
}
