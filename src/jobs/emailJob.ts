import { Queue } from 'bullmq';

import { REDIS_CONFIG, QUEUE_NAMES } from '../config/queue.config';
import { EmailJobData } from './types';

export const emailQueue = new Queue<EmailJobData>(QUEUE_NAMES.EMAIL, {
	connection: REDIS_CONFIG.connection,
});

export const dailyEmailReminder: EmailJobData = {
	to: 'user@example.com',
	subject: 'Daily Reminder',
	body: 'This is your daily reminder!',
};

export const weeklyNewsletter: EmailJobData = {
	to: 'subscribers@example.com',
	subject: 'Weekly Newsletter',
	body: 'Here is your weekly newsletter!',
};
