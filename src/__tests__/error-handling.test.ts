import { describe, expect, it } from '@jest/globals'
import {
	ItemExistsError,
	ItemNotFoundError,
	QueryError,
	CreateError,
	DeleteError,
	UpdateError,
	ConnectionError,
	CredentialsError,
	PermissionError,
	RateLimitError,
	TimeoutError,
	ResourceNotFoundError,
	ResourceInUseError,
	ResourceNotAvailableError,
	ResourceNotSupportedError,
	ResourceNotAuthorizedError,
	ValidationError
} from '../errors'

describe('Error Handling', () => {
	describe('ItemExistsError', () => {
		it('should create error with table name and key', () => {
			const error = new ItemExistsError('test-table', { key: '1' })
			expect(error.message).toContain('test-table')
			expect(error.message).toContain('1')
			expect(error.name).toBe('ItemExistsError')
		})
	})

	describe('ItemNotFoundError', () => {
		it('should create error with table name and key', () => {
			const error = new ItemNotFoundError('test-table', { key: '1' })
			expect(error.message).toContain('test-table')
			expect(error.message).toContain('1')
			expect(error.name).toBe('ItemNotFoundError')
		})
	})

	describe('QueryError', () => {
		it('should create error with message', () => {
			const error = new QueryError('Query failed')
			expect(error.message).toBe('Query failed')
			expect(error.name).toBe('QueryError')
		})
	})

	describe('CreateError', () => {
		it('should create error with message', () => {
			const error = new CreateError('Create failed')
			expect(error.message).toBe('Create failed')
			expect(error.name).toBe('CreateError')
		})
	})

	describe('DeleteError', () => {
		it('should create error with message', () => {
			const error = new DeleteError('Delete failed')
			expect(error.message).toBe('Delete failed')
			expect(error.name).toBe('DeleteError')
		})
	})

	describe('UpdateError', () => {
		it('should create error with message', () => {
			const error = new UpdateError('Update failed')
			expect(error.message).toBe('Update failed')
			expect(error.name).toBe('UpdateError')
		})
	})

	describe('ConnectionError', () => {
		it('should create error with message', () => {
			const error = new ConnectionError('Connection failed')
			expect(error.message).toBe('Connection failed')
			expect(error.name).toBe('ConnectionError')
		})
	})

	describe('CredentialsError', () => {
		it('should create error with message', () => {
			const error = new CredentialsError('Invalid credentials')
			expect(error.message).toBe('Invalid credentials')
			expect(error.name).toBe('CredentialsError')
		})
	})

	describe('PermissionError', () => {
		it('should create error with message', () => {
			const error = new PermissionError('Permission denied')
			expect(error.message).toBe('Permission denied')
			expect(error.name).toBe('PermissionError')
		})
	})

	describe('RateLimitError', () => {
		it('should create error with message', () => {
			const error = new RateLimitError('Rate limit exceeded')
			expect(error.message).toBe('Rate limit exceeded')
			expect(error.name).toBe('RateLimitError')
		})
	})

	describe('TimeoutError', () => {
		it('should create error with message', () => {
			const error = new TimeoutError('Operation timed out')
			expect(error.message).toBe('Operation timed out')
			expect(error.name).toBe('TimeoutError')
		})
	})

	describe('ResourceNotFoundError', () => {
		it('should create error with message', () => {
			const error = new ResourceNotFoundError('Resource not found')
			expect(error.message).toBe('Resource not found')
			expect(error.name).toBe('ResourceNotFoundError')
		})
	})

	describe('ResourceInUseError', () => {
		it('should create error with message', () => {
			const error = new ResourceInUseError('Resource in use')
			expect(error.message).toBe('Resource in use')
			expect(error.name).toBe('ResourceInUseError')
		})
	})

	describe('ResourceNotAvailableError', () => {
		it('should create error with message', () => {
			const error = new ResourceNotAvailableError('Resource not available')
			expect(error.message).toBe('Resource not available')
			expect(error.name).toBe('ResourceNotAvailableError')
		})
	})

	describe('ResourceNotSupportedError', () => {
		it('should create error with message', () => {
			const error = new ResourceNotSupportedError('Resource not supported')
			expect(error.message).toBe('Resource not supported')
			expect(error.name).toBe('ResourceNotSupportedError')
		})
	})

	describe('ResourceNotAuthorizedError', () => {
		it('should create error with message', () => {
			const error = new ResourceNotAuthorizedError('Resource not authorized')
			expect(error.message).toBe('Resource not authorized')
			expect(error.name).toBe('ResourceNotAuthorizedError')
		})
	})

	describe('ValidationError', () => {
		it('should create error with message', () => {
			const error = new ValidationError('Invalid value')
			expect(error.message).toBe('Invalid value')
			expect(error.name).toBe('ValidationError')
		})
	})
})
