import { Worker } from 'bullmq';
import { EmailJobData, ReportJobData } from '../jobs/types';
import { QUEUE_NAMES, REDIS_CONFIG } from '../config/queue.config';

// Email Worker
export const emailWorker = new Worker(
	QUEUE_NAMES.EMAIL,
	async (job) => {
		const data = job.data as EmailJobData;
		console.log(`Processing email job ${job.id}`);
		console.log('Sending email to:', data.to);
		console.log('Subject:', data.subject);

		// Simulate email sending
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return { sent: true, timestamp: new Date() };
	},
	{
		connection: REDIS_CONFIG.connection,
	}
);

// Report Worker
export const reportWorker = new Worker(
	QUEUE_NAMES.REPORT,
	async (job) => {
		const data = job.data as ReportJobData;
		console.log(`Processing report job ${job.id}`);
		console.log('Generating report:', data.reportType);
		console.log('For user:', data.userId);

		// Simulate report generation
		await new Promise((resolve) => setTimeout(resolve, 2000));

		return { generated: true, timestamp: new Date() };
	},
	{
		connection: REDIS_CONFIG.connection,
	}
);

// Setup event handlers
[emailWorker, reportWorker].forEach((worker) => {
	worker.on('completed', (job) => {
		console.log(`✅ Job ${job.id} completed!`);
	});

	worker.on('failed', (job, error) => {
		console.error(`❌ Job ${job?.id} failed:`, error);
	});
});
