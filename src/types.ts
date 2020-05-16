import { PutItemInput, Key } from 'aws-sdk/clients/dynamodb'

export interface DynamoTable {
  attributes: any
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
  query?: object
}
export interface PartitionKey {
  // [key: string]: string
  key?: Key
}
export interface ParamRequest {
  params: object
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
export interface TableConfiguration
  extends TableOperation,
    IndexOption,
    DynamoTable {}
export interface PutItemRequest extends TableOperation, ParamRequest {}
export interface GetItemRequest extends TableOperation, PartitionKey {}
export interface DeleteItemRequest extends TableOperation, PartitionKey {}
export interface QueryItemRequest
  extends TableOperation,
    QueryRequest,
    ParamRequest,
    PageableRequest {}
export interface GetItemsRequest
  extends TableOperation,
    ParamRequest,
    FilteredRequest,
    ListOutput {}

export interface ScanInputRequest {
  tableName?: string
  startKey?: string
  limit?: number
  params?: any
  output?: string[]
}

export interface DynamoRequest {
  tableName?: string
  params?: any
  output?: string[]
}

export interface EntityRequest {
  tableName: string
  key: EntityKey
  params?: any
  updatedAt?: number
}
export interface CreateEntityRequest extends EntityRequest {
  createdAt?: number
}
export interface EntityKey {
  key?: string
  sort?: string
}
