export const REDIS_CONFIG = {
	connection: {
		host: 'localhost',
		port: 6379,
	},
};

export const QUEUE_NAMES = {
	EMAIL: 'email-queue',
	REPORT: 'report-queue',
} as const;
