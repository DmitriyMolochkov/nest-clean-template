import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  Between,
  FindOptionsWhere,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import { buildJobOptions, notFinishedJobTypes } from 'infrastructure/bullmq';

import { NoteEntity } from './entities';
import { NoteJobName, NoteStatus } from './enums';
import {
  ExampleNoteException,
  NoteAccessException,
  NoteDuplicationException,
  NoteNotFoundException,
} from './exceptions/business-exceptions';
import { ExpireNoteJobQueue } from './jobs/expire-note-job.types';
import {
  NoteCreateModel,
  NotePatchModel,
  NoteQuery,
  NoteQueryByPage,
} from './models';
import { getDelayToExpire, isNoteNearExpiration } from './utils';

@Injectable()
export class NotesService {
  public constructor(
    @InjectPinoLogger(NotesService.name) private readonly logger: PinoLogger,
    @InjectRepository(NoteEntity) private readonly noteRepository: Repository<NoteEntity>,
    @InjectQueue(NoteJobName.expireNote) private readonly expireNoteJobQueue: ExpireNoteJobQueue,
  ) {}

  private getSearchFilter(query: NoteQuery) {
    const searchFilter: FindOptionsWhere<NoteEntity> = {};

    if (query.searchString) {
      searchFilter.title = ILike(`%${query.searchString}%`);
    }

    if (query.statuses) {
      searchFilter.status = In(query.statuses);
    }

    if (query.startDate && query.endDate) {
      searchFilter.createdAt = Between(query.startDate, query.endDate);
    } else if (query.startDate) {
      searchFilter.createdAt = MoreThanOrEqual(query.startDate);
    } else if (query.endDate) {
      searchFilter.createdAt = LessThanOrEqual(query.endDate);
    }

    return searchFilter;
  }

  public async array(query: NoteQuery = {}) {
    return this.noteRepository.find({
      where: this.getSearchFilter(query),
      order: { id: 'asc' },
    });
  }

  public async list(queryByPage: NoteQueryByPage) {
    return this.noteRepository.findAndCount({
      where: this.getSearchFilter(queryByPage),
      ...queryByPage.ormOpts,
      order: { id: 'asc' },
    });
  }

  public async getById(id: NoteEntity['id']) {
    const note = await this.noteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NoteNotFoundException(id);
    }

    return note;
  }

  public async create(createModel: NoteCreateModel) {
    const existNote = await this.noteRepository.findOneBy({ title: createModel.title });
    if (existNote) {
      throw new NoteDuplicationException(['title']);
    }

    const note = this.noteRepository.create({
      ...createModel,
      status: NoteStatus.active,
    });

    await this.noteRepository.save(note);

    this.logger.info({ id: note.id }, `${NoteEntity.name} created`);

    if (isNoteNearExpiration(note)) {
      await this.addExpireNoteJob(note);
    }

    return note;
  }

  public async update(
    note: NoteEntity,
    updateModel: NotePatchModel,
  ) {
    if (note.status === NoteStatus.expired) {
      throw new NoteAccessException(
        note.id,
        `It is forbidden to update a note in the '${note.status}' status`,
      );
    }

    if (updateModel.title) {
      const existNote = await this.noteRepository.findOneBy({
        id: Not(note.id),
        title: updateModel.title,
      });
      if (existNote) {
        throw new NoteDuplicationException(['title']);
      }
    }

    const previousFields = {
      title: note.title,
      description: note.description,
      expirationDate: note.expirationDate,
      text: note.text,
    };

    this.noteRepository.merge(note, { ...updateModel });
    await this.noteRepository.save(note);

    this.logger.info({ id: note.id }, `${NoteEntity.name} updated`);

    const previousExpirationTime = new Date(previousFields.expirationDate).getTime();
    const newExpirationTime = new Date(note.expirationDate).getTime();
    if (previousExpirationTime !== newExpirationTime) {
      await this.removeExpireNoteJobs(note.id);
      if (isNoteNearExpiration(note)) {
        await this.addExpireNoteJob(note);
      }
    }

    return note;
  }

  public async remove(id: NoteEntity['id']) {
    const note = await this.noteRepository.findOneBy({ id });

    if (!note) {
      throw new NoteNotFoundException(id);
    }

    await note.remove();

    this.logger.info({ id }, `${NoteEntity.name} removed`);

    await this.removeExpireNoteJobs(id);
  }

  public async changeStatus(
    note: NoteEntity,
    status: NoteStatus,
    acceptableStatuses?: NoteStatus[],
  ) {
    const previousStatus = note.status;

    if (acceptableStatuses && !acceptableStatuses.includes(previousStatus)) {
      throw new NoteAccessException(
        note.id,
        `Note record is in invalid status '${note.status}'.`
          + ` Valid statuses are: ${acceptableStatuses.map((s) => `'${s}'`).join(', ')}.`,
      );
    }

    note.status = status;
    await this.noteRepository.save(note);

    this.logger.info(
      {
        id: note.id,
        previousStatus,
        newState: note.status,
      },
      `${NoteEntity.name} status updated`,
    );

    return note;
  }

  public async expireNote(note: NoteEntity) {
    note.text = note.text.replace(/\p{L}/gu, '*');

    await this.changeStatus(
      note,
      NoteStatus.expired,
      [
        NoteStatus.active,
        NoteStatus.inactive,
      ],
    );

    this.logger.info({ id: note.id }, 'Note expired');
  }

  public async addExpireNoteJob(note: NoteEntity) {
    await this.expireNoteJobQueue.add(
      'job',
      {
        id: note.id,
      },
      buildJobOptions({
        delay: getDelayToExpire(note),
      }),
    );
  }

  public async removeExpireNoteJobs(noteId: NoteEntity['id']) {
    const jobs = await this.expireNoteJobQueue.getJobs(notFinishedJobTypes);

    const jobsOfNote = jobs.filter((job) => job.data.id === noteId);

    await Promise.all(jobsOfNote.map(async (job) => job.remove()));
  }

  public async exampleError(id: NoteEntity['id']) {
    const note = await this.noteRepository.findOneBy({ id });

    if (!note) {
      throw new NoteNotFoundException(id);
    }

    throw new ExampleNoteException(note);
  }
}
