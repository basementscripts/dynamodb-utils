export const security = [
	'grant',
	'revoke',
	'deny',
	'role',
	'user',
	'group',
	'public',
	'owner',
	'schema',
	'database',
	'server',
	'login',
	'password',
	'encryption',
	'decryption',
	'certificate',
	'key',
	'master',
	'symmetric',
	'asymmetric',
	'public',
	'private',
	'secret',
	'credential',
	'identity',
	'principal',
	'permission',
	'privilege',
	'authorization',
	'authentication',
	'login',
	'logout',
	'session',
	'connection',
	'audit',
	'trace',
	'monitor',
	'security',
	'policy',
	'rule',
	'constraint',
	'check',
	'foreign',
	'primary',
	'unique',
	'index',
	'view',
	'procedure',
	'function',
	'trigger',
	'event',
	'job',
	'schedule',
	'task',
	'workload',
	'resource',
	'pool',
	'group',
	'class',
	'priority',
	'limit',
	'quota',
	'threshold',
	'alert',
	'notification',
	'message',
	'queue',
	'topic',
	'subscription',
	'publish',
	'subscribe',
	'broker',
	'service',
	'contract',
	'message_type',
	'queue_type',
	'service_type',
	'binding',
	'route',
	'endpoint',
	'protocol',
	'transport',
	'security',
	'encryption',
	'authentication',
	'authorization',
	'permission',
	'privilege',
	'role',
	'user',
	'group',
	'public',
	'owner',
	'schema',
	'database',
	'server',
	'login',
	'password',
	'certificate',
	'key',
	'master',
	'symmetric',
	'asymmetric',
	'public',
	'private',
	'secret',
	'credential',
	'identity',
	'principal'
] as const

export type Security = (typeof security)[number]
