import { BusinessException } from 'common/exceptions/business-exceptions';
import NoteEntity from 'notes/entities/note.entity';

export class ExampleNoteException extends BusinessException {
  public constructor(
    note: NoteEntity,
  ) {
    super(
      NoteEntity.name,
      note.id,
      'Example of a specific custom error for the note module only',
    );
  }
}
