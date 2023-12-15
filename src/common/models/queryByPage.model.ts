import { PaginationMixin } from 'common/mixins';

import { BaseQuery } from './baseQuery.model';

export class QueryByPage extends PaginationMixin(BaseQuery) {
}
