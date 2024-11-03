import { Queue } from 'bullmq';

import { REDIS_CONFIG, QUEUE_NAMES } from '../config/queue.config';
import { ReportJobData } from './types';

export const reportQueue = new Queue<ReportJobData>(QUEUE_NAMES.REPORT, {
	connection: REDIS_CONFIG.connection,
});

export const dailyReport: ReportJobData = {
	reportType: 'daily',
	userId: 'user123',
};

export const weeklyReport: ReportJobData = {
	reportType: 'weekly',
	userId: 'user123',
};
