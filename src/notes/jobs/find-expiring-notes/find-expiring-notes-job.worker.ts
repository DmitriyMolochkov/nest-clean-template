import { InjectQueue, Processor } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  In,
  LessThan,
  Not,
  Repository,
} from 'typeorm';

import { CronExpression } from 'common/enum';
import {
  BaseRepeatableJobWorker,
  buildWorkerOptions,
  notFinishedJobTypes,
} from 'infrastructure/bullmq';

import { NoteEntity } from '../../entities';
import { NoteJobName, NoteStatus } from '../../enums';
import { NotesService } from '../../notes.service';
import { getDateToNearNoteExpiration } from '../../utils';
import { ExpireNoteJobQueue } from '../expire-note-job.types';
import { FindExpiringNotesJobQueue, ReturnType } from '../find-expiring-notes-job.types';

@Processor(NoteJobName.findExpiringNotes, buildWorkerOptions())
export class FindExpiringNotesJobWorker extends BaseRepeatableJobWorker<ReturnType> {
  protected readonly haveSensitiveData = false;

  protected readonly type = NoteJobName.findExpiringNotes;

  protected readonly jobOptions = {
    repeat: {
      pattern: CronExpression.EVERY_30_SECONDS,
    },
  };

  public constructor(
    @InjectPinoLogger(FindExpiringNotesJobWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(NoteJobName.findExpiringNotes)
    protected readonly findExpiringNotesJobQueue: FindExpiringNotesJobQueue,
    @InjectQueue(NoteJobName.expireNote) protected readonly expireNoteJobQueue: ExpireNoteJobQueue,
    private readonly noteService: NotesService,
    @InjectRepository(NoteEntity) private readonly noteRepository: Repository<NoteEntity>,
  ) {
    super(logger, findExpiringNotesJobQueue);
  }

  public async process() {
    const existJobs = await this.expireNoteJobQueue.getJobs(notFinishedJobTypes);

    const targetDate = getDateToNearNoteExpiration();
    const notesToExpire = await this.noteRepository.findBy({
      id: Not(In(existJobs.map((job) => job.data.id))),
      expirationDate: LessThan(targetDate),
      status: Not(NoteStatus.expired),
    });

    await Promise.all(notesToExpire.map(async (note) => this.noteService.addExpireNoteJob(note)));

    const noteIds = notesToExpire.map((note) => note.id);

    return {
      ids: noteIds,
      count: noteIds.length,
    };
  }
}
