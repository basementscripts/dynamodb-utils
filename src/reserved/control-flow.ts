export const controlFlow = [
	'if',
	'else',
	'elseif',
	'then',
	'end',
	'case',
	'when',
	'default',
	'break',
	'continue',
	'return',
	'exit',
	'goto',
	'label',
	'loop',
	'while',
	'repeat',
	'until',
	'for',
	'foreach',
	'in',
	'do',
	'begin',
	'end',
	'transaction',
	'commit',
	'rollback',
	'savepoint',
	'release',
	'set',
	'declare',
	'cursor',
	'open',
	'close',
	'fetch',
	'into',
	'using',
	'handler',
	'condition',
	'signal',
	'resignal',
	'diagnostics',
	'get',
	'stacked',
	'current',
	'global',
	'local',
	'session',
	'system',
	'user',
	'current_user',
	'session_user',
	'system_user'
] as const

export type ControlFlow = (typeof controlFlow)[number]
