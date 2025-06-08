import { describe, expect, it } from '@jest/globals'
import {
	validateRequired,
	validateNonEmptyString,
	validateNumberRange,
	validateType,
	validateArray,
	validateObject,
	validateTableName,
	validateKey,
	validateTimestamp,
	validateLimit,
	validateNextToken,
	validateFilterExpression,
	validateProjectionExpression,
	validateKeyConditionExpression,
	validateUpdateExpression,
	validateConditionExpression
} from '../utils/validation'
import { ValidationError } from '../errors'

describe('Validation', () => {
	describe('validateRequired', () => {
		it('should not throw when value is not null or undefined', () => {
			expect(() => validateRequired('test', 'Value')).not.toThrow()
			expect(() => validateRequired(0, 'Value')).not.toThrow()
			expect(() => validateRequired(false, 'Value')).not.toThrow()
			expect(() => validateRequired([], 'Value')).not.toThrow()
			expect(() => validateRequired({}, 'Value')).not.toThrow()
		})

		it('should throw ValidationError when value is null', () => {
			expect(() => validateRequired(null, 'Value')).toThrow(ValidationError)
		})

		it('should throw ValidationError when value is undefined', () => {
			expect(() => validateRequired(undefined, 'Value')).toThrow(ValidationError)
		})
	})

	describe('validateNonEmptyString', () => {
		it('should not throw when string is not empty', () => {
			expect(() => validateNonEmptyString('test', 'String')).not.toThrow()
		})

		it('should throw ValidationError when string is empty', () => {
			expect(() => validateNonEmptyString('', 'String')).toThrow(ValidationError)
		})

		it('should throw ValidationError when string is only whitespace', () => {
			expect(() => validateNonEmptyString('   ', 'String')).toThrow(ValidationError)
		})
	})

	describe('validateNumberRange', () => {
		it('should not throw when number is within range', () => {
			expect(() => validateNumberRange(5, 'Number', 0, 10)).not.toThrow()
		})

		it('should throw ValidationError when number is below range', () => {
			expect(() => validateNumberRange(-1, 'Number', 0, 10)).toThrow(ValidationError)
		})

		it('should throw ValidationError when number is above range', () => {
			expect(() => validateNumberRange(11, 'Number', 0, 10)).toThrow(ValidationError)
		})
	})

	describe('validateType', () => {
		it('should not throw when value is of correct type', () => {
			expect(() => validateType<string>('test', 'Value', 'string')).not.toThrow()
			expect(() => validateType<number>(5, 'Value', 'number')).not.toThrow()
			expect(() => validateType<boolean>(true, 'Value', 'boolean')).not.toThrow()
		})

		it('should throw ValidationError when value is of incorrect type', () => {
			expect(() => validateType<string>(5, 'Value', 'string')).toThrow(ValidationError)
			expect(() => validateType<number>('test', 'Value', 'number')).toThrow(ValidationError)
			expect(() => validateType<boolean>('test', 'Value', 'boolean')).toThrow(ValidationError)
		})
	})

	describe('validateArray', () => {
		it('should not throw when value is an array', () => {
			expect(() => validateArray<string>(['test'], 'Array')).not.toThrow()
		})

		it('should throw ValidationError when value is not an array', () => {
			expect(() => validateArray<string>('test', 'Array')).toThrow(ValidationError)
			expect(() => validateArray<string>(5, 'Array')).toThrow(ValidationError)
			expect(() => validateArray<string>(true, 'Array')).toThrow(ValidationError)
			expect(() => validateArray<string>({}, 'Array')).toThrow(ValidationError)
		})
	})

	describe('validateObject', () => {
		it('should not throw when value is an object', () => {
			expect(() => validateObject({ test: 'value' }, 'Object')).not.toThrow()
		})

		it('should throw ValidationError when value is not an object', () => {
			expect(() => validateObject('test', 'Object')).toThrow(ValidationError)
			expect(() => validateObject(5, 'Object')).toThrow(ValidationError)
			expect(() => validateObject(true, 'Object')).toThrow(ValidationError)
			expect(() => validateObject([], 'Object')).toThrow(ValidationError)
			expect(() => validateObject(null, 'Object')).toThrow(ValidationError)
		})
	})

	describe('validateTableName', () => {
		it('should not throw when table name is valid', () => {
			expect(() => validateTableName('Users')).not.toThrow()
			expect(() => validateTableName('users-table')).not.toThrow()
			expect(() => validateTableName('users_table')).not.toThrow()
			expect(() => validateTableName('users.table')).not.toThrow()
		})

		it('should throw ValidationError when table name is invalid', () => {
			expect(() => validateTableName('')).toThrow(ValidationError)
			expect(() => validateTableName('a')).toThrow(ValidationError)
			expect(() => validateTableName('a'.repeat(256))).toThrow(ValidationError)
			expect(() => validateTableName('users@table')).toThrow(ValidationError)
		})
	})

	describe('validateKey', () => {
		it('should not throw when key is valid', () => {
			expect(() => validateKey({ test: 'value' })).not.toThrow()
		})

		it('should throw ValidationError when key is invalid', () => {
			expect(() => validateKey({})).toThrow(ValidationError)
			expect(() => validateKey('test')).toThrow(ValidationError)
			expect(() => validateKey(5)).toThrow(ValidationError)
			expect(() => validateKey(true)).toThrow(ValidationError)
			expect(() => validateKey([])).toThrow(ValidationError)
			expect(() => validateKey(null)).toThrow(ValidationError)
		})
	})

	describe('validateTimestamp', () => {
		it('should not throw when timestamp is valid', () => {
			expect(() => validateTimestamp(Date.now())).not.toThrow()
		})

		it('should throw ValidationError when timestamp is invalid', () => {
			expect(() => validateTimestamp(-1)).toThrow(ValidationError)
			expect(() => validateTimestamp(Date.now() + 1000)).toThrow(ValidationError)
			expect(() => validateTimestamp('test' as any)).toThrow(ValidationError)
			expect(() => validateTimestamp(true as any)).toThrow(ValidationError)
			expect(() => validateTimestamp([] as any)).toThrow(ValidationError)
			expect(() => validateTimestamp({} as any)).toThrow(ValidationError)
			expect(() => validateTimestamp(null)).toThrow(ValidationError)
		})
	})

	describe('validateLimit', () => {
		it('should not throw when limit is valid', () => {
			expect(() => validateLimit(1)).not.toThrow()
			expect(() => validateLimit(1000)).not.toThrow()
		})

		it('should throw ValidationError when limit is invalid', () => {
			expect(() => validateLimit(0)).toThrow(ValidationError)
			expect(() => validateLimit(1001)).toThrow(ValidationError)
			expect(() => validateLimit('test' as any)).toThrow(ValidationError)
			expect(() => validateLimit(true as any)).toThrow(ValidationError)
			expect(() => validateLimit([] as any)).toThrow(ValidationError)
			expect(() => validateLimit({} as any)).toThrow(ValidationError)
			expect(() => validateLimit(null)).toThrow(ValidationError)
		})
	})

	describe('validateNextToken', () => {
		it('should not throw when next token is valid', () => {
			expect(() => validateNextToken({ test: 'value' })).not.toThrow()
		})

		it('should throw ValidationError when next token is invalid', () => {
			expect(() => validateNextToken({})).toThrow(ValidationError)
			expect(() => validateNextToken('test')).toThrow(ValidationError)
			expect(() => validateNextToken(5)).toThrow(ValidationError)
			expect(() => validateNextToken(true)).toThrow(ValidationError)
			expect(() => validateNextToken([])).toThrow(ValidationError)
			expect(() => validateNextToken(null)).toThrow(ValidationError)
		})
	})

	describe('validateFilterExpression', () => {
		it('should not throw when filter expression is valid', () => {
			expect(() => validateFilterExpression('name = :name')).not.toThrow()
		})

		it('should throw ValidationError when filter expression is invalid', () => {
			expect(() => validateFilterExpression('')).toThrow(ValidationError)
			expect(() => validateFilterExpression('a'.repeat(256))).toThrow(ValidationError)
			expect(() => validateFilterExpression('name @ :name')).toThrow(ValidationError)
		})
	})

	describe('validateProjectionExpression', () => {
		it('should not throw when projection expression is valid', () => {
			expect(() => validateProjectionExpression('name, email')).not.toThrow()
		})

		it('should throw ValidationError when projection expression is invalid', () => {
			expect(() => validateProjectionExpression('')).toThrow(ValidationError)
			expect(() => validateProjectionExpression('a'.repeat(256))).toThrow(ValidationError)
			expect(() => validateProjectionExpression('name @ email')).toThrow(ValidationError)
		})
	})

	describe('validateKeyConditionExpression', () => {
		it('should not throw when key condition expression is valid', () => {
			expect(() => validateKeyConditionExpression('id = :id')).not.toThrow()
		})

		it('should throw ValidationError when key condition expression is invalid', () => {
			expect(() => validateKeyConditionExpression('')).toThrow(ValidationError)
			expect(() => validateKeyConditionExpression('a'.repeat(256))).toThrow(ValidationError)
			expect(() => validateKeyConditionExpression('id @ :id')).toThrow(ValidationError)
		})
	})

	describe('validateUpdateExpression', () => {
		it('should not throw when update expression is valid', () => {
			expect(() => validateUpdateExpression('SET age = :age')).not.toThrow()
		})

		it('should throw ValidationError when update expression is invalid', () => {
			expect(() => validateUpdateExpression('')).toThrow(ValidationError)
			expect(() => validateUpdateExpression('a'.repeat(256))).toThrow(ValidationError)
			expect(() => validateUpdateExpression('SET age @ :age')).toThrow(ValidationError)
		})
	})

	describe('validateConditionExpression', () => {
		it('should not throw when condition expression is valid', () => {
			expect(() => validateConditionExpression('age > :age')).not.toThrow()
		})

		it('should throw ValidationError when condition expression is invalid', () => {
			expect(() => validateConditionExpression('')).toThrow(ValidationError)
			expect(() => validateConditionExpression('a'.repeat(256))).toThrow(ValidationError)
			expect(() => validateConditionExpression('age @ :age')).toThrow(ValidationError)
		})
	})
})
