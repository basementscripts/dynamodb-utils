import { ValidationError } from '../errors'

/**
 * Timezone options for timestamp conversion
 */
export interface TimezoneOptions {
	timezone?: string
	format?: 'iso' | 'unix' | 'utc'
}

/**
 * Default timezone options
 */
const DEFAULT_OPTIONS: TimezoneOptions = {
	timezone: 'UTC',
	format: 'iso'
}

/**
 * Convert a timestamp to a specific timezone
 * @param timestamp Timestamp to convert
 * @param options Timezone options
 * @returns Converted timestamp
 * @throws {ValidationError} If the timestamp is invalid
 */
export function convertTimestamp(timestamp: number, options: TimezoneOptions = {}): string {
	const opts = { ...DEFAULT_OPTIONS, ...options }
	const date = new Date(timestamp)

	if (isNaN(date.getTime())) {
		throw new ValidationError('Invalid timestamp')
	}

	switch (opts.format) {
		case 'unix':
			return Math.floor(date.getTime() / 1000).toString()
		case 'utc':
			return date.toUTCString()
		case 'iso':
		default:
			return date.toISOString()
	}
}

/**
 * Convert a timestamp to a specific timezone
 * @param timestamp Timestamp to convert
 * @param timezone Timezone to convert to
 * @returns Converted timestamp
 * @throws {ValidationError} If the timestamp is invalid
 */
export function convertToTimezone(timestamp: number, timezone: string): string {
	const date = new Date(timestamp)

	if (isNaN(date.getTime())) {
		throw new ValidationError('Invalid timestamp')
	}

	try {
		return date.toLocaleString('en-US', { timeZone: timezone })
	} catch (e) {
		throw new ValidationError(`Invalid timezone: ${timezone}`)
	}
}

/**
 * Convert a timestamp to UTC
 * @param timestamp Timestamp to convert
 * @returns UTC timestamp
 * @throws {ValidationError} If the timestamp is invalid
 */
export function convertToUTC(timestamp: number): string {
	const date = new Date(timestamp)

	if (isNaN(date.getTime())) {
		throw new ValidationError('Invalid timestamp')
	}

	return date.toUTCString()
}

/**
 * Convert a timestamp to ISO format
 * @param timestamp Timestamp to convert
 * @returns ISO timestamp
 * @throws {ValidationError} If the timestamp is invalid
 */
export function convertToISO(timestamp: number): string {
	const date = new Date(timestamp)

	if (isNaN(date.getTime())) {
		throw new ValidationError('Invalid timestamp')
	}

	return date.toISOString()
}

/**
 * Convert a timestamp to Unix format
 * @param timestamp Timestamp to convert
 * @returns Unix timestamp
 * @throws {ValidationError} If the timestamp is invalid
 */
export function convertToUnix(timestamp: number): string {
	const date = new Date(timestamp)

	if (isNaN(date.getTime())) {
		throw new ValidationError('Invalid timestamp')
	}

	return Math.floor(date.getTime() / 1000).toString()
}

/**
 * Get the current timestamp in milliseconds
 * @returns Current timestamp
 */
export function getCurrentTimestamp(): number {
	return Date.now()
}

/**
 * Get the current timestamp in seconds
 * @returns Current timestamp in seconds
 */
export function getCurrentTimestampSeconds(): number {
	return Math.floor(Date.now() / 1000)
}

/**
 * Get the current timestamp in ISO format
 * @returns Current timestamp in ISO format
 */
export function getCurrentTimestampISO(): string {
	return new Date().toISOString()
}

/**
 * Get the current timestamp in UTC format
 * @returns Current timestamp in UTC format
 */
export function getCurrentTimestampUTC(): string {
	return new Date().toUTCString()
}

/**
 * Get the current timestamp in a specific timezone
 * @param timezone Timezone to convert to
 * @returns Current timestamp in the specified timezone
 * @throws {ValidationError} If the timezone is invalid
 */
export function getCurrentTimestampInTimezone(timezone: string): string {
	try {
		return new Date().toLocaleString('en-US', { timeZone: timezone })
	} catch (e) {
		throw new ValidationError(`Invalid timezone: ${timezone}`)
	}
}

/**
 * Get the current timestamp in a specific format
 * @param format Format to convert to
 * @returns Current timestamp in the specified format
 * @throws {ValidationError} If the format is invalid
 */
export function getCurrentTimestampInFormat(format: 'iso' | 'unix' | 'utc'): string {
	switch (format) {
		case 'unix':
			return getCurrentTimestampSeconds().toString()
		case 'utc':
			return getCurrentTimestampUTC()
		case 'iso':
			return getCurrentTimestampISO()
		default:
			throw new ValidationError(`Invalid format: ${format}`)
	}
}

/**
 * Get the current timestamp in a specific timezone and format
 * @param timezone Timezone to convert to
 * @param format Format to convert to
 * @returns Current timestamp in the specified timezone and format
 * @throws {ValidationError} If the timezone or format is invalid
 */
export function getCurrentTimestampInTimezoneAndFormat(
	timezone: string,
	format: 'iso' | 'unix' | 'utc'
): string {
	const date = new Date()

	if (isNaN(date.getTime())) {
		throw new ValidationError('Invalid timestamp')
	}

	try {
		const timezoneDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))

		switch (format) {
			case 'unix':
				return Math.floor(timezoneDate.getTime() / 1000).toString()
			case 'utc':
				return timezoneDate.toUTCString()
			case 'iso':
				return timezoneDate.toISOString()
			default:
				throw new ValidationError(`Invalid format: ${format}`)
		}
	} catch (e) {
		throw new ValidationError(`Invalid timezone: ${timezone}`)
	}
}
