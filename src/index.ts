import { CronScheduler } from './scheduler/cronScheduler';
import { QUEUE_NAMES } from './config/queue.config';
import { dailyEmailReminder, weeklyNewsletter } from './jobs/emailJob';
import { dailyReport, weeklyReport } from './jobs/reportJob';
import './workers/jobProcessor';

const scheduledJobs = [
	{
		name: 'daily-email-reminder',
		data: dailyEmailReminder,
		cron: '0 9 * * *', // Every day at 9 AM
		queue: QUEUE_NAMES.EMAIL,
	},
	{
		name: 'weekly-newsletter',
		data: weeklyNewsletter,
		cron: '0 10 * * 1', // Every Monday at 10 AM
		queue: QUEUE_NAMES.EMAIL,
	},
	{
		name: 'daily-report',
		data: dailyReport,
		cron: '0 0 * * *', // Every day at midnight
		queue: QUEUE_NAMES.REPORT,
	},
	{
		name: 'weekly-report',
		data: weeklyReport,
		cron: '0 1 * * 0', // Every Sunday at 1 AM
		queue: QUEUE_NAMES.REPORT,
	},
];

const testScheduledJobs = [
	{
		name: 'test-email',
		data: dailyEmailReminder,
		cron: '*/1 * * * *', // Every minute
		queue: QUEUE_NAMES.EMAIL,
	},
	{
		name: 'test-report',
		data: dailyReport,
		cron: '*/2 * * * *', // Every 2 minutes
		queue: QUEUE_NAMES.REPORT,
	},
];

const scheduler = new CronScheduler(
	process.env.NODE_ENV === 'production' ? scheduledJobs : testScheduledJobs
);

scheduler.start();

// Handle shutdown
process.on('SIGTERM', () => {
	scheduler.stop();
	process.exit(0);
});
