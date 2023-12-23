import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NoteEntity } from './entities';
import { NoteJobName } from './enums';
import { ExpireNoteJobQueueEvents, ExpireNoteJobWorker } from './jobs/expire-note';
import {
  FindExpiringNotesJobQueueEvents,
  FindExpiringNotesJobWorker,
} from './jobs/find-expiring-notes';
import { NotesMapper } from './mappers';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteEntity]),
    BullModule.registerQueue(
      { name: NoteJobName.expireNote },
      { name: NoteJobName.findExpiringNotes },
    ),
    BullBoardModule.forFeature(
      {
        name: NoteJobName.expireNote,
        adapter: BullMQAdapter,
      },
      {
        name: NoteJobName.findExpiringNotes,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [
    NotesService,
    NotesMapper,
    ExpireNoteJobWorker,
    ExpireNoteJobQueueEvents,
    FindExpiringNotesJobWorker,
    FindExpiringNotesJobQueueEvents,
  ],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
