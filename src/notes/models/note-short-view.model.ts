import { NoteStatus } from '../enums';

export class NoteShortView {
  public readonly id: number;
  public readonly title: string;
  public readonly status: NoteStatus;
  public readonly expirationDate: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(entity: NoteShortView) {
    this.id = entity.id;
    this.title = entity.title;
    this.status = entity.status;
    this.expirationDate = entity.expirationDate;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
