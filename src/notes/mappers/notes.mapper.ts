import { Injectable } from '@nestjs/common';

import { NoteEntity } from '../entities';
import { NoteShortView, NoteView } from '../models';

@Injectable()
export class NotesMapper {
  public mapToView(ormEntity: NoteEntity): NoteView {
    return new NoteView(ormEntity);
  }
    
  public mapToShortView(ormEntity: NoteEntity): NoteShortView {
    return new NoteShortView(ormEntity);
  }
}
