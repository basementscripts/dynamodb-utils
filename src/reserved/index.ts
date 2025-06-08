import { sqlKeywords, SqlKeyword } from './sql-keywords'
import { dataTypes, DataType } from './data-types'
import { functions, Function } from './functions'
import { controlFlow, ControlFlow } from './control-flow'
import { tableOperations, TableOperation } from './table-operations'
import { indexOperations, IndexOperation } from './index-operations'
import { security, Security } from './security'

// Combined type for all reserved words
export type ReservedWord =
	| SqlKeyword
	| DataType
	| Function
	| ControlFlow
	| TableOperation
	| IndexOperation
	| Security

// Combined array of all reserved words
export const allReservedWords = [
	...sqlKeywords,
	...dataTypes,
	...functions,
	...controlFlow,
	...tableOperations,
	...indexOperations,
	...security
] as const

// Re-export all individual categories
export {
	sqlKeywords,
	SqlKeyword,
	dataTypes,
	DataType,
	functions,
	Function,
	controlFlow,
	ControlFlow,
	tableOperations,
	TableOperation,
	indexOperations,
	IndexOperation,
	security,
	Security
}

export default allReservedWords
