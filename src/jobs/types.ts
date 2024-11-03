export interface EmailJobData {
	to: string;
	subject: string;
	body: string;
}

export interface ReportJobData {
	reportType: 'daily' | 'weekly' | 'monthly';
	userId: string;
}

export type JobType = {
	name: string;
	data: EmailJobData | ReportJobData;
	cron: string;
	queue: string;
};
