import { NoteEntity } from './entities';
import { NoteStatus } from './enums';
import { HOURS_UNTIL_NEAR_NOTE_EXPIRATION } from './notes.constants';

export function getDateToNearNoteExpiration() {
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + HOURS_UNTIL_NEAR_NOTE_EXPIRATION);

  return targetDate;
}

export function isNoteNearExpiration(note: NoteEntity) {
  const result = note.status !== NoteStatus.expired
    && note.expirationDate < getDateToNearNoteExpiration();

  return result;
}

export function getDelayToExpire(note: NoteEntity) {
  const delay = note.expirationDate.getTime() - new Date().getTime();

  return delay > 0 ? delay : 0;
}
