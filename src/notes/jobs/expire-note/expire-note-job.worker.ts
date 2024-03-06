import { InjectQueue, Processor } from '@nestjs/bullmq';
import { BaseJobWorker, TypedQueue, buildWorkerOptions } from '@nestjs/bullmq-wrapper';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { NotesService } from '../../notes.service';
import { ExpireNoteJobQueue } from '../expire-note-job.queue';

@Processor(ExpireNoteJobQueue.name, buildWorkerOptions())
export class ExpireNoteJobWorker extends BaseJobWorker<typeof ExpireNoteJobQueue> {
  protected readonly haveSensitiveData = false;

  protected readonly type = ExpireNoteJobQueue.name;

  public constructor(
    @InjectPinoLogger(ExpireNoteJobWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(ExpireNoteJobQueue.name)
    protected readonly expireNoteJobQueue: TypedQueue<typeof ExpireNoteJobQueue>,
    protected readonly noteService: NotesService,
  ) {
    super(logger, expireNoteJobQueue);
  }

  public async process(...[job]: Parameters<BaseJobWorker<typeof ExpireNoteJobQueue>['process']>) {
    const note = await this.noteService.getById(job.data.id);

    await this.noteService.expireNote(note);

    return {
      id: note.id,
    };
  }

  public async completeHandler(
    ...[job, result]: Parameters<BaseJobWorker<typeof ExpireNoteJobQueue>['completeHandler']>
  ) {
    this.logger.info(
      {
        id: result.id,
        jobId: job.id,
      },
      'Note successfully expired by job',
    );
  }

  public async errorHandler(
    ...[job, error]: Parameters<BaseJobWorker<typeof ExpireNoteJobQueue>['errorHandler']>
  ) {
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
