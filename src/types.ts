import { PutItemInput } from 'aws-sdk/clients/dynamodb'

export type DynamoTable = {
    attributes: any
    readCapacity?: number
    writeCapacity?: number
}

export type Identifier = {
    id: string
}

export type Service = {
    service: string
}

export type TableOperation = {
    tableName: string
    index?: string
}

export type IndexOption = {
    pk?: string
}

export type QueryRequest = {
    query?: object
}

export type PartitionKey = {
    key: string
}

export type ParamRequest = {
    params: object
}

export type FilteredRequest = {
    filters?: string[]
}

export type ListOutput = {
    output?: string[]
}

export type DynamoItemInput = PutItemInput & Resource
export type Resource = Identifier & Service
export type TableConfiguration = TableOperation & IndexOption & DynamoTable
export type PutItemRequest = TableOperation & ParamRequest
export type GetItemRequest = TableOperation & PartitionKey
export type DeleteItemRequest = TableOperation & PartitionKey
export type QueryItemRequest = TableOperation & QueryRequest & ParamRequest
export type GetItemsRequest  = TableOperation & ParamRequest & FilteredRequest & ListOutput

export type DynamoRequest = {
    tableName: string
    params: any
    output?: string[]
}
