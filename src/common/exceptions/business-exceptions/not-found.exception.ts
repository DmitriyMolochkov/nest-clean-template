import { BusinessException } from './business.exception';

export class NotFoundException extends BusinessException {
  public constructor(
    entityName?: string,
    entityId?: number,
    message?: string,
  ) {
    super(
      entityName,
      entityId,
      message ?? `${entityName ?? 'Entity'} not found`,
    );
  }
}
