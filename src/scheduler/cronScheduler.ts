import { CronJob } from 'cron';
import { Queue } from 'bullmq';
import { JobType } from '../jobs/types';
import { format } from 'date-fns';

export class CronScheduler {
	private readonly jobs: Map<string, CronJob> = new Map();
	private readonly queues: Map<string, Queue> = new Map();

	constructor(private readonly schedules: JobType[]) {
		// Initialize queues
		schedules.forEach((schedule) => {
			if (!this.queues.has(schedule.queue)) {
				this.queues.set(
					schedule.queue,
					new Queue(schedule.queue, {
						connection: {
							host: 'localhost',
							port: 6379,
						},
					})
				);
			}
		});
	}

	public start(): void {
		// Create and start cron jobs for each schedule
		this.schedules.forEach((schedule) => {
			const job = new CronJob(
				schedule.cron, // When to run (cron pattern)
				async () => {
					// What to do
					await this.executeJob(schedule);
				},
				null, // onComplete callback
				true, // Start immediately
				'UTC' // Timezone
			);

			this.jobs.set(schedule.name, job);
			job.start();

			console.log(`Scheduled job ${schedule.name} with cron: ${schedule.cron}`);
		});
	}

	private async executeJob(schedule: JobType): Promise<void> {
		const queue = this.queues.get(schedule.queue);
		if (!queue) {
			throw new Error(`Queue ${schedule.queue} not found`);
		}
		try {
			const job = await queue.add(schedule.name, schedule.data, {
				jobId: `${schedule.name}-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}`,
				removeOnComplete: true,
				removeOnFail: false,
			});

			console.log(`Added job ${job.id} to queue ${schedule.queue}`);
		} catch (error) {
			console.error(`Error adding job ${schedule.name} to queue:`, error);
		}
	}

	public stop(): void {
		// Stop all cron jobs
		this.jobs.forEach((job) => job.stop());
		this.jobs.clear();
	}
}
