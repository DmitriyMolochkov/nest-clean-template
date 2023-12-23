import { PaginationMixin } from 'common/mixins';

import { NoteQuery } from './note-query.model';

export class NoteQueryByPage extends PaginationMixin(NoteQuery) {
}
