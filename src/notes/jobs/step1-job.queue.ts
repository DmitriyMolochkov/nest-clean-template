import { createQueue } from 'infrastructure/bullmq';

import { NoteJobName } from '../enums';

export type JobData = { count: number };
export type JobReturnType = { count: number };

export const Step1JobQueue = createQueue<JobData, JobReturnType>(NoteJobName.step1);
