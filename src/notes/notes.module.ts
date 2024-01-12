import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteEntity } from './entities';
import { ExpireNoteJobQueueEvents, ExpireNoteJobWorker } from './jobs/expire-note';
import { ExpireNoteJobQueue } from './jobs/expire-note-job.queue';
import {
  FindExpiringNotesJobQueueEvents,
  FindExpiringNotesJobWorker,
} from './jobs/find-expiring-notes';
import { FindExpiringNotesJobQueue } from './jobs/find-expiring-notes-job.queue';
import { Step1JobQueueEvents, Step1JobWorker } from './jobs/step1';
import { Step1JobQueue } from './jobs/step1-job.queue';
import { Step2JobQueueEvents, Step2JobWorker } from './jobs/step2';
import { Step2JobQueue } from './jobs/step2-job.queue';
import { NotesMapper } from './mappers';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { registerBullQueue } from '../infrastructure/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteEntity]),
    ...registerBullQueue(
      ExpireNoteJobQueue,
      FindExpiringNotesJobQueue,
      Step1JobQueue,
      Step2JobQueue,
    ),
    BullModule.registerFlowProducer(
      { name: 'my-first-flow-producer' },
    ),
  ],
  providers: [
    NotesService,
    NotesMapper,
    ExpireNoteJobWorker,
    ExpireNoteJobQueueEvents,
    FindExpiringNotesJobWorker,
    FindExpiringNotesJobQueueEvents,
    Step1JobWorker,
    Step1JobQueueEvents,
    Step2JobWorker,
    Step2JobQueueEvents,
  ],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
