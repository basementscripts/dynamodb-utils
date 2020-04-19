import * as AWS from 'aws-sdk';
import {
  DocumentClient,
  QueryOutput,
  GetItemOutput,
  DeleteItemOutput
} from 'aws-sdk/clients/dynamodb';
import {
  buildUpdateInput,
  buildQueryInput,
  buildGetInput,
  buildPutInput,
  buildDeleteInput
} from './utils';
import {
  QueryItemRequest,
  GetItemRequest,
  EntityRequest,
  CreateEntityRequest
} from './types';

export class DynamoDb {
  private client: DocumentClient;

  constructor(private tableName: string, private options: any) {
    this.configure();
  }

  private configure() {
    AWS.config.update({
      region: this.options.region || 'local-dev'
    });
    this.client = new DocumentClient(this.options);
  }
  /**
   * Query the Users table by attribute and return the first item
   * @param {EntityRequest} request
   */
  public async queryRecord<T extends EntityRequest & QueryItemRequest>(
    request: T
  ): Promise<any> {
    const [record] = await this.query(request);
    return record;
  }
  /**
   * Query the table by attributes
   * @param {EntityRequest} request
   */
  public async query<T extends EntityRequest & QueryItemRequest>(
    request: T
  ): Promise<any[]> {
    try {
      const options: QueryItemRequest = {
        ...request,
        tableName: this.tableName
      };
      const results = await this.client
        .query(buildQueryInput(options))
        .promise();
      return results.Items;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  /**
   * Create a new user
   * @param {CreateEntityRequest} request
   */
  public async create<T extends CreateEntityRequest & QueryItemRequest>(
    request: T
  ): Promise<any> {
    try {
      // check to see if user exists in table, if so throw
      const found = await this.query(request);
      if (found) {
        throw new Error(`${this.tableName} Exists!`);
      }
      const ts = Date.now();
      const options = {
        tableName: this.tableName,
        key: request.key,
        params: {
          ...request.params,
          createdAt: ts,
          updatedAt: ts
        }
      };
      // Put the Item into DynamoDb
      await this.client.put(buildPutInput(options)).promise();
      return options.params;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  /**
   * Find Entity Item
   * @param {EntityRequest} request
   */
  public async findRecord<T extends EntityRequest & GetItemRequest>(
    request: T
  ): Promise<any> {
    try {
      const results = await this.client.get(buildGetInput(request)).promise();
      return results.Item;
    } catch (e) {
      throw new Error(e.message);
    }
  }
  /**
   * Delete Entity Item
   * @param {EntityRequest} request
   */
  public async delete<T extends EntityRequest & GetItemRequest>(
    request: T
  ): Promise<any> {
    try {
      const options = {
        tableName: this.tableName,
        ...request
      };
      return await this.client.delete(buildDeleteInput(options)).promise();
    } catch (e) {
      throw new Error(e.message);
    }
  }
  /**
   * Update DynamoDB Entity Item
   * @param {EntityRequest} request
   */
  public async update<T extends EntityRequest & GetItemRequest>(
    request: T
  ): Promise<any> {
    try {
      const item = await this.findRecord(request);
      if (!item) {
        throw new Error(`${this.tableName} does not exist`);
      }
      const options: EntityRequest = {
        ...request,
        tableName: this.tableName,
        updatedAt: Date.now()
      };
      const results = await this.client
        .update(buildUpdateInput(options))
        .promise();
      return results.Attributes;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
