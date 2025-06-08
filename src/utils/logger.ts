import { DynamoDbError } from '../errors'

/**
 * Log levels for the logger
 */
export enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR'
}

/**
 * Logger configuration options
 */
export interface LoggerOptions {
	level: LogLevel
	prefix?: string
	includeTimestamp?: boolean
	includeStack?: boolean
}

/**
 * Default logger configuration
 */
const DEFAULT_OPTIONS: LoggerOptions = {
	level: LogLevel.INFO,
	prefix: '[DynamoDB]',
	includeTimestamp: true,
	includeStack: true
}

/**
 * Logger class for DynamoDB operations
 */
export class Logger {
	private options: LoggerOptions

	constructor(options: Partial<LoggerOptions> = {}) {
		this.options = { ...DEFAULT_OPTIONS, ...options }
	}

	/**
	 * Log a message with the specified level
	 * @param level Log level
	 * @param message Message to log
	 * @param error Optional error to log
	 */
	private log(level: LogLevel, message: string, error?: Error): void {
		if (this.shouldLog(level)) {
			const timestamp = this.options.includeTimestamp ? `[${new Date().toISOString()}]` : ''
			const prefix = this.options.prefix || ''
			const stack = error && this.options.includeStack ? `\n${error.stack}` : ''
			const errorMessage = error ? `: ${error.message}` : ''

			console.log(`${timestamp} ${prefix} ${level} ${message}${errorMessage}${stack}`)
		}
	}

	/**
	 * Check if the message should be logged based on the current log level
	 * @param level Log level to check
	 * @returns Whether the message should be logged
	 */
	private shouldLog(level: LogLevel): boolean {
		const levels = Object.values(LogLevel)
		const currentLevelIndex = levels.indexOf(this.options.level)
		const messageLevelIndex = levels.indexOf(level)
		return messageLevelIndex >= currentLevelIndex
	}

	/**
	 * Log a debug message
	 * @param message Message to log
	 * @param error Optional error to log
	 */
	public debug(message: string, error?: Error): void {
		this.log(LogLevel.DEBUG, message, error)
	}

	/**
	 * Log an info message
	 * @param message Message to log
	 * @param error Optional error to log
	 */
	public info(message: string, error?: Error): void {
		this.log(LogLevel.INFO, message, error)
	}

	/**
	 * Log a warning message
	 * @param message Message to log
	 * @param error Optional error to log
	 */
	public warn(message: string, error?: Error): void {
		this.log(LogLevel.WARN, message, error)
	}

	/**
	 * Log an error message
	 * @param message Message to log
	 * @param error Optional error to log
	 */
	public error(message: string, error?: Error): void {
		this.log(LogLevel.ERROR, message, error)
	}

	/**
	 * Log a DynamoDB error
	 * @param error DynamoDB error to log
	 */
	public logDynamoDbError(error: DynamoDbError): void {
		this.error(`DynamoDB ${error.operation} operation failed`, error)
	}
}
