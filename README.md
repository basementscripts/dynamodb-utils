# `@basementscripts/dynamodb-utils`

![Coverage badge](./coverage/badge.svg)

```
{
    "access": "public",
    "level": "beginner",
    "maxCapacity": 1000,
    "description": "Some cool class that burns some calories",
    "calories": 240,
    "type": "d2a64fb4-ee55-4f5f-9553-debe943ec35f",
    "uri": "kMOOsHYm0gJ",
    "duration": 60,
    "intensity": "moderate",
    "createdAt": 1587498636863,
    "instructor": "7489022c-3a87-4873-a9a2-9188b39af2ec",
    "name": "Acro 101",
    "id": "ec0b0de2-9515-4832-8d32-2b8de592bc69",
    "categories": [
        "379b8d3c-d6e5-4c3d-a450-243d0806cb0b",
        "b2c7ea80-3da9-4c4c-984a-2ba85ff88123"
    ],
    "account": "3ea5714d-b346-444f-8841-403ea7568e04",
    "status": "unpublished",
    "updatedAt": 1587498636863
}
```

## Query

```
const schema: QueryInputRequest = {
  tableName: 'Classes',
  indexName: 'ClassByTypeIndex',
  params: {
    type: 'd2a64fb4-ee55-4f5f-9553-debe943ec35f'
  }
}

```

## Scan

```
const schema: ScanInputRequest = {
  tableName: 'Classes',
  params: {
    categories: ['379b8d3c-d6e5-4c3d-a450-243d0806cb0b]
  }
}

```

```
{
  "params": {
    "N": 9,
    "S": "ec0b0de2-9515-4832-8d32-2b8de592bc69",
    "SS": ["ec0b0de2-9515-4832-8d32-2b8de592bc69"],
    "BOOL": true
  }
}

```

# DynamoDb Class Documentation

The `DynamoDb` class is a wrapper around the AWS SDK for DynamoDB. It provides methods to interact with a DynamoDB table, such as querying, creating, finding, updating, and deleting items.

## Importing the DynamoDB Client

To use the `DynamoDb` class, you need to import the necessary modules from the AWS SDK:

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand
} from '@aws-sdk/lib-dynamodb'
```

## Constructor

### Signature

```typescript
constructor(options: any = {})
```

### Parameters

- `options` (optional): An object containing options for configuring the DynamoDB client.

### Description

The constructor initializes the `DynamoDb` class by creating an instance of the `DynamoDBClient` and setting it as the client for the `DynamoDBDocumentClient`.

## Methods

### query

#### Signature

```typescript
public async query<T extends EntityRequest & QueryItemRequest>(request: T): Promise<any>
```

#### Parameters

- `request`: An object that represents the query request. It should implement the `EntityRequest` and `QueryItemRequest` interfaces.

#### Return Value

A promise that resolves to an array of items returned by the query.

#### Description

This method queries the DynamoDB table based on the provided attributes in the `request` object. It uses the `buildQueryInput` function from the `utils` module to build the query input parameters. The method then sends the query command to the DynamoDB client and returns the items returned by the query.

### queryRecord

#### Signature

```typescript
public async queryRecord<T extends EntityRequest & QueryItemRequest>(request: T): Promise<any>
```

#### Parameters

- `request`: An object that represents the query request. It should implement the `EntityRequest` and `QueryItemRequest` interfaces.

#### Return Value

A promise that resolves to the first item returned by the query.

#### Description

This method is similar to the `query` method, but it only returns the first item returned by the query. It calls the `query` method internally and returns the first item from the array of items returned by the query.

### create

#### Signature

```typescript
public async create<T extends CreateEntityRequest & QueryItemRequest>(request: T): Promise<any>
```

#### Parameters

- `request`: An object that represents the create request. It should implement the `CreateEntityRequest` and `QueryItemRequest` interfaces.

#### Return Value

A promise that resolves to the created item.

#### Description

This method creates a new item in the DynamoDB table. It first checks if the item already exists in the table by calling the `queryRecord` method. If the item exists, it throws an error. Otherwise, it sets the `createdAt` and `updatedAt` attributes of the item to the current timestamp and uses the `buildPutInput` function from the `utils` module to build the put input parameters. The method then sends the put command to the DynamoDB client and returns the created item.

### findRecord

#### Signature

```typescript
public async findRecord<T extends EntityRequest & GetItemRequest>(request: T): Promise<any>
```

#### Parameters

- `request`: An object that represents the find request. It should implement the `EntityRequest` and `GetItemRequest` interfaces.

#### Return Value

A promise that resolves to the found item.

#### Description

This method finds an item in the DynamoDB table based on the provided key attributes in the `request` object. It uses the `buildGetInput` function from the `utils` module to build the get input parameters. The method then sends the get command to the DynamoDB client and returns the found item.

### delete

#### Signature

```typescript
public async delete<T extends EntityRequest & GetItemRequest>(request: T): Promise<any>
```

#### Parameters

- `request`: An object that represents the delete request. It should implement the `EntityRequest` and `GetItemRequest` interfaces.

#### Return Value

A promise that resolves to an object containing the deleted item's key attributes and a status of 'deleted'.

#### Description

This method deletes an item from the DynamoDB table based on the provided key attributes in the `request` object. It uses the `buildDeleteInput` function from the `utils` module to build the delete input parameters. The method then sends the delete command to the DynamoDB client and returns an object containing the deleted item's key attributes and a status of 'deleted'.

### update

#### Signature

```typescript
public async update<T extends EntityRequest & GetItemRequest>(request: T): Promise<any>
```

#### Parameters

- `request`: An object that represents the update request. It should implement the `EntityRequest` and `GetItemRequest` interfaces.

#### Return Value

A promise that resolves to the updated item.

#### Description

This method updates an item in the DynamoDB table based on the provided key attributes in the `request` object. It first finds the item by calling the `findRecord` method. If the item does not exist, it throws an error. Otherwise, it sets the `updatedAt` attribute of the item to the current timestamp and uses the `buildUpdateInput` function from the `utils` module to build the update input parameters. The method then sends the update command to the DynamoDB client and returns the updated item.

## Conclusion

The `DynamoDb` class provides a convenient way to interact with a DynamoDB table using the AWS SDK. It encapsulates the logic for querying, creating, finding, updating, and deleting items in the table. By using this class, you can easily perform CRUD operations on your DynamoDB table in your application.
