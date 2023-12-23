import { NoteStatus } from '../enums';

export class NoteView {
  public readonly id: number;
  public readonly title: string;
  public readonly description: string | null;
  public readonly status: NoteStatus;
  public readonly text: string;
  public readonly expirationDate: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(entity: NoteView) {
    this.id = entity.id;
    this.title = entity.title;
    this.description = entity.description;
    this.status = entity.status;
    this.text = entity.text;
    this.expirationDate = entity.expirationDate;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
