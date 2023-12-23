import { InjectQueue, Processor } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobWorker, buildWorkerOptions } from 'infrastructure/bullmq';

import { NoteJobName } from '../../enums';
import { NotesService } from '../../notes.service';
import {
  DataType,
  ExpireNoteJobQueue,
  ExpireNoteJobWorkerType,
  ReturnType,
} from '../expire-note-job.types';

@Processor(NoteJobName.expireNote, buildWorkerOptions())
export class ExpireNoteJobWorker extends BaseJobWorker<DataType, ReturnType> {
  protected readonly haveSensitiveData = false;

  protected readonly type = NoteJobName.expireNote;

  public constructor(
    @InjectPinoLogger(ExpireNoteJobWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(NoteJobName.expireNote) protected readonly expireNoteJobQueue: ExpireNoteJobQueue,
    protected readonly noteService: NotesService,
  ) {
    super(logger, expireNoteJobQueue);
  }

  public async process(...[job]: Parameters<ExpireNoteJobWorkerType['process']>) {
    const note = await this.noteService.getById(job.data.id);

    await this.noteService.expireNote(note);

    return {
      id: note.id,
    };
  }

  public async completeHandler(
    ...[job, result]: Parameters<ExpireNoteJobWorkerType['completeHandler']>
  ) {
    this.logger.info(
      {
        id: result.id,
        jobId: job.id,
      },
      'Note successfully expired by job',
    );
  }

  public async errorHandler(...[job, error]: Parameters<ExpireNoteJobWorkerType['errorHandler']>) {
    this.logger.error(
      {
        id: job.data.id,
        jobId: job.id,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      'Error while expire note by job',
    );
  }
}
