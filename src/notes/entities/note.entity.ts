import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { NoteStatus } from 'notes/enums/note-status.enum';
import { MAX_DESCRIPTION_LENGTH, MAX_TEXT_LENGTH, MAX_TITLE_LENGTH } from 'notes/notes.constants';

@Entity({ name: 'notes' })
export default class NoteEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'varchar',
    length: MAX_TITLE_LENGTH,
  })
  public title!: string;

  @Column({
    type: 'varchar',
    length: MAX_DESCRIPTION_LENGTH,
    nullable: true,
  })
  public description!: string | null;

  @Column({
    type: 'enum',
    enum: NoteStatus,
  })
  public status!: NoteStatus;

  @Column({
    type: 'varchar',
    length: MAX_TEXT_LENGTH,
  })
  public text!: string;

  @Column({ type: 'timestamptz' })
  public expirationDate!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt!: Date;
}
