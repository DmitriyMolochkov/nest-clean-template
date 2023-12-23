import {
  AccessException,
  DuplicationException,
  NotFoundException,
} from 'common/exceptions/business-exceptions';

import { NoteEntity } from '../../entities';

export * from './example-note.exception';

const NoteAccessException = AccessException.bind(undefined, NoteEntity.name);
const NoteDuplicationException = (DuplicationException<NoteEntity>)
  .bind(undefined, NoteEntity.name);
const NoteNotFoundException = NotFoundException.bind(undefined, NoteEntity.name);

export {
  NoteAccessException,
  NoteDuplicationException,
  NoteNotFoundException,
};
