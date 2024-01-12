import { InjectQueue, Processor } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  In,
  LessThan,
  Not,
  Repository,
} from 'typeorm';

import {
  BaseRepeatableJobWorker,
  TypedQueue,
  buildWorkerOptions,
  notFinishedJobTypes,
} from 'infrastructure/bullmq';

import { CronExpression } from '../../../common/enum';
import { NoteEntity } from '../../entities';
import { NoteStatus } from '../../enums';
import { NotesService } from '../../notes.service';
import { getDateToNearNoteExpiration } from '../../utils';
import { ExpireNoteJobQueue } from '../expire-note-job.queue';
import { FindExpiringNotesJobQueue } from '../find-expiring-notes-job.queue';

@Processor(FindExpiringNotesJobQueue.name, buildWorkerOptions())
export class FindExpiringNotesJobWorker
  extends BaseRepeatableJobWorker<typeof FindExpiringNotesJobQueue> {
  protected readonly haveSensitiveData = false;

  protected readonly type = FindExpiringNotesJobQueue.name;

  protected readonly jobOptions = {
    repeat: /* getNeverRepeatOptions(), */  {
      pattern: CronExpression.EVERY_5_SECONDS,
    },
  };

  public constructor(
    @InjectPinoLogger(FindExpiringNotesJobWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(FindExpiringNotesJobQueue.name)
    protected readonly findExpiringNotesJobQueue: TypedQueue<typeof FindExpiringNotesJobQueue>,
    @InjectQueue(ExpireNoteJobQueue.name)
    protected readonly expireNoteJobQueue: TypedQueue<typeof ExpireNoteJobQueue>,
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
