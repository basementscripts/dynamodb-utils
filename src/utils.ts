import {
  PutItemRequest,
  QueryItemRequest,
  DeleteItemRequest,
  GetItemRequest,
  ScanInputRequest
} from './types'
import {
  PutItemInput,
  ScanInput,
  UpdateItemInput,
  QueryInput,
  DeleteItemInput,
  GetItemInput,
  Key,
  PutItemInputAttributeMap
} from 'aws-sdk/clients/dynamodb'
import reservedWords from './reserved'
import { isEmpty } from 'lodash'

/**
 * Build Put Item Input for Dynamo DB operation
 * @param request
 * @returns {PutItemInput}
 */
export const buildPutInput = (request: PutItemRequest): PutItemInput => ({
  TableName: request.tableName,
  Item: request.params as PutItemInputAttributeMap
})
/**
 * Build Scan Input for Dynamo DB operation
 * @param {any} request
 * @returns {ScanInput}
 */
export const buildScanInput = (request: ScanInputRequest) => {
  const options: any = {
    TableName: request.tableName,
    Limit: request.limit || 1000,
    Select: 'ALL_ATTRIBUTES'
  }
  if (request.startKey) {
    options.ExclusiveStartKey = request.startKey
  }
  // create projection collections
  const projection: string[] = []
  // if request has params map
  if (request.params) {
    // get the param attribute names
    const paramAttrs: string[] = Object.keys(request.params)
    // create the filter express collection
    const filterExpressions: string[] = []
    // define the Expression Context
    options.ExpressionAttributeNames = {}
    options.ExpressionAttributeValues = {}
    // loop through the attributes and format the request
    paramAttrs.forEach((attr: string) => {
      // create token string
      const token: string = `#${attr}`
      // push the token to the projection
      projection.push(token)
      // create filter string
      let filter: string = `:${attr.charAt(0)}`
      // check to see if the expression attributes already include filter
      if (options.ExpressionAttributeValues.hasOwnProperty(filter)) {
        filter = `:${attr.charAt(0)}${attr.charAt(1)}`
      }
      // add attribute to expressions
      options.ExpressionAttributeNames[token] = attr
      // set value cache
      const value = request.params[attr]
      if (value) {
        if (Array.isArray(value)) {
          filterExpressions.push(`contains(${token}, ${filter})`)
          options.ExpressionAttributeValues[filter] = value[0]
        } else if (typeof value === 'string') {
          filterExpressions.push(`${attr} = ${filter}`)
          options.ExpressionAttributeValues[filter] = value
        } else if (typeof value === 'object') {
          // TODO: conditional scan
        }
      }
    })
    // set the filter expression
    options.FilterExpression = filterExpressions.join(', ')
  }
  // check to see if there are different projection attributes
  if (request.output) {
    const output = request.output.filter((x) => !request.params[x])
    projection.push(...output)
  }
  // set the project expression
  if (projection.length && options.Select !== 'ALL_ATTRIBUTES') {
    options.ProjectionExpression = projection.join(', ')
  }
  // return the ScanInput
  console.log(options)
  return options
}
// export const buildScanInput = (request: any): ScanInput => {
//   const options: ScanInput = {
//     TableName: request.tableName,
//   }
//   const paramAttrs: string[] = Object.keys(request.params)
//   const projection: string[] = []
//   const filterExpressions: string[] = []

//   paramAttrs.forEach((attr: string) => {
//     const token: string = `#${attr}`
//     const filter: string = `:${attr.charAt(0)}`
//     projection.push(token)
//     options.ExpressionAttributeNames[token] = attr
//     const value = request.params[attr]
//     if (value) {
//       filterExpressions.push(`${attr} = ${filter}`)
//       options.ExpressionAttributeValues[filter] = value
//     }
//   })
//   if (request.output) {
//     const output = request.output.filter((x) => !request.params[x])
//     projection.push(...output)
//   }
//   options.ProjectionExpression = projection.join(', ')
//   options.FilterExpression = filterExpressions.join(', ')

//   return options
// }
/**
 * Build Update Item Input for Dynamo DB operation
 * @param request
 */
