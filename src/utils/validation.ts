import { ValidationError } from '../errors'

/**
 * Validate that a value is not null or undefined
 * @param value Value to validate
 * @param name Name of the value for error message
 * @throws {ValidationError} If the value is null or undefined
 */
export function validateRequired<T>(value: T | null | undefined, name: string): asserts value is T {
	if (value === null || value === undefined) {
		throw new ValidationError(`${name} is required`)
	}
}

/**
 * Validate that a string is not empty
 * @param value String to validate
 * @param name Name of the string for error message
 * @throws {ValidationError} If the string is empty
 */
export function validateNonEmptyString(
	value: string | null | undefined,
	name: string
): asserts value is string {
	validateRequired(value, name)
	if (value.trim().length === 0) {
		throw new ValidationError(`${name} cannot be empty`)
	}
}

/**
 * Validate that a number is within a range
 * @param value Number to validate
 * @param name Name of the number for error message
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @throws {ValidationError} If the number is outside the range
 */
export function validateNumberRange(
	value: number | null | undefined,
	name: string,
	min: number,
	max: number
): asserts value is number {
	validateRequired(value, name)
	if (value < min || value > max) {
		throw new ValidationError(`${name} must be between ${min} and ${max}`)
	}
}

/**
 * Validate that a value is of a specific type
 * @param value Value to validate
 * @param name Name of the value for error message
 * @param type Expected type
 * @throws {ValidationError} If the value is not of the expected type
 */
export function validateType<T>(value: unknown, name: string, type: string): asserts value is T {
	if (typeof value !== type) {
		throw new ValidationError(`${name} must be of type ${type}`)
	}
}

/**
 * Validate that a value is an array
 * @param value Value to validate
 * @param name Name of the value for error message
 * @throws {ValidationError} If the value is not an array
 */
export function validateArray<T>(value: unknown, name: string): asserts value is T[] {
	if (!Array.isArray(value)) {
		throw new ValidationError(`${name} must be an array`)
	}
}

/**
 * Validate that a value is an object
 * @param value Value to validate
 * @param name Name of the value for error message
 * @throws {ValidationError} If the value is not an object
 */
export function validateObject(
	value: unknown,
	name: string
): asserts value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		throw new ValidationError(`${name} must be an object`)
	}
}

/**
 * Validate that a value is a valid table name
 * @param value Table name to validate
 * @throws {ValidationError} If the table name is invalid
 */
export function validateTableName(value: string | null | undefined): asserts value is string {
	validateNonEmptyString(value, 'Table name')
	if (!/^[a-zA-Z0-9_.-]{3,255}$/.test(value)) {
		throw new ValidationError(
			'Table name must be between 3 and 255 characters and contain only alphanumeric characters, underscores, dots, and hyphens'
		)
	}
}

/**
 * Validate that a value is a valid key
 * @param value Key to validate
 * @throws {ValidationError} If the key is invalid
 */
export function validateKey(value: unknown): asserts value is Record<string, unknown> {
	validateObject(value, 'Key')
	if (Object.keys(value).length === 0) {
		throw new ValidationError('Key must not be empty')
	}
}

/**
 * Validate that a value is a valid timestamp
 * @param value Timestamp to validate
 * @throws {ValidationError} If the timestamp is invalid
 */
export function validateTimestamp(value: number | null | undefined): asserts value is number {
	validateRequired(value, 'Timestamp')
	if (typeof value !== 'number') {
		throw new ValidationError('Timestamp must be a number')
	}
	if (value < 0 || value > Date.now()) {
		throw new ValidationError('Timestamp must be a positive number and not in the future')
	}
}

/**
 * Validate that a value is a valid limit
 * @param value Limit to validate
 * @throws {ValidationError} If the limit is invalid
 */
export function validateLimit(value: number | null | undefined): asserts value is number {
	validateRequired(value, 'Limit')
	if (typeof value !== 'number') {
		throw new ValidationError('Limit must be a number')
	}
	if (value < 1 || value > 1000) {
		throw new ValidationError('Limit must be between 1 and 1000')
	}
}

/**
 * Validate that a value is a valid next token
 * @param value Next token to validate
 * @throws {ValidationError} If the next token is invalid
 */
export function validateNextToken(value: unknown): asserts value is Record<string, unknown> {
	validateObject(value, 'Next token')
	if (Object.keys(value).length === 0) {
		throw new ValidationError('Next token must not be empty')
	}
}

/**
 * Validate that a value is a valid filter expression
 * @param value Filter expression to validate
 * @throws {ValidationError} If the filter expression is invalid
 */
export function validateFilterExpression(
	value: string | null | undefined
): asserts value is string {
	validateNonEmptyString(value, 'Filter expression')
	if (value.length > 255) {
		throw new ValidationError('Filter expression must not exceed 255 characters')
	}
	if (value.includes('@')) {
		throw new ValidationError('Filter expression contains invalid characters')
	}
}

/**
 * Validate that a value is a valid projection expression
 * @param value Projection expression to validate
 * @throws {ValidationError} If the projection expression is invalid
 */
export function validateProjectionExpression(
	value: string | null | undefined
): asserts value is string {
	validateNonEmptyString(value, 'Projection expression')
	if (value.length > 255) {
		throw new ValidationError('Projection expression must not exceed 255 characters')
	}
	if (value.includes('@')) {
		throw new ValidationError('Projection expression contains invalid characters')
	}
}

/**
 * Validate that a value is a valid key condition expression
 * @param value Key condition expression to validate
 * @throws {ValidationError} If the key condition expression is invalid
 */
export function validateKeyConditionExpression(
	value: string | null | undefined
): asserts value is string {
	validateNonEmptyString(value, 'Key condition expression')
	if (value.length > 255) {
		throw new ValidationError('Key condition expression must not exceed 255 characters')
	}
	if (value.includes('@')) {
		throw new ValidationError('Key condition expression contains invalid characters')
	}
}

/**
 * Validate that a value is a valid update expression
 * @param value Update expression to validate
 * @throws {ValidationError} If the update expression is invalid
 */
export function validateUpdateExpression(
	value: string | null | undefined
): asserts value is string {
	validateNonEmptyString(value, 'Update expression')
	if (value.length > 255) {
		throw new ValidationError('Update expression must not exceed 255 characters')
	}
	if (value.includes('@')) {
		throw new ValidationError('Update expression contains invalid characters')
	}
}

/**
 * Validate that a value is a valid condition expression
 * @param value Condition expression to validate
 * @throws {ValidationError} If the condition expression is invalid
 */
export function validateConditionExpression(
	value: string | null | undefined
): asserts value is string {
	validateNonEmptyString(value, 'Condition expression')
	if (value.length > 255) {
		throw new ValidationError('Condition expression must not exceed 255 characters')
	}
	if (value.includes('@')) {
		throw new ValidationError('Condition expression contains invalid characters')
	}
}
