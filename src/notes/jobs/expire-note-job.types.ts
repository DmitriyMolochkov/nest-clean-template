import { BaseJobWorker } from 'infrastructure/bullmq';

export type DataType = { id: number };
export type ReturnType = { id: number };
export type ExpireNoteJobWorkerType = BaseJobWorker<DataType, ReturnType>;
export type ExpireNoteJobQueue = ExpireNoteJobWorkerType['queue'];
