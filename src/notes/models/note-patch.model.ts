import { PartialType } from '@nestjs/swagger';

import { NoteCreateModel } from './note-create.model';

export class NotePatchModel extends PartialType(NoteCreateModel) {
}