// export const buildUpdateInput = (request: any): UpdateItemInput => {
//   const options: UpdateItemInput = {
//     TableName: request.tableName,
//     Key: request.key,
//     ReturnValues: 'ALL_NEW'
//   };
//   const updateExpressions: string[] = [];
//   const paramAttrs: string[] = Object.keys(request.params);

//   paramAttrs.forEach((attr: string) => {
//     const filter: string = `:${attr.charAt(0)}`;
//     options.ExpressionAttributeValues[filter] = request.params[attr];
//     updateExpressions.push(`${attr} = ${filter}`);
//   });
//   const expressions = updateExpressions.join(', ');
//   options.UpdateExpression = `SET #${expressions}`;

//   return options;
// };
export const buildUpdateInput = (request: any): UpdateItemInput => {
  const options: any = {
    TableName: request.tableName,
    Key: request.key,
    ReturnValues: 'ALL_NEW',
    ExpressionAttributeValues: {},
    UpdateExpression: ''
  }
  const updateExpressions: string[] = []
  const paramAttrs: string[] = Object.keys(request.params)
  const expressionNames: any = {}

  paramAttrs.forEach((attr: string) => {
    let filter: string = `:${attr.charAt(0)}`
    if (options.ExpressionAttributeValues.hasOwnProperty(filter)) {
      filter = `:${attr.charAt(0)}${attr.charAt(1)}`
    }
    options.ExpressionAttributeValues[filter] = request.params[attr]
    const isReservedWord = reservedWords.includes(attr)
    let token = attr
    if (isReservedWord) {
      token = `#${attr}`
      expressionNames[token] = attr
    }
    updateExpressions.push(`${token} = ${filter}`)
  })
  if (!isEmpty(expressionNames)) {
    options.ExpressionAttributeNames = expressionNames
  }
  const expressions = updateExpressions.join(', ')
  options.UpdateExpression = `SET ${expressions}`

  return options
}
/**
 * Build Query Item Input for dynamodb
 * @param {DeleteItemRequest} request
 * @param {string} request.tableName
 * @param {string} request.key
 * @returns {DeleteItemInput}
 */
export const buildQueryInput = (request: QueryItemRequest): QueryInput => {
  const options: QueryInput = {
    TableName: request.tableName,
    IndexName: request.indexName,
    ExpressionAttributeValues: {}
  }
  if (request.limit) {
    options.Limit = request.limit
  }
  if (request.nextToken) {
    options.ExclusiveStartKey = request.nextToken
  }
  const keyExpressions: string[] = []
  const paramAttrs: string[] = Object.keys(request.params)

  const expressionNames: any = {}

  paramAttrs.forEach((attr: string) => {
    const filter: string = `:${attr}`
    options.ExpressionAttributeValues[filter] = request.params[attr]

    const isReservedWord = reservedWords.includes(attr)
    let token = attr
    if (isReservedWord) {
      token = `#${attr}`
      expressionNames[token] = attr
    }
    keyExpressions.push(`${token} = ${filter}`)
  })
  if (!isEmpty(expressionNames)) {
    options.ExpressionAttributeNames = expressionNames
  }
  options.KeyConditionExpression = keyExpressions.join(' and ')
  return options
}
/**
 * Build Delete Item Input for dynamodb
 * @param {DeleteItemRequest} request
 * @param {string} request.tableName
 * @param {string} request.key
 * @returns {DeleteItemInput}
 */
// export const buildDeleteInput = (
//   request: DeleteItemRequest
// ): DeleteItemInput => ({
//   TableName: request.tableName,
//   Key: keyInput(request.key),
// })
export const buildDeleteInput = (
  request: DeleteItemRequest
): DeleteItemInput => ({
  TableName: request.tableName,
  Key: request.key
})
/**
 * Build Get Item Input for dynamodb
 * @param {GetItemRequest} request
 * @param {string} request.tableName
 * @param {string} request.key
 * @returns {DeleteItemInput}
 */
export const buildGetInput = (request: GetItemRequest): GetItemInput => ({
  TableName: request.tableName,
  Key: request.key
})
/**
 *
 * @param {string|number} key
 */
export const keyInput = (key): Key => ({
  id: key
})
